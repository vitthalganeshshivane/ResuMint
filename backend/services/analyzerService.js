const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const aiService = require("./aiService");

async function extractText(file) {
  const { originalname, buffer, mimetype } = file;

  if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}

async function analyzeResume(provider, apiKey, baseUrl, model, extractedText) {
  const systemPrompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist with 15+ years of experience in HR and recruitment.

Analyze the following resume text extracted from a file and provide a comprehensive review.

Return ONLY valid JSON with this exact structure, no markdown code blocks, no extra text:
{
  "overallScore": 78,
  "summary": "Brief 2-3 sentence overall assessment of the resume quality",
  "sections": {
    "contact": {
      "score": 90,
      "feedback": "Specific feedback on contact information completeness"
    },
    "summary": {
      "score": 70,
      "feedback": "Feedback on professional summary/objective quality"
    },
    "experience": {
      "score": 80,
      "feedback": "Feedback on work experience section"
    },
    "education": {
      "score": 75,
      "feedback": "Feedback on education section"
    },
    "skills": {
      "score": 65,
      "feedback": "Feedback on skills section"
    },
    "formatting": {
      "score": 85,
      "feedback": "Feedback on overall formatting, structure, and readability"
    }
  },
  "strengths": [
    "Specific strength 1 with detail",
    "Specific strength 2 with detail",
    "Specific strength 3 with detail"
  ],
  "improvements": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2",
    "Specific actionable improvement 3",
    "Specific actionable improvement 4"
  ],
  "atsAnalysis": {
    "score": 72,
    "foundKeywords": ["keyword1", "keyword2"],
    "missingKeywords": ["suggested keyword 1", "suggested keyword 2", "suggested keyword 3"],
    "notes": "ATS compatibility notes and tips"
  }
}

Scoring guidelines:
- 90-100: Excellent, needs no changes
- 75-89: Good, minor improvements needed
- 60-74: Average, several improvements needed
- Below 60: Needs significant work

Be specific, actionable, and constructive. Reference actual content from the resume.`;

  const prompt = `Analyze this resume:

---
${extractedText}
---

Provide your comprehensive analysis as valid JSON only.`;

  const result = await aiService.generateText(
    provider,
    apiKey,
    baseUrl,
    model,
    prompt,
    systemPrompt,
  );

  try {
    const cleaned = result
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overallScore: 0,
      summary: result,
      sections: {},
      strengths: [],
      improvements: [],
      atsAnalysis: { score: 0, foundKeywords: [], missingKeywords: [], notes: "" },
    };
  }
}

module.exports = { extractText, analyzeResume };
