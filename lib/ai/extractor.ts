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
});

export const extractJobData = async (rawText: string) => {
  const prompt = `
  You are an expert data extractor for a job application tracking system.
  Extract the company name, job title, and a cleaned-up markdown version of the job description from the following scraped text.

  CRITICAL EXTRACTION RULES:
  1. STRIP OUT GARBAGE: Remove all website footers, cookie policies, navigation links, login/signup prompts, "Similar Jobs", "People also viewed", and irrelevant UI text.
  2. RETAIN CORE DETAILS: You must keep the following sections intact and formatted beautifully:
     - "About the role" or general company overview
     - Responsibilities, Duties, and Day-to-Day tasks
     - Requirements, Qualifications, and Tech Stack
     - Compensation, Salary, Benefits, and Perks
     - Work model (Remote, Hybrid, On-site, Contract details)
     - The Application Process or Next Steps
  3. FORMATTING: Use clean Markdown (bolding for labels like **Position:**, bullet points for lists, and headers for sections) to make it highly readable.

  You MUST return ONLY a valid JSON object with exactly these keys:
  {
    "company_name": "The name of the company hiring, or 'Unknown'",
    "job_title": "The official title of the position, or 'Unknown'",
    "job_description": "The cleaned, beautifully formatted Markdown job description"
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
