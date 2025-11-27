import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function interestedResponse(state: { email: RequestEmail; prompt: string }) {
  logger.info('Step 3: Generating response (Interested Response)');

  let prompt = state.prompt;

  prompt += `
    Goal: 
    The lead is positive. You need to secure the next step (usually a meeting or a call).

    Instructions:
    - Acknowledge their interest enthusiastically (matching your Tone).
    - Answer any specific questions asked in the {{Original Email}}.
    - Propose a specific time for a call or demo based on your {{Agent Business Hours}}.
    - Provide a Call to Action (CTA) asking them to confirm the time or check out {{Agent Website}}.
    - Keep the momentum going; do not be vague.`;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  logger.info('Generated response: \n' + response.content);

  return { generate: response.content as string };
}
