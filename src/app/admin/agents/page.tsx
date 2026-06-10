import Link from 'next/link';
import prisma from '@/lib/prisma';
import { GenerateLinkButton } from '@/components/admin/GenerateLinkButton';

export const dynamic = 'force-dynamic';

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Agents</h1>
        <Link href="/admin/agents/new" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition">
          + Add New Agent
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>No agents found.</p>
            <p className="text-sm mt-2">Add an agent to start generating review links.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {agents.map(agent => (
                <tr key={agent.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{agent.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{agent.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center gap-4">
                    <Link href={`/agent/${agent.id}`} className="text-blue-600 hover:text-blue-900 font-medium" target="_blank">View Profile</Link>
                    <span className="text-slate-300">|</span>
                    <GenerateLinkButton agentId={agent.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
