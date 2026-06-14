"use client";

import { useEffect, useState } from "react";

import { skillGaps } from "@/data/skillGaps";
import { learningRoadmaps } from "@/data/learningRoadmaps";
import { salaryData } from "@/data/salaryData";
import { resumeStrength } from "@/data/resumeStrength";
import { industryDemand } from "@/data/industryDemand";
import { careerTimelines } from "@/data/careerTimelines";

function Bar({ value, color = "bg-blue-500" }: { value: number; color?: string }) {
    return (
        <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
            <div className={`${color} h-2 rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

const TIERS = ["junior", "mid", "mid", "senior"];
const TIER_LABELS = ["Junior", "Mid", "Mid", "Senior"];
const TIER_COLORS: Record<string, string> = {
    junior: "#a3a3a3",
    mid: "#60a5fa",
    senior: "#4ade80",
};

export default function ReportPage() {
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        const raw = localStorage.getItem("careerReport");
        if (raw) { try { setReport(JSON.parse(raw)); } catch { } }
    }, []);

    if (!report) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <p className="text-neutral-400 animate-pulse">Loading report…</p>
            </div>
        );
    }

    const profileKey: string =
        report.profile?.title ?? report.profile ?? "IT Student";

    const marketDemand = report.scores?.marketDemand ?? report.market_demand ?? 0;
    const skillReadiness = report.scores?.skillReadiness ?? report.skill_readiness ?? 0;
    const careerFlexibility =
        report.scores?.careerFlexibility ??
        report.scores?.flexibility ??
        report.career_flexibility ?? 0;

    const gap = skillGaps[profileKey as keyof typeof skillGaps];
    const roadmap = learningRoadmaps[profileKey as keyof typeof learningRoadmaps] ?? [];
    const salary = (salaryData[profileKey as keyof typeof salaryData] ?? {}) as any;
    const strength = resumeStrength[profileKey as keyof typeof resumeStrength];
    const demand = industryDemand[profileKey as keyof typeof industryDemand] ?? [];
    const timeline = careerTimelines[profileKey as keyof typeof careerTimelines] ?? [];

    // Timeline layout constants
    const CARD_H = 210;
    const STEM_H = 40;
    const DOT_D = 20;
    const DOT_TOP = CARD_H + STEM_H;
    const TOTAL = CARD_H + STEM_H + DOT_D + STEM_H + CARD_H;

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">

            {/* ── HEADER ── */}
            <header className="border-b border-neutral-800">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <span className="text-xs text-neutral-500 bg-neutral-800 px-3 py-1 rounded-full">
                        Career OS · AI Career Navigation Platform
                    </span>
                </div>
            </header>

            {/* ── 1. HERO ── */}
            <section className="border-b border-neutral-800">
                <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-neutral-400 text-sm mb-3">Career OS Report</p>
                        <h1 className="text-5xl font-bold mb-4 leading-tight">AI Career Report</h1>
                        <p className="text-neutral-400 mb-8">
                            Personalized career intelligence generated from your resume.
                        </p>
                        <div className="flex gap-4">
                            <a href="/portfolio"
                                className="border border-neutral-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:border-neutral-500 transition">
                                View Previous History
                            </a>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                        <p className="text-xs text-neutral-500">AI Career Insight</p>
                        <div>
                            <p className="text-xs text-neutral-500 mb-0.5">Career Profile</p>
                            <p className="font-semibold">{profileKey}</p>
                            <p className="text-green-400 text-sm mt-0.5">
                                {report.profile?.growth ?? report.growth ?? "Eager to learn and improve"}
                            </p>
                        </div>
                        {[
                            { label: "Market Demand", value: marketDemand, color: "bg-blue-500" },
                            { label: "Skill Readiness", value: skillReadiness, color: "bg-blue-400" },
                            { label: "Career Flexibility", value: careerFlexibility, color: "bg-purple-500" },
                        ].map(({ label, value, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400">{label}</span>
                                    <span className="text-white">{value}%</span>
                                </div>
                                <Bar value={value} color={color} />
                            </div>
                        ))}
                        <div className="bg-neutral-800 rounded-xl p-4">
                            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                                {report.insight}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. RESUME STRENGTH ── */}
            {strength && (
                <section className="border-b border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <p className="text-xs text-neutral-500 mb-1">AI Resume Evaluation</p>
                        <h2 className="text-3xl font-bold mb-8">Resume Strength Analysis</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-neutral-400 text-sm mb-2">Resume Score</p>
                                <p className="text-5xl font-bold mb-1">
                                    {strength.score}
                                    <span className="text-2xl text-neutral-500">/100</span>
                                </p>
                                <Bar value={strength.score} color="bg-blue-500" />
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-neutral-400 text-sm mb-4">Strengths</p>
                                <ul className="space-y-1.5">
                                    {strength.strengths.map((s) => (
                                        <li key={s} className="text-green-400 text-sm flex items-center gap-2">
                                            <span>✓</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-neutral-400 text-sm mb-4">Improvement Areas</p>
                                <ul className="space-y-1.5">
                                    {strength.improvements.map((s) => (
                                        <li key={s} className="text-yellow-400 text-sm flex items-center gap-2">
                                            <span>△</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 3. AI CAREER COACH INSIGHT ── */}
            <section className="border-b border-neutral-800">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <p className="text-xs text-neutral-500 mb-1">AI Career Coach</p>
                    <h2 className="text-3xl font-bold mb-8">AI Career Coach Insight</h2>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                        <p className="text-lg leading-relaxed text-neutral-200">{report.insight}</p>
                    </div>
                </div>
            </section>

            {/* ── 4. INDUSTRY DEMAND DASHBOARD ── */}
            {demand.length > 0 && (
                <section className="border-b border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <p className="text-xs text-neutral-500 mb-1">Market Intelligence</p>
                        <h2 className="text-3xl font-bold mb-8">
                            Industry Demand Dashboard <span className="text-red-500">•</span>
                        </h2>
                        <div className="space-y-5">
                            {demand.map(({ role, demand: pct }) => (
                                <div key={role}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-white">{role}</span>
                                        <span className="text-neutral-400">{pct}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-800 rounded-full h-2">
                                        <div className="bg-neutral-300 h-2 rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 5. DYNAMIC CAREER TIMELINE ── */}
            {timeline.length > 0 && (
                <section className="border-b border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-2">Dynamic Career Timeline</h2>
                            <p className="text-neutral-400 text-sm">
                                Personalised career progression based on your profile.
                            </p>
                        </div>

                        {/* Fixed-height grid with absolute positioning so the line renders correctly */}
                        <div
                            className="relative grid"
                            style={{
                                gridTemplateColumns: `repeat(${timeline.length}, 1fr)`,
                                height: TOTAL,
                            }}
                        >
                            {/* ── THE horizontal line through the middle ── */}
                            <div style={{
                                position: "absolute",
                                top: DOT_TOP + DOT_D / 2,
                                left: 0, right: 0,
                                height: 1,
                                background: "#404040",
                                zIndex: 0,
                            }} />

                            {timeline.map((item, i) => {
                                const isAbove = i % 2 === 0;
                                const tier = TIERS[i] ?? "mid";
                                const tierLabel = TIER_LABELS[i] ?? "Mid";
                                const pay = salary[tier];
                                const color = TIER_COLORS[tier];

                                // Where each element starts (px from top of grid)
                                const cardTop = isAbove ? 0 : DOT_TOP + DOT_D + STEM_H;
                                const stemTop = isAbove ? CARD_H : DOT_TOP + DOT_D;

                                return (
                                    <div key={item.year} className="relative px-1" style={{ height: TOTAL }}>

                                        {/* Card */}
                                        <div style={{
                                            position: "absolute",
                                            top: cardTop, left: 4, right: 4,
                                            height: CARD_H,
                                            borderRadius: 16,
                                            background: "#171717",
                                            border: "1px solid #262626",
                                            ...(isAbove
                                                ? { borderTop: `2px solid ${color}` }
                                                : { borderBottom: `2px solid ${color}` }),
                                            padding: 16,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 6,
                                            zIndex: 2,
                                            overflow: "hidden",
                                        }}>
                                            {/* Year badge */}
                                            <div style={{
                                                display: "inline-block", alignSelf: "flex-start",
                                                background: color, color: "#0a0a0a",
                                                fontSize: 11, fontWeight: 700,
                                                padding: "2px 8px", borderRadius: 6,
                                            }}>
                                                {item.year}
                                            </div>
                                            <p style={{ fontWeight: 600, fontSize: 14, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                                                {item.title}
                                            </p>
                                            <p style={{ fontSize: 12, color: "#737373", lineHeight: 1.5, margin: 0, flex: 1 }}>
                                                {item.desc}
                                            </p>
                                            {pay && (
                                                <div style={{ borderTop: "1px solid #262626", paddingTop: 8, marginTop: "auto" }}>
                                                    <p style={{ fontSize: 11, color: "#525252", margin: "0 0 2px" }}>
                                                        {tierLabel} Level
                                                    </p>
                                                    <p style={{ fontSize: 13, fontWeight: 600, color, margin: 0 }}>
                                                        {pay}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Vertical stem */}
                                        <div style={{
                                            position: "absolute",
                                            left: "50%", transform: "translateX(-50%)",
                                            top: stemTop, width: 1, height: STEM_H,
                                            background: "#404040", zIndex: 1,
                                        }} />

                                        {/* Dot */}
                                        <div style={{
                                            position: "absolute",
                                            left: "50%", transform: "translateX(-50%)",
                                            top: DOT_TOP,
                                            width: DOT_D, height: DOT_D,
                                            borderRadius: "50%",
                                            background: color,
                                            border: "3px solid #0a0a0a",
                                            zIndex: 3,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0a0a0a" }} />
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 6. SKILL GAP ANALYSIS ── */}
            {gap && (
                <section className="border-b border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <p className="text-xs text-neutral-500 mb-1">Career Development</p>
                        <h2 className="text-3xl font-bold mb-2">Skill Gap Analysis</h2>
                        <p className="text-neutral-400 text-sm mb-8">
                            Recommended path: {gap.targetRole}
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-sm text-neutral-400 mb-4">Existing Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {gap.existingSkills.map((s) => (
                                        <span key={s} className="text-xs bg-neutral-800 text-green-400 border border-green-900 px-2.5 py-1 rounded-full">
                                            ✓ {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-sm text-neutral-400 mb-4">Missing Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {gap.missingSkills.map((s) => (
                                        <span key={s} className="text-xs bg-neutral-800 text-red-400 border border-red-900 px-2.5 py-1 rounded-full">
                                            ✕ {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <p className="text-sm text-neutral-400 mb-2">Career Readiness</p>
                                <p className="text-5xl font-bold mb-3">{gap.readiness}%</p>
                                <Bar value={gap.readiness} color="bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── 7. RECOMMENDED LEARNING ROADMAP ── */}
            {roadmap.length > 0 && (
                <section className="border-b border-neutral-800">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <p className="text-xs text-neutral-500 mb-1">Learning Journey</p>
                        <h2 className="text-3xl font-bold mb-2">Recommended Learning Roadmap</h2>
                        <p className="text-neutral-400 text-sm mb-8">
                            Follow these steps to reach your next career goal.
                        </p>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {roadmap.map((step: string, i: number) => (
                                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                                    <p className="text-3xl font-bold text-neutral-700 mb-2">{i + 1}</p>
                                    <p className="text-sm text-white font-medium">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOOTER ── */}
            <footer className="border-t border-neutral-800">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="font-semibold">Career OS</p>
                        <p className="text-neutral-500 text-xs">
                            Helping you navigate careers with better clarity, sustainable AI
                            guidance, and long-term growth insights.
                        </p>
                    </div>
                    <nav className="flex gap-6 text-neutral-500 text-sm">
                        <a href="#" className="hover:text-white transition">About</a>
                        <a href="#" className="hover:text-white transition">Features</a>
                        <a href="#" className="hover:text-white transition">AI Coach</a>
                        <a href="#" className="hover:text-white transition">Contact</a>
                    </nav>
                </div>
            </footer>

        </div>
    );
}