import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Find the Best <span className="text-emerald-500">Insurance Agents</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Read verified reviews, compare ratings, and choose an insurance professional you can trust. Our platform ensures authentic feedback from real clients.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/admin" 
            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30"
          >
            Admin Dashboard
          </Link>
          <a 
            href="#directory" 
            className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition shadow-sm"
          >
            Browse Agents
          </a>
        </div>
      </div>
      
      {/* Simple placeholder for a directory section */}
      <div id="directory" className="mt-24 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Featured Agents</h2>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
          <p>This is where the directory of agents will be rendered by pulling from your database.</p>
          <p className="text-sm mt-2">Visit the <Link href="/admin" className="text-emerald-500 hover:underline font-bold">Admin Panel</Link> to add your first agent!</p>
        </div>
      </div>
    </div>
  );
}
