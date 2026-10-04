"use client";

import { useState } from "react";

export default function Home() {
  const [ensName, setEnsName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [appliedPrefs, setAppliedPrefs] = useState<{langKey: string, lengthKey: string, levelKey: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    setAppliedPrefs(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ensName, question }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setAnswer(data.answer);
      setAppliedPrefs(data.appliedPrefs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-8 font-sans">
      <main className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Portable AI Assistant</h1>
        <p className="text-gray-400 mb-8">Enter your ENS name to load your personal AI preferences.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="ensName" className="block text-sm font-medium text-gray-300 mb-2">
              ENS Name (Sepolia)
            </label>
            <input
              id="ensName"
              type="text"
              placeholder="ana.eth"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
              value={ensName}
              onChange={(e) => setEnsName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              placeholder="How does quantum computing work?"
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Asking..." : "Ask Assistant"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-8 p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Answer</h2>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed mb-6">
              {answer}
            </div>
            
            {appliedPrefs && (
              <div className="text-xs text-gray-400 p-3 bg-gray-800 rounded border border-gray-700">
                <span className="font-bold text-gray-300">Applied Preferences:</span> 
                {' '}Language: <span className="text-blue-400">{appliedPrefs.langKey}</span>, 
                {' '}Length: <span className="text-blue-400">{appliedPrefs.lengthKey}</span>, 
                {' '}Level: <span className="text-blue-400">{appliedPrefs.levelKey}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
