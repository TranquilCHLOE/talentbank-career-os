"use client";

import { useEffect, useState } from "react";

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<any>(null);

    useEffect(() => {
        fetch("/api/get-portfolio")
            .then((res) => res.json())
            .then((data) => {
                setPortfolio(data.portfolio);
            });
    }, []);

    if (!portfolio) {
        return (
            <div className="p-10 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <h1 className="text-4xl font-bold mb-8">
                Career Portfolio
            </h1>

            <div className="space-y-4">
                <p>
                    Profile:
                    {" "}
                    {portfolio.profile}
                </p>

                <p>
                    Market Demand:
                    {" "}
                    {portfolio.market_demand}%
                </p>

                <p>
                    Skill Readiness:
                    {" "}
                    {portfolio.skill_readiness}%
                </p>

                <p>
                    Career Flexibility:
                    {" "}
                    {portfolio.career_flexibility}%
                </p>

                <p>
                    Insight:
                    {" "}
                    {portfolio.insight}
                </p>
            </div>
        </div>
    );
}