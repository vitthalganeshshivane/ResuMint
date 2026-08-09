const OpenAI = require("openai");

const PROVIDER_CONFIGS = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    modelsEndpoint: "/models",
  },
  gemini: {
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.0-flash",
    modelsEndpoint: "/models",
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-4o-mini",
    modelsEndpoint: "/models",
  },
  nvidia: {
    name: "NVIDIA NIM",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    defaultModel: "meta/llama-3.1-8b-instruct",
    modelsEndpoint: "/models",
  },
  custom: {
    name: "Custom (OpenAI Compatible)",
    baseUrl: "",
    defaultModel: "",
    modelsEndpoint: "/models",
  },
};

function createClient(provider, apiKey, baseUrl) {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const baseURL = baseUrl || config.baseUrl;

  return new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });
}

async function fetchModels(provider, apiKey, baseUrl) {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const baseURL = baseUrl || config.baseUrl;
  if (!baseURL) return [];

  try {
    const client = createClient(provider, apiKey, baseUrl);
    const models = await client.models.list();
    return models.data.map((m) => m.id).sort();
  } catch (error) {
    console.error(`Failed to fetch models for ${provider}:`, error.message);
    return [];
  }
}

async function generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt) {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const useModel = model || config.defaultModel;
  if (!useModel) throw new Error("No model specified");

  const client = createClient(provider, apiKey, baseUrl);

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await client.chat.completions.create({
    model: useModel,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

async function generateWithMessages(provider, apiKey, baseUrl, model, messages) {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const useModel = model || config.defaultModel;
  if (!useModel) throw new Error("No model specified");

  const client = createClient(provider, apiKey, baseUrl);

  const response = await client.chat.completions.create({
    model: useModel,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

async function generateSummary(provider, apiKey, baseUrl, model, data) {
  const systemPrompt = `You are a professional resume writer. Generate a concise, impactful professional summary.
Rules:
- 2-4 sentences max
- Start with a strong action-oriented statement
- Mention years of experience, key skills, and value proposition
- Use professional tone, no buzzwords
- Do NOT use first person ("I")`;

  const prompt = `Generate a professional resume summary for:
Name: ${data.fullName}
Designation/Title: ${data.designation}
${data.experience ? `Work Experience: ${data.experience}` : ""}
${data.skills ? `Key Skills: ${data.skills}` : ""}

Provide 3 different variations numbered 1, 2, 3. Each variation should have a different tone:
1. Concise and direct
2. Achievement-focused
3. Industry-specific`;

  const result = await generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt);
  return result;
}

async function improveBullets(provider, apiKey, baseUrl, model, data) {
  const systemPrompt = `You are a professional resume writer. Improve work experience descriptions into strong resume bullet points.
Rules:
- Start each bullet with a strong action verb
- Quantify achievements with numbers/percentages where possible
- Keep each bullet to 1-2 lines
- Focus on impact and results, not just duties
- Use past tense for previous roles, present tense for current
- Return 3-5 bullet points`;

  const prompt = `Improve this work experience description into strong resume bullet points:

Company: ${data.company}
Role: ${data.role}
${data.startDate ? `Duration: ${data.startDate} - ${data.endDate || "Present"}` : ""}
Current Description: ${data.description || "No description provided"}

Provide 3 different sets of improved bullet points numbered 1, 2, 3.`;

  const result = await generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt);
  return result;
}

async function enhanceProject(provider, apiKey, baseUrl, model, data) {
  const systemPrompt = `You are a professional resume writer. Enhance project descriptions to be concise and impactful.
Rules:
- 2-3 sentences max
- Highlight technologies used
- Focus on impact and technical complexity
- Use action verbs
- Mention scale/metrics if implied`;

  const prompt = `Enhance this project description:

Project Title: ${data.title}
${data.github ? `GitHub: ${data.github}` : ""}
Current Description: ${data.description || "No description provided"}

Provide 3 different enhanced versions numbered 1, 2, 3.`;

  const result = await generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt);
  return result;
}

async function suggestSkills(provider, apiKey, baseUrl, model, data) {
  const systemPrompt = `You are a career advisor. Suggest relevant professional skills based on the person's role and experience.
Rules:
- Suggest 8-12 skills
- Mix of technical and soft skills
- Be specific (e.g., "React.js" not just "Frontend")
- Include trending/modern skills for the role
- Return as a simple comma-separated list`;

  const prompt = `Suggest relevant skills for:
Role/Title: ${data.designation}
${data.experience ? `Experience: ${data.experience}` : ""}
${data.existingSkills ? `Already listed skills: ${data.existingSkills}` : ""}

Return ONLY the skill names as a comma-separated list, nothing else.`;

  const result = await generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt);
  return result;
}

async function reviewResume(provider, apiKey, baseUrl, model, resumeData) {
  const systemPrompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.
Review the resume and provide:
1. An overall score out of 100
2. Section-by-section feedback
3. Top 3 improvements
4. ATS compatibility notes

Format your response as JSON with this structure:
{
  "score": 85,
  "summary": "Brief overall assessment",
  "sections": {
    "profile": "feedback on summary/profile",
    "experience": "feedback on work experience",
    "skills": "feedback on skills section",
    "education": "feedback on education"
  },
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "atsNotes": "ATS compatibility feedback"
}`;

  const prompt = `Review this resume:

Title: ${resumeData.title}

Profile:
- Name: ${resumeData.profileInfo?.fullName}
- Designation: ${resumeData.profileInfo?.designation}
- Summary: ${resumeData.profileInfo?.summary}

Work Experience:
${resumeData.workExperience?.map((w) => `- ${w.role} at ${w.company}: ${w.description}`).join("\n") || "None"}

Skills: ${resumeData.skills?.map((s) => s.name).join(", ") || "None"}

Education:
${resumeData.education?.map((e) => `- ${e.degree} from ${e.institution}`).join("\n") || "None"}

Projects:
${resumeData.projects?.map((p) => `- ${p.title}: ${p.description}`).join("\n") || "None"}

Certifications: ${resumeData.certifications?.map((c) => c.title).join(", ") || "None"}
Languages: ${resumeData.languages?.map((l) => l.name).join(", ") || "None"}

Return ONLY the JSON response, no markdown code blocks.`;

  const result = await generateText(provider, apiKey, baseUrl, model, prompt, systemPrompt);

  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: 0, summary: result, sections: {}, improvements: [], atsNotes: "" };
  }
}

module.exports = {
  PROVIDER_CONFIGS,
  createClient,
  fetchModels,
  generateText,
  generateWithMessages,
  generateSummary,
  improveBullets,
  enhanceProject,
  suggestSkills,
  reviewResume,
};
