import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Generate secure token (randomUUID is available in Node 16.7+)
    const token = crypto.randomUUID();
    
    // Set expiration for 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const reviewToken = await prisma.reviewToken.create({
      data: {
        token,
        agentId,
        expiresAt
      }
    });

    return NextResponse.json({ 
      token: reviewToken.token,
      url: `/review/${reviewToken.token}`
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
