export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Agents</h3>
          <p className="text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-slate-900">843</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Avg Rating</h3>
          <p className="text-3xl font-bold text-emerald-500">4.8</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Reviews</h2>
        <div className="text-sm text-slate-500">List of recent reviews will go here. Connect to Prisma to fetch the data.</div>
      </div>
    </div>
  );
}
