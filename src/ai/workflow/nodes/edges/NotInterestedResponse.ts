import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function notInterestedResponse(state: { email: RequestEmail; prompt: string }) {
  logger.info('Step 3: Generating response (Not Interested Response)');

  let prompt = state.prompt;

  prompt += `
    Goal: 
    The lead has rejected the offer. You need to leave a polite final impression without being pushy.

    Instructions:
    - Polite acknowledgment of their decision.
    - Do not try to "overcome objections" unless the objection is clearly based on a misunderstanding (keep it brief).
    - If your Tone is 'Friendly' or 'Professional', wish them well and say you will take them off the list.
    - If your Tone is 'Aggressive/Persuasive', ask one final, short "Hail Mary" question about why they aren't interested, or ask if you can keep them on file for future updates.
    - Close the conversation respectfully.`;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  logger.info('Generated response: \n' + response.content);

  return { generate: response.content as string };
}
