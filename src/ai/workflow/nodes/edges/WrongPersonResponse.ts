import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function wrongPersonResponse(state: { email: RequestEmail; prompt: string }) {
  logger.info('Step 3: Generating response (Wrong Person Response)');

  let prompt = state.prompt;

  prompt += `
    Goal: 
    The recipient is not the decision-maker. You need to find out who is.

    Instructions:
    - Apologize for the interruption.
    - Ask politely if they can point you in the direction of the correct person to speak with regarding {{Agent Description}}.
    - If they provided a referral in the ${state.email.body}, thank them and confirm you will reach out to that person.
    - Keep this response very short.
    - If they refer to a specific person, ask for their contact details and confirm you will reach out to them.
    - Ask for their email address and confirm you will reach out to them.
    - Put the extracted email address in the json response under the key "delegate_email".
  `;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  logger.info('Generated response: \n' + response.content);

  return { generate: response.content as string };
}
