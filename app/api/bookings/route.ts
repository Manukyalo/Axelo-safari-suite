import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Strict validation of the Resend client at runtime (Rule 2 & 5)
const bookingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid corporate email address' }),
  phone: z.string().min(6, { message: 'Phone number must be at least 6 characters' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  lodgeCount: z.enum(['1-5', '6-20', '21+']),
  preferredDate: z.string().min(1, { message: 'Preferred date is required' }),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Perform strict schema validation at boundary
    const validatedData = bookingSchema.parse(body);

    const bookingId = `BK-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
    const timestamp = new Date().toISOString();

    // 1. Redundant Safety Persistence (Write locally to JSON file)
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
      };

      bookings.push(newBooking);
      fs.writeFileSync(dbPath, JSON.stringify(bookings, null, 2), 'utf-8');
      localSaveSuccess = true;
      console.log(`[BOOKING SYSTEM] Local transaction persisted for ${bookingId}`);
    } catch (dbError) {
      console.error('[BOOKING SYSTEM] Local database fallback failure:', dbError);
    }

    // 2. Dispatch Email Notification via Resend (Rule 4 & 5)
    let emailSent = false;
    let emailErrorLog = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Premium corporate HTML notification template with gold and carbon aesthetics
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Axelo Briefing Request</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: #0d0b0a;
                  color: #f7f4f0;
                  margin: 0;
                  padding: 24px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #141211;
                  border: 1px solid #c8a27d20;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
                }
                .header {
                  background: linear-gradient(135deg, #1d1917 0%, #141211 100%);
                  padding: 32px 24px;
                  text-align: center;
                  border-b: 1px solid #c8a27d15;
                }
                .logo-text {
                  font-size: 20px;
                  letter-spacing: 0.2em;
                  color: #c8a27d;
                  text-transform: uppercase;
                  font-weight: 500;
                  margin: 0;
                }
                .subtitle {
                  font-size: 11px;
                  font-family: monospace;
                  color: #a3958c;
                  letter-spacing: 0.1em;
                  margin: 6px 0 0 0;
                }
                .content {
                  padding: 32px 24px;
                }
                .section-title {
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.15em;
                  color: #c8a27d;
                  margin-top: 0;
                  margin-bottom: 16px;
                  font-weight: 600;
                  border-bottom: 1px solid #c8a27d15;
                  padding-bottom: 6px;
                }
                .grid {
                  display: grid;
                  grid-template-cols: 1fr;
                  gap: 16px;
                  margin-bottom: 28px;
                }
                .field {
                  background: #1d1917;
                  border: 1px solid #c8a27d08;
                  padding: 12px 16px;
                  border-radius: 8px;
                }
                .label {
                  font-size: 10px;
                  color: #a3958c;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-bottom: 4px;
                }
                .value {
                  font-size: 14px;
                  color: #f7f4f0;
                  font-weight: 500;
                }
                .notes-box {
                  background: #1c1816;
                  border-left: 3px solid #c8a27d;
                  padding: 16px;
                  border-radius: 4px;
                  font-style: italic;
                  font-size: 13px;
                  color: #e5dfd8;
                  margin-top: 12px;
                  line-height: 1.6;
                }
                .footer {
                  background: #0d0b0a;
                  padding: 24px;
                  text-align: center;
                  font-size: 11px;
                  color: #a3958c;
                  border-top: 1px solid #c8a27d10;
                }
                .ref-badge {
                  display: inline-block;
                  background: rgba(200, 162, 125, 0.1);
                  color: #c8a27d;
                  padding: 4px 10px;
                  border-radius: 4px;
                  font-family: monospace;
                  font-size: 12px;
                  margin-bottom: 8px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo-text">Axelo Safari Suite</div>
                  <div class="subtitle">AUTOMATED OPERATIONAL BRIEFING DELEGATOR</div>
                </div>
                <div class="content">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <div class="ref-badge">${bookingId}</div>
                    <div style="font-size: 14px; color: #e5dfd8;">New corporate briefing has been successfully requested.</div>
                  </div>

                  <div class="section-title">Client Profile</div>
                  <div class="grid">
                    <div class="field">
                      <div class="label">Full Name</div>
                      <div class="value">${validatedData.name}</div>
                    </div>
                    <div class="field">
                      <div class="label">Company Name</div>
                      <div class="value">${validatedData.company}</div>
                    </div>
                    <div class="field">
                      <div class="label">Corporate Email</div>
                      <div class="value"><a href="mailto:${validatedData.email}" style="color: #c8a27d; text-decoration: none;">${validatedData.email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">Direct Phone</div>
                      <div class="value">${validatedData.phone}</div>
                    </div>
                  </div>

                  <div class="section-title">Operational Scope</div>
                  <div class="grid">
                    <div class="field">
                      <div class="label">Active Lodge Capacity</div>
                      <div class="value">${validatedData.lodgeCount} Lodges</div>
                    </div>
                    <div class="field">
                      <div class="label">Target Briefing / Onboarding Date</div>
                      <div class="value">${validatedData.preferredDate}</div>
                    </div>
                  </div>

                  ${validatedData.notes ? `
                    <div class="section-title">Special Request Notes</div>
                    <div class="notes-box">
                      "${validatedData.notes.replace(/\n/g, '<br>')}"
                    </div>
                  ` : ''}
                </div>
                <div class="footer">
                  This transaction was securely validated and routed at ${new Date(timestamp).toLocaleString()}<br>
                  Security ID: SEC-REF-${bookingId.slice(3)} · Axelo Security Core.
                </div>
              </div>
            </body>
          </html>
        `;

        const emailResponse = await resend.emails.send({
          from: 'Axelo Operations <onboarding@resend.dev>',
          to: 'concierge@axelosafari.com',
          subject: `[Briefing Request] ${validatedData.company} — ${bookingId}`,
          html: htmlContent,
        });

        if (emailResponse.error) {
          console.error('[BOOKING SYSTEM] Resend email dispatch failed:', emailResponse.error);
          emailErrorLog = emailResponse.error.message;
        } else {
          console.log(`[BOOKING SYSTEM] Resend email successfully dispatched for session ${bookingId}. ID: ${emailResponse.data?.id}`);
          emailSent = true;
        }
      } catch (err) {
        console.error('[BOOKING SYSTEM] Fatal Resend execution handler exception:', err);
        emailErrorLog = err instanceof Error ? err.message : 'Unknown network error';
      }
    } else {
      console.warn('[BOOKING SYSTEM] RESEND_API_KEY environment variable is missing. Email dispatch skipped.');
      emailErrorLog = 'Missing RESEND_API_KEY in server environment variables';
    }

    // Return consistent shape back to customer client with redundant persistence success details (Rule 4)
    return NextResponse.json({
      success: true,
      bookingId,
      emailDispatched: emailSent,
      localPersisted: localSaveSuccess,
      message: emailSent
        ? 'Briefing request submitted and Operations team notified.'
        : 'Briefing request received and queued locally.',
      errorContext: emailSent ? null : emailErrorLog,
    }, { status: 201 }); // 201 Created

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.flatten().fieldErrors,
      }, { status: 400 }); // 400 Bad Request
    }

    console.error('[BOOKING SYSTEM] Fatal booking transaction crash:', error);
    return NextResponse.json({
      success: false,
      error: 'Operations transaction failed to synchronize. Please contact concierge.',
    }, { status: 500 }); // 500 Internal Server Error
  }
}
