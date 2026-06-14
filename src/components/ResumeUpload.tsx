"use client";

import { useState } from "react";

export default function ResumeUpload({ setAiResult }: any) {
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        setLoading(true);

        let text = "";

        if (file.type === "application/pdf") {
            const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

            pdfjsLib.GlobalWorkerOptions.workerSrc =
                new URL(
                    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
                    import.meta.url
                ).toString();

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map((item: any) => item.str);
                text += strings.join(" ");
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

        // Pass the result UP to the parent (page.tsx) to display in the right panel
        setAiResult(data.result);

        await fetch("/api/save-portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data.result),
        });
        setLoading(false);
        setFileName(file.name);
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

            <p className="text-neutral-400 mb-6">
                Upload your resume to get AI career insights.
            </p>

            <label className="bg-white text-black px-6 py-3 rounded-2xl font-semibold cursor-pointer inline-block hover:opacity-90">
                Upload Resume
                <input
                    type="file"
                    accept=".txt,.pdf"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await handleUpload(file);
                    }}
                />
            </label>

            {fileName && (
                <p className="text-sm text-green-400 mt-4">
                    Uploaded: {fileName}
                </p>
            )}

            {loading && (
                <p className="text-sm text-blue-400 mt-4">
                    AI is analyzing your resume...
                </p>
            )}
        </div>
    );
}