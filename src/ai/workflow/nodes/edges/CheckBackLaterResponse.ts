import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function checkBackLaterResponse(state: { email: RequestEmail; prompt: string }) {
  logger.info('Step 3: Generating response (Check Back Later Response)');

  let prompt = state.prompt;

  prompt += `
    Goal: 
    The lead is busy or timing is wrong. You need to confirm a specific follow-up time.

    Instructions:
    - Acknowledge the timing issue (e.g., "I understand you are busy/in the middle of Q4").
    - Confirm you will pause communication for now.
    - Explicitly state you will reach back out in a specific timeframe (e.g., "I will follow up in 3 months") or ask them "When would be the best time to reconnect?"
    - Keep the door open in a low-pressure way.
    - If the user provides a date or timeframe, use it in your response and extract it if exists.
    - Strictly Put the extracted date or timeframe in the json response under the key "follow_up_date" in YYYY-MM-DD HH:MM Tz format.`;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  logger.info('Generated response: \n' + response.content);

  return { generate: response.content as string };
}
