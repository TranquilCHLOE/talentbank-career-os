"use client";

import { useState } from "react";

const careerPaths = [
  {
    title: "AI Product Engineer",
    salary: "RM 6,000 - RM 12,000",
    difficulty: "Medium",
    reason: "Your frontend + problem-solving background aligns with AI-powered product teams.",
    skills: ["Python", "AI APIs", "System Design"],
  },
  {
    title: "Fullstack Developer",
    salary: "RM 5,500 - RM 10,000",
    difficulty: "Low",
    reason: "You already have strong UI development experience. Backend exposure is the next logical step.",
    skills: ["Node.js", "Database Design", "Authentication"],
  },
  {
    title: "UX Technologist",
    salary: "RM 5,000 - RM 9,000",
    difficulty: "Medium",
    reason: "Your design thinking and frontend skills can transition well into experience-focused technical roles.",
    skills: ["UX Research", "Design Systems", "Accessibility"],
  },
];

export default function HomePage() {
  const [analysing, setAnalysing] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      {/* ── HERO ── */}
      <section className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 mb-6">
                Career OS • AI Career Navigation Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Navigate your career with clarity, not guesswork.
              </h1>

              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                Career OS helps candidates understand realistic career pathways,
                skill gaps, salary benchmarks, and long-term growth opportunities
                using AI-assisted career intelligence.
              </p>

              {/* Buttons row — fixed layout, never shifts */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-center">

                  {/* Upload Resume — fixed width so layout never shifts */}
                  <label
                    style={{ width: 160 }}
                    className={`py-3 rounded-2xl font-semibold transition text-center
                      ${analysing
                        ? "bg-neutral-700 text-neutral-400 cursor-not-allowed pointer-events-none"
                        : "bg-white text-black cursor-pointer hover:opacity-90"
                      }`}
                  >
                    {analysing ? "Analysing..." : "Upload Resume"}
                    <input
                      type="file"
                      accept=".txt,.pdf"
                      className="hidden"
                      disabled={analysing}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setAnalysing(true);

                        let text = "";

                        if (file.type === "application/pdf") {
                          const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
                          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                            "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
                            import.meta.url
                          ).toString();
                          const arrayBuffer = await file.arrayBuffer();
                          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                          for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            text += content.items.map((item: any) => item.str).join(" ");
                          }
                        } else {
                          text = await file.text();
                        }

                        const res = await fetch("/api/analyze", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ resumeText: text }),
                        });
                        const data = await res.json();

                        localStorage.setItem("careerReport", JSON.stringify(data.result));

                        await fetch("/api/save-portfolio", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(data.result),
                        });

                        setAnalysing(false);
                        window.open("/report", "_blank");
                      }}
                    />
                  </label>

                  <a
                    href="/report"
                    className="border border-neutral-700 px-6 py-3 rounded-2xl font-semibold hover:bg-neutral-900 transition"
                  >
                    View Portfolio
                  </a>
                </div>

                {/* Status message — sits below both buttons, takes up reserved space so nothing shifts */}
                <div style={{ height: 24 }}>
                  {analysing && (
                    <p className="text-sm text-blue-400 animate-pulse">
                      Analysing your document, please wait...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview card — static demo values */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-neutral-400">Current Profile</p>
                  <h3 className="text-2xl font-bold">Frontend Developer</h3>
                </div>
                <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-xl text-sm">
                  Growth Momentum: High
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Market Demand", pct: 82, color: "bg-white" },
                  { label: "Skill Readiness", pct: 68, color: "bg-blue-400" },
                  { label: "Career Flexibility", pct: 74, color: "bg-purple-400" },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2 text-sm text-neutral-400">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-3">
                      <div className={`${color} h-3 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
                <p className="text-sm text-neutral-400 mb-2">AI Career Coach Insight</p>
                <p className="leading-relaxed text-neutral-200">
                  Based on your current experience, you are positioned well for transitions
                  into AI-enhanced product engineering roles. Strengthening backend
                  architecture and analytics exposure may significantly expand your
                  opportunities over the next 2–3 years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">
            A Career Operating System for Long-Term Growth
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto">
            Instead of treating careers like isolated job applications, Career OS helps
            users understand their evolving trajectory across skills, opportunities, and
            market changes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "📁", title: "Living Portfolio", desc: "Continuously tracks projects, achievements, certifications, and skills so users always have an updated professional profile." },
            { icon: "🧭", title: "Career Path Navigator", desc: "Maps realistic next-step opportunities based on skills, experience, and current job market demand." },
            { icon: "🤖", title: "AI Career Coach", desc: "Provides explainable recommendations, salary insights, and skill development guidance in a transparent, human-centered way." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
              <div className="text-3xl mb-5">{icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{title}</h3>
              <p className="text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAREER PATHS ── */}
      <section className="bg-neutral-900/50 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <p className="text-neutral-400 mb-3">AI Career Navigation</p>
              <h2 className="text-4xl font-bold">Realistic Career Pathways</h2>
            </div>
            <p className="text-neutral-400 max-w-xl">
              Career OS does not predict a user's future. Instead, it shows realistic
              trajectories and explains the trade-offs behind each path.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {careerPaths.map((path, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-3xl p-7">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-semibold">{path.title}</h3>
                  <span className="text-sm bg-neutral-800 px-3 py-1 rounded-full text-neutral-300">
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-neutral-400 mb-4">{path.salary}</p>
                <p className="text-neutral-300 leading-relaxed mb-6">{path.reason}</p>
                <div>
                  <p className="text-sm text-neutral-500 mb-3">Suggested Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill) => (
                      <span key={skill} className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-xl text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE (static demo) ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Career Growth Timeline</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Career OS views careers as long-term journeys with transitions, pivots,
            plateaus, and growth phases.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { year: "2026", title: "Frontend Developer", desc: "Builds strong UI systems, collaborates with product teams, and develops modern frontend architecture." },
            { year: "2028", title: "Fullstack Engineer", desc: "Expands into backend services, authentication systems, APIs, and scalable infrastructure." },
            { year: "2030", title: "AI Product Engineer", desc: "Integrates AI workflows into products and focuses on human-AI interaction systems." },
            { year: "2034", title: "Career Leadership", desc: "Leads technical direction, mentors teams, and shapes long-term product strategy." },
          ].map(({ year, title, desc }) => (
            <div key={year} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
              <p className="text-sm text-neutral-500 mb-3">{year}</p>
              <h3 className="text-xl font-semibold mb-4">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Career OS</h3>
            <p className="text-neutral-500 max-w-md">
              Helping people navigate careers with better visibility, explainable AI
              guidance, and long-term growth insights.
            </p>
          </div>
          <div className="flex gap-8 text-neutral-400">
            {["About", "Features", "AI Coach", "Contact"].map((item) => (
              <button key={item} className="hover:text-white transition">{item}</button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}