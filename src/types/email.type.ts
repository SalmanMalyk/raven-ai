import * as z from 'zod';

export interface GeneratedResponse {
  classification: string;
  subject: string;
  body: string;
  reasoning: string;
}

export const generatedResponseSchema: z.ZodType<GeneratedResponse> = z.object({
  classification: z.string(),
  subject: z.string(),
  body: z.string(),
  reasoning: z.string(),
});
