const { generateGeminiText, isGeminiConfigured, parseJsonFromGeminiText } = require("./geminiClient");
const { extractSkillsFromText } = require("./resumeInsights");

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

const unique = (values) => [...new Set(values)];

const buildFallbackAnalysis = (text) => {
    const normalizedText = String(text || "");
    const skills = extractSkillsFromText(normalizedText);
    const lengthScore = clampScore(Math.min(92, Math.max(45, Math.floor(normalizedText.length / 12))));

    return {
        score: lengthScore,
        summary: "Resume analyzed with fallback mode. Add quantified impact and clearer project outcomes.",
        improvements: [
            "Add measurable achievements with numbers in each project or internship.",
            "Move the strongest technical skills near the top for quick recruiter scan.",
            "Use action verbs and concise bullet points for better readability.",
            "Keep formatting ATS-friendly with simple section headings.",
        ],
        skills,
    };
};

exports.analyzeResume = async (text) => {
    if (!isGeminiConfigured()) {
        return buildFallbackAnalysis(text);
    }

    try {
        const outputText = await generateGeminiText(`You are an expert placement coach.
Analyze the resume text and return ONLY valid JSON with keys:
score (number 0-100),
summary (string),
improvements (array of 4 short strings),
skills (array of technical skills).
Resume text:
${text}`);

        const parsed = parseJsonFromGeminiText(outputText);

        if (parsed) {
            const aiSkills = Array.isArray(parsed.skills) ? parsed.skills.map((skill) => String(skill).toLowerCase()) : [];
            const inferredSkills = extractSkillsFromText(text);

            return {
                score: clampScore(parsed.score),
                summary: String(parsed.summary || "Resume analyzed successfully."),
                improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 6) : [],
                skills: unique([...aiSkills, ...inferredSkills]),
            };
        }

        return buildFallbackAnalysis(text);
    } catch (error) {
        console.error("Gemini analysis failed. Using fallback feedback.");
        console.error(error.message);
        return buildFallbackAnalysis(text);
    }
};
