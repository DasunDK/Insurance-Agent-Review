import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, overallRating, comment, answers, reviewerEmail } = body;

    if (!token || !overallRating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify Token
    const reviewToken = await prisma.reviewToken.findUnique({
      where: { token },
      include: { agent: true }
    });

    if (!reviewToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (reviewToken.isUsed) {
      return NextResponse.json({ error: 'Token has already been used' }, { status: 403 });
    }

    if (reviewToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 403 });
    }

    // 2. Process Review using Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the main review
      const review = await tx.review.create({
        data: {
          agentId: reviewToken.agentId,
          overallRating,
          comment,
          reviewerEmail,
          status: 'APPROVED' // Or 'PENDING' based on moderation needs
        }
      });

      // Insert answers to specific questions if provided
      if (answers && Array.isArray(answers) && answers.length > 0) {
        const answerData = answers.map((ans: { questionId: string, rating: number }) => ({
          reviewId: review.id,
          questionId: ans.questionId,
          rating: ans.rating
        }));
        
        await tx.answer.createMany({
          data: answerData
        });
      }

      // Mark token as used
      await tx.reviewToken.update({
        where: { id: reviewToken.id },
        data: { isUsed: true }
      });

      return review;
    });

    return NextResponse.json({ success: true, reviewId: result.id }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting review:', error);
    
    // Handle Prisma unique constraint violation (e.g. they already reviewed)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'You have already reviewed this agent.' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
