const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");

const normalizeWhitespace = (text) => String(text || "").replace(/\s+/g, " ").trim();

const extractPrintableText = (buffer) => {
    const raw = buffer.toString("utf8");
    return normalizeWhitespace(raw.replace(/[^\x20-\x7E\n\r\t]/g, " "));
};

const extractPdfText = async (filePath) => {
    const fileBuffer = await fs.readFile(filePath);

    if (typeof pdfParse === "function") {
        const parsed = await pdfParse(fileBuffer);
        return normalizeWhitespace(parsed.text);
    }

    if (pdfParse && typeof pdfParse.PDFParse === "function") {
        const parser = new pdfParse.PDFParse({ data: fileBuffer });

        try {
            const parsed = await parser.getText();
            return normalizeWhitespace(parsed.text);
        } finally {
            await parser.destroy();
        }
    }

    throw new Error("PDF parser is not available.");
};

const extractPdfTextWithFallback = async (filePath) => {
    const parsedText = await extractPdfText(filePath);
    if (parsedText) return parsedText;

    const fileBuffer = await fs.readFile(filePath);
    return extractPrintableText(fileBuffer);
};

const extractResumeText = async (file) => {
    if (!file || !file.path) return "";

    const extension = path.extname(file.originalname || file.path).toLowerCase();

    if (extension === ".pdf" || file.mimetype === "application/pdf") {
        return extractPdfTextWithFallback(file.path);
    }

    const fileBuffer = await fs.readFile(file.path);
    return extractPrintableText(fileBuffer);
};

module.exports = {
    extractResumeText,
};
