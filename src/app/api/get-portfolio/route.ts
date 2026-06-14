import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

    if (error) {
        return NextResponse.json({
            success: false,
            error,
        });
    }

    return NextResponse.json({
        success: true,
        portfolio: data[0],
    });
}