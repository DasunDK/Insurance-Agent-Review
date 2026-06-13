import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ReviewForm } from '@/components/review/ReviewForm';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reviewToken = await prisma.reviewToken.findUnique({
    where: { token },
    include: { agent: true }
  });

  if (!reviewToken) return notFound();
  
  if (reviewToken.isUsed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Token Used</h1>
          <p className="text-slate-500">This review link has already been used.</p>
        </div>
      </div>
    );
  }

  if (reviewToken.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Link Expired</h1>
          <p className="text-slate-500">This review link has expired.</p>
        </div>
      </div>
    );
  }

  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ReviewForm token={token} agent={reviewToken.agent} questions={questions} />
    </div>
  );
}
