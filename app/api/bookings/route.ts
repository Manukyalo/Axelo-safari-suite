import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Zod schema updated for Tour Operator structure
const bookingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid corporate email address' }),
  phone: z.string().min(6, { message: 'Phone number must be at least 6 characters' }),
  company: z.string().min(2, { message: 'Tour Operator name must be at least 2 characters' }),
  safariDrivers: z.string().regex(/^\d+$/, { message: 'Safari drivers must be a number' }),
  cityDrivers: z.string().regex(/^\d+$/, { message: 'City drivers must be a number' }),
  guides: z.string().regex(/^\d+$/, { message: 'Guides must be a number' }),
  preferredDate: z.string().min(1, { message: 'Preferred date is required' }),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = bookingSchema.parse(body);

    const bookingId = `BK-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
    const timestamp = new Date().toISOString();

    const totalStaff =
      Number(validatedData.safariDrivers) +
      Number(validatedData.cityDrivers) +
      Number(validatedData.guides);

    // 1. Redundant Safety Persistence — local JSON fallback
    let localSaveSuccess = false;
    try {
      const dbDir = path.join(process.cwd(), 'lib/db');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      const dbPath = path.join(dbDir, 'bookings.json');
      let bookings = [];

      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        try {
          bookings = JSON.parse(fileContent || '[]');
        } catch {
          bookings = [];
        }
      }

      const newBooking = {
        id: bookingId,
        createdAt: timestamp,
        ...validatedData,
        totalStaff,
      };

      bookings.push(newBooking);
      fs.writeFileSync(dbPath, JSON.stringify(bookings, null, 2), 'utf-8');
      localSaveSuccess = true;
      console.log(`[BOOKING SYSTEM] Local transaction persisted for ${bookingId}`);
    } catch (dbError) {
      console.error('[BOOKING SYSTEM] Local database fallback failure:', dbError);
    }

    // 2. Resend Email Dispatch
    let emailSent = false;
    let emailErrorLog = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Axelo Briefing Request</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0b0a; color: #f7f4f0; margin: 0; padding: 24px; }
                .container { max-width: 600px; margin: 0 auto; background: #141211; border: 1px solid #c8a27d20; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
                .header { background: linear-gradient(135deg, #1d1917 0%, #141211 100%); padding: 32px 24px; text-align: center; }
                .logo-text { font-size: 20px; letter-spacing: 0.2em; color: #c8a27d; text-transform: uppercase; font-weight: 500; margin: 0; }
                .subtitle { font-size: 11px; font-family: monospace; color: #a3958c; letter-spacing: 0.1em; margin: 6px 0 0 0; }
                .content { padding: 32px 24px; }
                .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #c8a27d; margin: 24px 0 12px 0; font-weight: 600; border-bottom: 1px solid #c8a27d15; padding-bottom: 6px; }
                .field { background: #1d1917; border: 1px solid #c8a27d08; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; }
                .label { font-size: 10px; color: #a3958c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
                .value { font-size: 14px; color: #f7f4f0; font-weight: 500; }
                .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .badge { display: inline-block; background: rgba(200,162,125,0.15); color: #c8a27d; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-family: monospace; font-weight: bold; }
                .notes-box { background: #1c1816; border-left: 3px solid #c8a27d; padding: 14px 16px; border-radius: 4px; font-size: 13px; color: #e5dfd8; margin-top: 8px; line-height: 1.6; font-style: italic; }
                .footer { background: #0d0b0a; padding: 20px 24px; text-align: center; font-size: 11px; color: #a3958c; border-top: 1px solid #c8a27d10; }
                .ref-badge { display: inline-block; background: rgba(200,162,125,0.1); color: #c8a27d; padding: 4px 12px; border-radius: 4px; font-family: monospace; font-size: 13px; font-weight: bold; margin-bottom: 8px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo-text">Axelo Safari Suite</div>
                  <div class="subtitle">AUTOMATED OPERATIONAL BRIEFING DELEGATOR</div>
                </div>
                <div class="content">
                  <div style="text-align:center; margin-bottom:24px;">
                    <div class="ref-badge">${bookingId}</div>
                    <div style="font-size:14px; color:#e5dfd8;">New tour operator briefing request received.</div>
                  </div>

                  <div class="section-title">Tour Operator Profile</div>
                  <div class="grid2">
                    <div class="field"><div class="label">Full Name</div><div class="value">${validatedData.name}</div></div>
                    <div class="field"><div class="label">Tour Operator</div><div class="value">${validatedData.company}</div></div>
                    <div class="field"><div class="label">Corporate Email</div><div class="value"><a href="mailto:${validatedData.email}" style="color:#c8a27d;text-decoration:none;">${validatedData.email}</a></div></div>
                    <div class="field"><div class="label">Direct Phone</div><div class="value">${validatedData.phone}</div></div>
                  </div>

                  <div class="section-title">Fleet & Staff Scale</div>
                  <div class="grid2">
                    <div class="field"><div class="label">Safari Drivers</div><div class="value">${validatedData.safariDrivers}</div></div>
                    <div class="field"><div class="label">City Drivers</div><div class="value">${validatedData.cityDrivers}</div></div>
                    <div class="field"><div class="label">Guides</div><div class="value">${validatedData.guides}</div></div>
                    <div class="field"><div class="label">Total Field Staff</div><div class="value"><span class="badge">${totalStaff} Personnel</span></div></div>
                  </div>

                  <div class="section-title">Engagement Details</div>
                  <div class="field"><div class="label">Target Demo Date</div><div class="value">${validatedData.preferredDate}</div></div>

                  ${validatedData.notes ? `
                    <div class="section-title">Special Requirements</div>
                    <div class="notes-box">"${validatedData.notes.replace(/\n/g, '<br>')}"</div>
                  ` : ''}
                </div>
                <div class="footer">
                  Transaction secured at ${new Date(timestamp).toLocaleString()} · Ref: SEC-${bookingId.slice(3)} · Axelo Core.
                </div>
              </div>
            </body>
          </html>
        `;

        const emailResponse = await resend.emails.send({
          from: 'Axelo Operations <onboarding@resend.dev>',
          to: 'concierge@axelosafari.com',
          subject: `[Briefing Request] ${validatedData.company} — ${totalStaff} Staff · ${bookingId}`,
          html: htmlContent,
        });

        if (emailResponse.error) {
          console.error('[BOOKING SYSTEM] Resend dispatch failed:', emailResponse.error);
          emailErrorLog = emailResponse.error.message;
        } else {
          console.log(`[BOOKING SYSTEM] Email dispatched for ${bookingId}. ID: ${emailResponse.data?.id}`);
          emailSent = true;
        }
      } catch (err) {
        console.error('[BOOKING SYSTEM] Fatal Resend exception:', err);
        emailErrorLog = err instanceof Error ? err.message : 'Unknown network error';
      }
    } else {
      console.warn('[BOOKING SYSTEM] RESEND_API_KEY missing. Email dispatch skipped.');
      emailErrorLog = 'Missing RESEND_API_KEY in server environment';
    }

    return NextResponse.json({
      success: true,
      bookingId,
      emailDispatched: emailSent,
      localPersisted: localSaveSuccess,
      message: emailSent
        ? 'Briefing request submitted and Operations team notified.'
        : 'Briefing request received and queued locally.',
      errorContext: emailSent ? null : emailErrorLog,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.flatten().fieldErrors,
      }, { status: 400 });
    }

    console.error('[BOOKING SYSTEM] Fatal booking crash:', error);
    return NextResponse.json({
      success: false,
      error: 'Operations transaction failed. Please contact concierge.',
    }, { status: 500 });
  }
}
