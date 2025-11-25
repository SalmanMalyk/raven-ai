import { model } from '../../llm';
import { RequestEmail } from '@/handlers/generation';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import z from 'zod';

export async function generateEmail(state: { email: RequestEmail; classify: string; personalize: string }) {
  const responseSchema = z.object({
    subject: z.string(),
    body: z.string(),
    classification: z.string(),
    personalization: z.string(),
  });

  const parser = StructuredOutputParser.fromZodSchema(responseSchema);

  const response = await model.invoke([
    [
      'system',
      `You are an AI assistant that generates professional email responses. 
      
      Use the following information to craft an appropriate response:
      - Original email: ${state.email.body}
      - Email classification: ${state.classify}
      - Personalization details: ${state.personalize}

      Rules:
      - Do not include any additional information other than the response.
      
      Generate a professional, contextually appropriate email response.
      ${parser.getFormatInstructions()}`,
    ],
    ['human', 'Generate the email response now.'],
  ]);

  const generatedEmail = await parser.parse(response.content as string);
  console.log(`Generated email response:`, generatedEmail);

  return { generate: generatedEmail };
}
