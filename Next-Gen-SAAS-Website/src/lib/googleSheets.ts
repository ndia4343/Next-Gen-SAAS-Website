/**
 * Google Sheets Webhook Dispatcher
 * Forwards leads from the Quote Modal & Voice Receptionist to Google Apps Script.
 */

export interface GoogleSheetsLeadPayload {
  source?: string;
  name?: string;
  caller_name?: string;
  phone?: string;
  whatsapp_number?: string;
  email?: string;
  work_email?: string;
  requested_systems?: string[] | string;
  business_type?: string;
  volume?: string;
  estimated_monthly_volume?: string;
  notes?: string;
  call_summary?: string;
}

export async function forwardLeadToGoogleSheets(payload: GoogleSheetsLeadPayload): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    // Graceful no-op if webhook is not configured yet
    return false;
  }

  try {
    const body = {
      source: payload.source || "Website Modal",
      caller_name: payload.caller_name || payload.name || "N/A",
      whatsapp_number: payload.whatsapp_number || payload.phone || "N/A",
      work_email: payload.work_email || payload.email || "N/A",
      requested_systems: Array.isArray(payload.requested_systems)
        ? payload.requested_systems
        : (payload.requested_systems ? [payload.requested_systems] : [payload.business_type || "N/A"]),
      estimated_monthly_volume: payload.estimated_monthly_volume || payload.volume || "N/A",
      call_summary: payload.call_summary || payload.notes || "Inbound submission",
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch (err) {
    console.error("[Google Sheets Dispatch Failed]:", err);
    return false;
  }
}
