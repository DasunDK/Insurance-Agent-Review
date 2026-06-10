"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewForm({ token, agent, questions }: { token: string, agent: any, questions: any[] }) {
  const [overallRating, setOverallRating] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0) return alert("Please provide an overall rating");
    
    setLoading(true);
    const answersArray = Object.keys(answers).map(qId => ({ questionId: qId, rating: answers[qId] }));
    
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        overallRating,
        comment,
        reviewerEmail: email || undefined,
        answers: answersArray
      })
    });
    
    setLoading(false);
    if (res.ok) {
      router.push(`/review/${token}/success`);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to submit review");
    }
  };

  const StarRating = ({ rating, onChange }: { rating: number, onChange: (val: number) => void }) => (
    <div className="flex gap-1 text-4xl cursor-pointer">
      {[1, 2, 3, 4, 5].map(star => (
        <span 
          key={star} 
          onClick={() => onChange(star)}
          className={`transition-colors ${star <= rating ? "text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Review {agent.name}</h1>
        <p className="text-slate-500">How was your experience working with your agent?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center">
          <label className="text-lg font-bold text-slate-800 mb-4">Overall Rating</label>
          <StarRating rating={overallRating} onChange={setOverallRating} />
        </div>

        <hr className="border-slate-100" />

        {questions.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900">Rate specific areas:</h3>
            {questions.map(q => (
              <div key={q.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-slate-700 font-medium">{q.text}</span>
                <div className="scale-75 origin-left sm:origin-right">
                  <StarRating 
                    rating={answers[q.id] || 0} 
                    onChange={(val) => setAnswers({...answers, [q.id]: val})} 
                  />
                </div>
              </div>
            ))}
            <hr className="border-slate-100" />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email (Optional)</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="To verify your review"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Share more details (Optional)</label>
          <textarea 
            rows={4} 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="What did they do well? What could be improved?"
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
