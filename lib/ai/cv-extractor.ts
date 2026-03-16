import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const profileSchema = z.object({
  phone_number: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  portfolio_url: z.string().nullable().optional(),
  professional_summary: z.string().nullable().optional(),
});

const workSchema = z.object({
  company_name: z.string(),
  position_title: z.string(),
  location: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  description: z.string().nullable().optional()
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string().nullable().optional(),
  field_of_study: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  grade: z.string().nullable().optional()
});

const projectSchema = z.object({
  project_name: z.string(),
  description: z.string().nullable().optional(),
  tech_stack: z.array(z.string()).default([]),
  project_url: z.string().nullable().optional()
});

const skillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()).default([])
});

const cvSchema = z.object({
  profile: profileSchema.nullable().optional(),
  work: z.array(workSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([])
});

export type ParsedCV = z.infer<typeof cvSchema>;

export const extractCVData = async (rawText: string) => {
  const prompt = `
  You are an expert AI resume parser. Your job is to extract the candidate's information from the raw PDF text below and sort it into a strict JSON structure.
  
  CRITICAL RULES:
  1. ONLY return valid JSON. Do not include markdown formatting like \`\`\`json.
  2. If a field is not found in the resume, return null (or an empty array for lists).
  3. Format dates as clean text (e.g., "Jan 2020", "Present").
  4. Ensure descriptions are nicely formatted with Markdown bullet points where appropriate.

  You MUST return ONLY a JSON object with this EXACT structure:
  {
    "profile": {
      "phone_number": "string | null",
      "location": "string | null",
      "linkedin_url": "string | null",
      "github_url": "string | null",
      "portfolio_url": "string | null",
      "professional_summary": "string | null"
    },
    "work": [
      {
        "company_name": "string",
        "position_title": "string",
        "location": "string | null",
        "start_date": "string | null",
        "end_date": "string | null",
        "is_current": boolean,
        "description": "string (markdown bullets)"
      }
    ],
    "education": [
      {
        "institution": "string",
        "degree": "string | null",
        "field_of_study": "string | null",
        "start_date": "string | null",
        "end_date": "string | null",
        "grade": "string | null"
      }
    ],
    "projects": [
      {
        "project_name": "string",
        "description": "string (markdown bullets)",
        "tech_stack": ["string", "string"],
        "project_url": "string | null"
      }
    ],
    "skills": [
      {
        "category": "string (e.g., 'Languages', 'Frameworks')",
        "skills": ["string", "string"]
      }
    ]
  }

  RAW RESUME TEXT:
  ${rawText}
  `;

  try {
    const response = streamText({
      model: openrouter('deepseek/deepseek-v3.2'),
      prompt: prompt,
    });

    await response.consumeStream();
    const rawOutput = await response.text;

    const cleanJsonString = rawOutput
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsedData = JSON.parse(cleanJsonString);
    const validatedData = cvSchema.safeParse(parsedData);

    if (!validatedData.success) {
      console.error("CV Zod Validation Failed! AI returned incorrect schema:", validatedData.error);
      return null;
    }

    return validatedData.data;

  } catch (error) {
    console.error("CV AI Extraction Failed or Invalid JSON returned:", error);
    return null;
  }
};
