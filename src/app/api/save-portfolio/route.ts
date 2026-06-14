import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        console.log("DATA TO SAVE:", {
            profile: data.profile?.title,
            insight: data.insight,
            market_demand: data.scores?.marketDemand,
            skill_readiness: data.scores?.skillReadiness,
            career_flexibility: data.scores?.careerFlexibility,
        });

        const { error } = await supabase
            .from("portfolios")
            .insert([
                {
                    profile: data.profile?.title,
                    insight: data.insight,

                    market_demand: Math.round(
                        (data.scores?.marketDemand || 0) * 100
                    ),

                    skill_readiness: Math.round(
                        (data.scores?.skillReadiness || 0) * 100
                    ),

                    career_flexibility: Math.round(
                        (data.scores?.careerFlexibility || 0) * 100
                    ),
                },
            ]);

        if (error) {
            console.log("SUPABASE ERROR:", error);

            return NextResponse.json({
                success: false,
                error,
            });
        }

        console.log("SUPABASE INSERT SUCCESS");

        return NextResponse.json({
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
        });
    }
}