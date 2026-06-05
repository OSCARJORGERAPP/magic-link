import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { generateToken } from '@/lib/jwt';
import { sendMagicLinkEmail } from '@/lib/email';
import { validateEmail, sanitizeEmail } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);
    const { db } = await connectToDatabase();

    const collection = db.collection('users');

    let user = await collection.findOne({ email: sanitizedEmail });

    if (!user) {
      // Create new user
      const result = await collection.insertOne({
        email: sanitizedEmail,
        accessCount: 1,
        createdAt: new Date(),
        lastAccessAt: new Date(),
      });

      user = {
        _id: result.insertedId,
        email: sanitizedEmail,
        accessCount: 1,
        createdAt: new Date(),
        lastAccessAt: new Date(),
      };
    } else {
      // Update existing user
      await collection.updateOne(
        { email: sanitizedEmail },
        {
          $inc: { accessCount: 1 },
          $set: { lastAccessAt: new Date() },
        }
      );
      user.accessCount += 1;
    }

    // Generate token
    const token = generateToken(sanitizedEmail);

    // Send email
    const emailSent = await sendMagicLinkEmail(sanitizedEmail, token);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Magic link sent to your email',
        email: sanitizedEmail,
        token,
        isNewUser: !user.createdAt || user.accessCount === 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-magic-link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
