const hasValidApiKey = (key) => {
    const normalized = String(key || "").trim().toLowerCase();
    return Boolean(normalized) && normalized !== "your_gemini_key";
};

const apiKey = process.env.GEMINI_API_KEY;
const configuredModels = String(process.env.GEMINI_MODEL || "gemini-2.5-flash")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
const fallbackModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
const models = [...new Set([...configuredModels, ...fallbackModels])];
const requestTimeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 15000;

const isGeminiConfigured = () => hasValidApiKey(apiKey);

const parseJsonFromGeminiText = (text) => {
    const source = String(text || "").trim();
    if (!source) return null;

    const fencedJson = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fencedJson ? fencedJson[1].trim() : source;

    try {
        return JSON.parse(candidate);
    } catch {
        const start = candidate.indexOf("{");
        const end = candidate.lastIndexOf("}");

        if (start === -1 || end === -1 || end <= start) return null;

        try {
            return JSON.parse(candidate.slice(start, end + 1));
        } catch {
            return null;
        }
    }
};

const generateGeminiText = async (prompt) => {
    if (!isGeminiConfigured()) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const requestBody = JSON.stringify({
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
        },
    });

    const errors = [];

    for (const model of models) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: requestBody,
            });

            if (!response.ok) {
                const errorText = await response.text();
                const message = `Gemini API request failed with ${model} (${response.status}): ${errorText}`;
                errors.push(message);

                if (response.status === 404) {
                    continue;
                }

                throw new Error(message);
            }

            const data = await response.json();
            return (data.candidates || [])
                .flatMap((candidate) => (candidate.content && candidate.content.parts) || [])
                .map((part) => part.text || "")
                .join("\n")
                .trim();
        } catch (error) {
            const message = error.name === "AbortError"
                ? `Gemini API request with ${model} timed out after ${requestTimeoutMs}ms.`
                : error.message;

            errors.push(message);
        }
        finally {
            clearTimeout(timeout);
        }
    }

    throw new Error(errors.join("\n"));
};

module.exports = {
    generateGeminiText,
    isGeminiConfigured,
    parseJsonFromGeminiText,
};
