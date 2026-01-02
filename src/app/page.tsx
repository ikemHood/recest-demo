"use client";

import { useState } from "react";

export default function Home() {
  const [article, setArticle] = useState("");
  const [result, setResult] = useState<{
    linkedInPost: string;
    instagramCaption: string;
    pdfBase64: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#15162c] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            ReCast Demo
          </h1>
        </header>

        <section className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="article" className="text-lg font-medium text-gray-200">
                Paste your article here
              </label>
              <textarea
                id="article"
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Paste your content..."
                className="w-full h-64 p-4 rounded-xl bg-black/20 border border-white/10 focus:border-grey-100 focus:ring-1 focus:ring-grey-400 outline-none transition-all resize-none text-white placeholder:text-gray-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !article}
              className="w-full py-4 px-6 rounded-full bg-black hover:bg-black/80 text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-grey-500 hover:shadow-grey-500"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Magic...
                </span>
              ) : (
                "Generate Content"
              )}
            </button>
          </form>
        </section>

        {result && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* LinkedIn Post */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-[#0077b5]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn Post
              </h2>
              <div className="bg-black/20 p-4 rounded-xl whitespace-pre-wrap flex-grow font-medium leading-relaxed">
                {result.linkedInPost}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(result.linkedInPost)}
                className="py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
              >
                Copy Text
              </button>
            </div>

            {/* Instagram Caption */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-[#E1306C]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram Caption
              </h2>
              <div className="bg-black/20 p-4 rounded-xl whitespace-pre-wrap flex-grow font-medium leading-relaxed">
                {result.instagramCaption}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(result.instagramCaption)}
                className="py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
              >
                Copy Text
              </button>
            </div>

            {/* Carousel PDF */}
            <div className="md:col-span-2 bg-gradient-to-r from-[hsl(280,100%,70%)] to-purple-900 p-8 rounded-2xl shadow-lg text-center flex flex-col items-center gap-6">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold text-white">LinkedIn Carousel Generated!</h2>
                 <p className="text-purple-100">Your tailored slide deck is ready for download.</p>
              </div>
              <a
                href={`data:application/pdf;base64,${result.pdfBase64}`}
                download="carousel.pdf"
                className="py-4 px-8 bg-white text-purple-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF Carousel
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
