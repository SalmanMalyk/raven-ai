import { ClassificationTypes } from '@/constants/ClassificationTypes';
import { model } from '../../llm';
import { RequestEmail } from 'src/handlers/generation';

export async function classifyEmail(state: { email: RequestEmail }) {
  const classifications = Object.values(ClassificationTypes).join(', ');

  const response = await model.invoke([
    [
      'system',
      `You are an AI assistant that classifies emails. Classify the following email into one of these categories: ${classifications}. Return only the category name.`,
    ],
    ['human', state.email.body],
  ]);

  const classification = response.content as string;
  console.log(`Email classified as: ${classification}`);

  return { classify: classification };
}
