import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const jobSchema = z.object({
  company_name: z.string(),
  job_title: z.string(),
  job_description: z.string(),
  salary_range: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  work_model: z.string().nullable().optional(),
  employment_type: z.string().nullable().optional(),
  experience_level: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  required_tech_stack: z.array(z.string()).default([]),
});

export const extractJobData = async (rawText: string) => {
  const prompt = `
  You are an expert data extractor for a job application tracking system.
  Extract the core details and structured metadata from the following scraped text.

  CRITICAL EXTRACTION RULES:
  1. STRIP OUT GARBAGE: Remove all website footers, cookie policies, navigation links, login/signup prompts, "Similar Jobs", and irrelevant UI text.
  2. RETAIN CORE DETAILS: Format the main "job_description" beautifully with Markdown. Keep sections like Responsibilities, Requirements, and Benefits intact.
  3. FORMATTING: Use clean Markdown (bolding for labels, bullet points for lists, and headers for sections).
  4. STRUCTURED METADATA: Extract specific data points into their dedicated fields below. If a data point is not explicitly mentioned, return null. DO NOT guess.
     - salary_range: Extract the raw numbers or range (e.g., "$100k - $150k", "£50,000 + Equity").
     - work_model: Categorize strictly as "Remote", "Hybrid", or "On-site" if mentioned.
     - employment_type: Categorize as "Full-time", "Contract", "Part-time", or "Internship".
     - required_tech_stack: Extract an array of specific software, languages, or frameworks mentioned (e.g., ["React", "TypeScript", "PostgreSQL"]). Do not include generic soft skills here.

  You MUST return ONLY a valid JSON object with exactly these keys:
  {
    "company_name": "The name of the company hiring, or 'Unknown'",
    "job_title": "The official title of the position, or 'Unknown'",
    "job_description": "The cleaned, beautifully formatted Markdown job description",
    "salary_range": "string | null",
    "location": "string | null",
    "work_model": "string | null",
    "employment_type": "string | null",
    "experience_level": "string | null",
    "industry": "string | null",
    "required_tech_stack": ["string", "string"] 
  }

  Do not include any markdown formatting like \`\`\`json. Return just the raw JSON object.

  Scraped Text:
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

    const validatedData = jobSchema.safeParse(parsedData);

    if (!validatedData.success) {
      console.error("Zod Validation Failed! AI returned incorrect schema:", validatedData.error);
      return null;
    }

    return validatedData.data;

  } catch (error) {
    console.error("AI Extraction Failed or Invalid JSON returned:", error);
    return null;
  }
};
