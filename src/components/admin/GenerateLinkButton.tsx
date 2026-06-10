"use client";

export function GenerateLinkButton({ agentId }: { agentId: string }) {
  const generate = async () => {
    try {
      const res = await fetch('/api/admin/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });
      const data = await res.json();
      if (data.url) {
        prompt("Review link generated! Copy it below to send to your client:", window.location.origin + data.url);
      } else {
        alert("Error generating link: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to generate link.");
    }
  };

  return (
    <button onClick={generate} className="text-emerald-600 hover:text-emerald-900 font-medium">
      Generate Link
    </button>
  );
}
