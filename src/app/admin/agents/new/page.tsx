"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAgentPage() {
  const [formData, setFormData] = useState({ name: '', company: '', designation: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/agents');
      router.refresh();
    } else {
      alert("Error adding agent");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/agents" className="text-slate-500 hover:text-slate-900">← Back</Link>
        <h1 className="text-3xl font-bold text-slate-900">Add New Agent</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
          <input type="text" required className="w-full border border-slate-200 p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
            <input type="text" required className="w-full border border-slate-200 p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Acme Insurance" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
            <input type="text" required className="w-full border border-slate-200 p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="Senior Advisor" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
          <textarea className="w-full border border-slate-200 p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell clients about this agent's experience..." />
        </div>
        <div className="pt-4">
          <button type="submit" disabled={loading} className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30 disabled:opacity-50">
            {loading ? "Saving..." : "Save Agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
