"use client";
import { useState, useEffect } from 'react';

type Question = { id: string; text: string; category: string; isActive: boolean; order: number };

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/admin/questions');
      if (res.ok) setQuestions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    const res = await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category })
    });
    if (res.ok) {
      setText("");
      setCategory("");
      fetchQuestions();
    } else {
      alert("Error adding question");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Review Criteria</h1>
        <p className="text-slate-600 mt-2">
          Define the specific criteria clients will rate your agents on (e.g., Speed, Communication, Trust).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 className="font-bold text-slate-900">Add New Criteria</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Question/Label</label>
              <input type="text" required className="w-full border border-slate-200 p-2 rounded text-slate-900 focus:ring-emerald-500 focus:outline-none" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Communication" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category (Optional)</label>
              <input type="text" className="w-full border border-slate-200 p-2 rounded text-slate-900 focus:ring-emerald-500 focus:outline-none" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Soft Skills" />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white px-4 py-2 rounded font-medium hover:bg-emerald-600 transition">Add Question</button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
               <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : questions.length === 0 ? (
               <div className="p-8 text-center text-slate-500">
                  No custom questions defined yet.
               </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criteria Label</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {questions.map(q => (
                    <tr key={q.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{q.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{q.category || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {q.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
