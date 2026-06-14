"use client";

// Drop-in replacement for the Dynamic Career Timeline section.
// Props match what the parent page already has.

interface TimelineItem {
    year: string;
    title: string;
    desc: string;
}

interface SalaryMap {
    junior?: string;
    mid?: string;
    senior?: string;
    [key: string]: string | undefined;
}

interface Props {
    timeline: TimelineItem[];
    salary: SalaryMap;
}

// Which salary tier each milestone maps to
const TIERS = ["junior", "mid", "mid", "senior"];
const LABELS = ["Junior", "Mid", "Mid", "Senior"];
const TIER_COLORS: Record<string, string> = {
    junior: "#a3a3a3",   // neutral-400
    mid: "#60a5fa",   // blue-400
    senior: "#4ade80",   // green-400
};

export default function CareerTimeline({ timeline, salary }: Props) {
    if (!timeline.length) return null;

    return (
        <section className="border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-2">Dynamic Career Timeline</h2>
                    <p className="text-neutral-400 text-sm">
                        Personalised career progression based on your profile.
                    </p>
                </div>

                {/* ── Timeline SVG-style layout ───────────────────────────── */}
                <div className="relative">

                    {/* Horizontal connector line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-700 -translate-y-1/2" />

                    <div
                        className="relative grid"
                        style={{ gridTemplateColumns: `repeat(${timeline.length}, 1fr)` }}
                    >
                        {timeline.map((item, i) => {
                            const isAbove = i % 2 === 0;
                            const tier = TIERS[i] as keyof SalaryMap;
                            const tierLabel = LABELS[i];
                            const pay = salary[tier];
                            const color = TIER_COLORS[tier];

                            return (
                                <div key={item.year} className="flex flex-col items-center">

                                    {/* ── ABOVE node: even items ── */}
                                    {isAbove ? (
                                        <div className="flex flex-col items-center mb-0">
                                            {/* Card */}
                                            <div
                                                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 w-full max-w-[180px] mb-3"
                                                style={{ borderTop: `2px solid ${color}` }}
                                            >
                                                {/* Year badge */}
                                                <div
                                                    className="inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 text-black"
                                                    style={{ background: color }}
                                                >
                                                    {item.year}
                                                </div>
                                                <h3 className="font-semibold text-sm leading-snug mb-1.5">
                                                    {item.title}
                                                </h3>
                                                <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                                                    {item.desc}
                                                </p>
                                                {pay && (
                                                    <div className="border-t border-neutral-800 pt-2">
                                                        <p className="text-xs text-neutral-600 mb-0.5">{tierLabel} Level</p>
                                                        <p className="text-xs font-semibold" style={{ color }}>
                                                            {pay}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Vertical stem down to dot */}
                                            <div className="w-px bg-neutral-700" style={{ height: 28 }} />
                                        </div>
                                    ) : (
                                        /* Spacer above dot for odd items */
                                        <div style={{ height: "calc(100% / 2)" }} className="flex-1" />
                                    )}

                                    {/* ── Dot on the line ── */}
                                    <div
                                        className="relative z-10 flex items-center justify-center rounded-full border-2 border-neutral-950"
                                        style={{
                                            width: 20,
                                            height: 20,
                                            background: color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-neutral-950" />
                                    </div>

                                    {/* ── BELOW node: odd items ── */}
                                    {!isAbove ? (
                                        <div className="flex flex-col items-center mt-0">
                                            {/* Vertical stem down from dot */}
                                            <div className="w-px bg-neutral-700" style={{ height: 28 }} />

                                            {/* Card */}
                                            <div
                                                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 w-full max-w-[180px] mt-3"
                                                style={{ borderBottom: `2px solid ${color}` }}
                                            >
                                                {/* Year badge */}
                                                <div
                                                    className="inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 text-black"
                                                    style={{ background: color }}
                                                >
                                                    {item.year}
                                                </div>
                                                <h3 className="font-semibold text-sm leading-snug mb-1.5">
                                                    {item.title}
                                                </h3>
                                                <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                                                    {item.desc}
                                                </p>
                                                {pay && (
                                                    <div className="border-t border-neutral-800 pt-2">
                                                        <p className="text-xs text-neutral-600 mb-0.5">{tierLabel} Level</p>
                                                        <p className="text-xs font-semibold" style={{ color }}>
                                                            {pay}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : null}

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}