import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Zod Schema to strictly validate form entries at the backend boundaries (Rule 2 & 5)
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
    
    // Perform Zod validation of request payload
    const validatedData = bookingSchema.parse(body);

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
      id: `BK-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString(),
      ...validatedData,
    };

    bookings.push(newBooking);
    fs.writeFileSync(dbPath, JSON.stringify(bookings, null, 2), 'utf-8');

    // Structural log message detailing operational briefings scheduled
    console.log(`[BOOKING SYSTEM] Session ${newBooking.id} scheduled for ${newBooking.name} (${newBooking.company})`);

    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      message: 'Briefing request submitted successfully',
    }, { status: 201 }); // 201 Created

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.flatten().fieldErrors,
      }, { status: 400 }); // 400 Bad Request
    }

    console.error('[BOOKING SYSTEM] Fatal execution handler exception:', error);
    return NextResponse.json({
      success: false,
      error: 'Operations database transaction failed. Please try again.',
    }, { status: 500 }); // 500 Internal Server Error
  }
}
