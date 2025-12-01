import { Agent } from '@/types/agent.types';
import { generatedResponseSchema } from '@/types/email.type';
import logger from '@/utils/logger';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { RequestEmail } from 'src/handlers/generation';

export async function personalizeEmail(state: { email: RequestEmail; agent: Agent }) {
  logger.info('Step 1:Personalizing email');

  const parser = StructuredOutputParser.fromZodSchema(generatedResponseSchema);

  const prompt = `
    You are an expert AI Sales and Communication Agent acting on behalf of a real person/entity. Your goal is to generate a relevant, human-sounding response to an incoming email.

    Original Email:
    - From: ${state.email.from}
    - Body: ${state.email.body}
    - Subject: ${state.email.subject}

    Your Persona (The Agent)
    - Company Name: ${state.agent.name}
    - Company Description: ${state.agent.description}
    - Company Website: ${state.agent.website}

    Your Role: 
    - You are writing as ${state.agent.contact_person_name} (Email: ${state.agent.contact_email}).
    - Tone: ${
      state.agent.tone
    } (Strictly adhere to this. If 'Aggressive', be persuasive and assertive. If 'Friendly', be warm and casual. If 'Professional', be formal and concise.)
    - Language: ${state.agent.language} (Ensure the response is written entirely in this language).

    Operational Constraints
    - Business Hours: ${state.agent.business_hours} (Use this if proposing times for a meeting).
    - Phone Number: ${state.agent.contact_phone} (Include this only if a call is relevant or the number exists).

    Signature: 
    - Always end the email with the following signature:
      ${state.agent.signature}
    
    Instructions:  
    - The generated email body should always be in html format. 
    ${parser.getFormatInstructions()}`;

  logger.info('Generated prompt: \n' + prompt);

  return { prompt };
}
