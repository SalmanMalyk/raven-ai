import { model } from '../../llm';
import { RequestEmail } from 'src/handlers/generation';

export async function personalizeEmail(state: { email: RequestEmail }) {
  const response = await model.invoke([
    [
      'system',
      "You are an AI assistant that extracts personalization details from emails. Extract the sender's name and the overall tone of the email. Return the result as a JSON string with keys 'senderName' and 'tone'.",
    ],
    ['human', state.email.body],
  ]);

  const personalization = response.content as string;
  console.log(`Personalization details: ${personalization}`);

  return { personalize: personalization };
}
