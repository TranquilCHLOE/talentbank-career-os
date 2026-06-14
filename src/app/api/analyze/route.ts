import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { resumeText } = await req.json();

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a professional AI Career Coach that analyzes resumes clearly and structured.",
                        },
                        {
                            role: "user",
                            content: `
Analyze this resume and return ONLY valid JSON.

Extract:
1. Profile title
2. Growth potential
3. Soft skills
4. Technical skills
5. Career scores
6. Career insight

Return this exact JSON format:

{
  "profile": {
    "title": "",
    "growth": ""
  },
  "skills": [],
  "technicalSkills": [],
  "scores": {
    "marketDemand": 0,
    "skillReadiness": 0,
    "careerFlexibility": 0
  },
  "insight": ""
}

Examples of technical skills:
HTML, CSS, JavaScript, React, Node.js, SQL, Python, Excel,
Power BI, Tableau, AWS, Docker, Git, Customer Service,
Event Management, Project Management, Marketing Strategy.

Resume:
${resumeText}
`,
                        },
                    ],
                    temperature: 0.7,
                }),
            }
        );

        const data = await response.json();

        console.log("GROQ FULL RESPONSE:", data);

        const raw =
            data.choices[0].message.content;

        console.log(
            "RAW AI RESPONSE:",
            raw
        );

        const jsonMatch =
            raw.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error(
                "No JSON found in AI response"
            );
        }

        const result = JSON.parse(
            jsonMatch[0]
        );
        const technicalSkills =
            result.technicalSkills || [];

        const { data: matchedSkills } =
            await supabase
                .from("skills")
                .select("id, skill_name")
                .in(
                    "skill_name",
                    technicalSkills.map((s: string) => s.trim())
                );

        console.log(
            "MATCHED SKILLS:",
            matchedSkills
        );


        const skillIds =
            matchedSkills?.map(
                (s) => s.id
            ) || [];

        const { data: mappings } =
            await supabase
                .from("career_skills")
                .select("*")
                .in("skill_id", skillIds);

        console.log(
            "CAREER MAPPINGS:",
            mappings?.length
        );


        const careerScores:
            Record<number, number> = {};

        mappings?.forEach((row) => {
            careerScores[row.career_id] =
                (careerScores[row.career_id] || 0)
                + (row.importance || 1);
        });

        console.log(
            "CAREER SCORES:",
            careerScores
        );

        const topCareerIds =
            Object.entries(careerScores)
                .sort(
                    (a, b) =>
                        Number(b[1]) -
                        Number(a[1])
                )
                .slice(0, 3)
                .map(
                    ([id]) =>
                        Number(id)
                );

        console.log(
            "TOP CAREER IDS:",
            topCareerIds
        );

        const { data: careers } =
            await supabase
                .from("careers")
                .select("*")
                .in("id", topCareerIds);

        console.log(
            "RECOMMENDED CAREERS:",
            careers
        );

        const { data: salaryData } =
            await supabase
                .from("salary_benchmarks")
                .select("*")
                .in("career_id", topCareerIds);

        const { data: demandData } =
            await supabase
                .from("industry_demand")
                .select("*")
                .in("career_id", topCareerIds);

        const { data: roadmapData } =
            await supabase
                .from("learning_roadmaps")
                .select("*")
                .in("career_id", topCareerIds);

        console.log("SALARY:", salaryData);
        console.log("DEMAND:", demandData);
        console.log("ROADMAP:", roadmapData);

        return NextResponse.json({
            result: {
                ...result,
                careerPaths: careers || [],
                salaryData: salaryData || [],
                industryDemand: demandData || [],
                roadmaps: roadmapData || []
            }
        });


    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}