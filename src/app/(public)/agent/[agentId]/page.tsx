import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function AgentPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: {
      reviews: {
        include: { answers: { include: { question: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!agent) return notFound();

  const totalReviews = agent.reviews.length;
  const avgRating = totalReviews > 0 
    ? (agent.reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  agent.reviews.forEach(r => {
    if (r.overallRating >= 1 && r.overallRating <= 5) {
      distribution[r.overallRating as keyof typeof distribution]++;
    }
  });

  // Calculate detailed category averages
  const categoryStats: Record<string, { sum: number; count: number }> = {};
  agent.reviews.forEach(review => {
    review.answers.forEach(answer => {
      const qText = answer.question.text;
      if (!categoryStats[qText]) categoryStats[qText] = { sum: 0, count: 0 };
      categoryStats[qText].sum += answer.rating;
      categoryStats[qText].count += 1;
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-5xl text-slate-400 font-bold">
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{agent.name}</h1>
            <p className="text-lg text-slate-600 mb-4">{agent.designation} at {agent.company}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-2xl">
              ★★★★★ <span className="text-slate-900 text-lg ml-1">{avgRating}</span> <span className="text-slate-500 text-sm font-normal">({totalReviews} reviews)</span>
            </div>
            {agent.bio && (
              <p className="text-slate-600 mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-wrap">
                {agent.bio}
              </p>
            )}
          </div>
        </div>

        {/* Rating Breakdown & Detailed Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Rating Distribution</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star as keyof typeof distribution];
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-medium text-slate-600">{star} Stars</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="w-8 text-sm text-slate-500 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Ratings</h2>
            {Object.keys(categoryStats).length === 0 ? (
              <p className="text-slate-500 text-sm">Not enough data yet.</p>
            ) : (
              <div className="space-y-4">
                 {Object.entries(categoryStats).map(([category, stats]) => (
                   <div key={category} className="flex justify-between items-center border-b border-slate-50 pb-2">
                     <span className="text-slate-700 font-medium">{category}</span>
                     <span className="text-emerald-500 font-bold">{(stats.sum / stats.count).toFixed(1)} <span className="text-slate-300 font-normal">/ 5</span></span>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reviews</h2>
          {agent.reviews.length === 0 ? (
            <p className="text-slate-500">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {agent.reviews.map(review => (
                <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    {'★'.repeat(review.overallRating)}{'☆'.repeat(5 - review.overallRating)}
                    <span className="text-slate-400 text-xs ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.comment && <p className="text-slate-700 mt-2">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
