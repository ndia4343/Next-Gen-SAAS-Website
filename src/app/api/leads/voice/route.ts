import { NextRequest, NextResponse } from 'next/server';
import { recordLeadSubmission } from '@/lib/db';
import { forwardLeadToGoogleSheets } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const callerName = data.caller_name || data.name || 'Phone Inbound';
    const phone = data.whatsapp_number || data.phone || 'N/A';
    const email = data.work_email || data.email || 'pending@voice-intake.io';
    const requestedSystems = Array.isArray(data.requested_systems)
      ? data.requested_systems.join(', ')
      : data.business_type || 'AI Voice Receptionist';
    const volume = data.estimated_monthly_volume || data.volume || 'Standard';
    const summary = data.call_summary || data.notes || 'Voice receptionist intake call completed.';

    // Save lead to local/persistent DB
    const saved = await recordLeadSubmission({
      name: callerName,
      email: email,
      phone: phone,
      selectedService: requestedSystems,
      projectScope: `[Voice Call Intake • Volume: ${volume}] ${summary}`,
      timeline: 'Immediate',
    });

    // Forward to Google Sheets Webhook
    await forwardLeadToGoogleSheets({
      source: data.source || 'AI Voice Receptionist',
      caller_name: callerName,
      whatsapp_number: phone,
      work_email: email,
      requested_systems: requestedSystems,
      estimated_monthly_volume: volume,
      call_summary: summary,
    });

    return NextResponse.json({
      status: 'success',
      leadId: saved.id,
      message: 'Voice lead processed, persisted, and forwarded to Google Sheets.',
    });
  } catch (err: any) {
    console.error('[Voice Webhook Intake Error]:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Intake failed' },
      { status: 500 }
    );
  }
}
