import { NextAuthProvider } from '@/components/Providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
          <h1 className="text-2xl font-bold mb-8 text-emerald-400">AgentReview</h1>
          <nav className="space-y-4">
            <a href="/admin" className="block text-slate-300 hover:text-white transition">Dashboard</a>
            <a href="/admin/agents" className="block text-slate-300 hover:text-white transition">Manage Agents</a>
            <a href="/admin/questions" className="block text-slate-300 hover:text-white transition">Review Criteria</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </NextAuthProvider>
  );
}
