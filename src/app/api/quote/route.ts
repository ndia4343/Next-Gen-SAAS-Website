import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { QuoteSchema } from '@/lib/types';
import { recordLeadSubmission } from '@/lib/db';
import { resolveGeoLocation } from '@/lib/geo';
import { forwardLeadToGoogleSheets } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both multi-select arrays (services / architectures) and single service string
    const rawServices: string[] =
      Array.isArray(body.services) && body.services.length > 0
        ? body.services
        : Array.isArray(body.architectures) && body.architectures.length > 0
        ? body.architectures
        : body.selectedService
        ? [body.selectedService]
        : ['Full-Stack Architecture'];

    const normalizedPayload = {
      ...body,
      selectedService: body.selectedService || rawServices.join(', '),
      projectScope:
        body.projectScope ||
        `[Monthly Volume: ${body.leadVolume || 'Unspecified'}] ${
          body.notes || 'Inbound scope inquiry via booking modal.'
        }`,
      timeline: body.timeline || 'Immediate',
    };

    const validatedData = QuoteSchema.parse(normalizedPayload);
    const geo = await resolveGeoLocation(req.headers);

    // 1. Save lead with stitched telemetry into DB
    const savedLead = await recordLeadSubmission({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company,
      selectedService: validatedData.selectedService,
      projectScope: validatedData.projectScope,
      timeline: validatedData.timeline,
      visitorId: validatedData.visitorId,
      ipAddress: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
    });

    console.log('[ZAVIAN LABS Lead Stitched & Persisted]:', savedLead);

    // 2. Forward to Google Sheets Webhook asynchronously
    forwardLeadToGoogleSheets({
      source: body.source || 'Website Modal',
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email,
      requested_systems: rawServices,
      volume: body.leadVolume || 'Standard',
      notes: body.notes || validatedData.projectScope,
    }).catch((err) => console.warn('[Google Sheets Sync Non-blocking Error]:', err));

    // 3. Dispatch Dual Parallel Emails via Hostinger SMTP
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER || 'contact@zavianlabs.com',
          pass: process.env.SMTP_PASS,
        },
      });

      const architecturesHtml = rawServices.map((s) => `• ${s}`).join('<br>');
      const clientLocation = [geo.city, geo.region, geo.country].filter(Boolean).join(', ') || 'Unknown';

      // (a) Internal Alert to contact@zavianlabs.com (Reply-To points directly to user)
      const adminMailOptions = {
        from: `"Zavian Labs Platform" <${process.env.SMTP_USER || 'contact@zavianlabs.com'}>`,
        to: 'contact@zavianlabs.com',
        replyTo: validatedData.email,
        subject: `[New Lead] Demo & Architecture Request: ${validatedData.name} (${validatedData.company || 'Direct'})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="border-bottom: 2px solid #7c3aed; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px;">New Autonomous Pipeline Request</h2>
              <p style="color: #64748b; margin: 4px 0 0; font-size: 13px;">Inbound from Zavian Labs Platform</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${validatedData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${validatedData.email}" style="color: #7c3aed;">${validatedData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${validatedData.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Company:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${validatedData.company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Location:</strong></td>
                <td style="padding: 8px 0; color: #0f172a;">${clientLocation} (IP: ${geo.ip || 'N/A'})</td>
              </tr>
            </table>

            <div style="margin-top: 18px; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <strong style="color: #0f172a; font-size: 12px; text-transform: uppercase;">Requested Architectures:</strong>
              <div style="margin-top: 8px; color: #334155; font-size: 14px; line-height: 1.6;">
                ${architecturesHtml}
              </div>
            </div>

            <div style="margin-top: 16px; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <strong style="color: #0f172a; font-size: 12px; text-transform: uppercase;">Project Scope / Notes:</strong>
              <p style="margin: 6px 0 0; color: #334155; font-size: 14px; line-height: 1.5;">${body.notes || validatedData.projectScope}</p>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">
              Hit <strong>Reply</strong> in your mail client to contact ${validatedData.name} (${validatedData.email}) directly.
            </div>
          </div>
        `,
      };

      // (b) Instant Receipt Email sent to the Prospect
      const clientMailOptions = {
        from: `"Zavian Labs" <${process.env.SMTP_USER || 'contact@zavianlabs.com'}>`,
        to: validatedData.email,
        subject: `We've received your architecture request — Zavian Labs`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Hi ${validatedData.name},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Thank you for reaching out to <strong>Zavian Labs</strong>. We have received your demonstration request and initial pipeline specifications.
            </p>

            <div style="margin: 18px 0; padding: 14px; background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px;">
              <strong style="color: #5b21b6; font-size: 12px; text-transform: uppercase;">Selected Deployments:</strong>
              <div style="margin-top: 6px; font-size: 13px; color: #4c1d95; line-height: 1.6;">
                ${architecturesHtml}
              </div>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Our solutions team is reviewing your requirements. We will reply directly to this thread within 4 hours to coordinate your live walkthrough.
            </p>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b;">
              Best regards,<br>
              <strong style="color: #0f172a;">Engineering & Solutions Team</strong><br>
              Zavian Labs · <a href="https://zavianlabs.com" style="color: #7c3aed; text-decoration: none;">zavianlabs.com</a>
            </div>
          </div>
        `,
      };

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(clientMailOptions),
      ]);
      console.log('[ZAVIAN LABS Email Dispatch]: Notifications successfully sent');
    } catch (mailError) {
      console.error('[Nodemailer Dispatch Error]:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Scope received. A ZAVIAN LABS lead architect will contact you within 4 hours.',
      inquiryId: savedLead.id,
      lead: savedLead,
    });
  } catch (err: any) {
    console.error('Quote error:', err);
    return NextResponse.json(
      { success: false, errors: err.errors || 'Validation failure' },
      { status: 400 }
    );
  }
}