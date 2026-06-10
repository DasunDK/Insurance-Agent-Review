export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-100">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
        <p className="text-slate-500 text-lg">Your review has been successfully submitted and verified.</p>
      </div>
    </div>
  );
}
