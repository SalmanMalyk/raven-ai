import { ClassificationTypes } from '@/constants/ClassificationTypes';
import { model } from '../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function classifyEmail(state: { email: RequestEmail }) {
  logger.info('Step 2:Classifying email');

  const classifications = Object.values(ClassificationTypes).join(', ');

  const response = await model.invoke([
    [
      'system',
      `You are an AI assistant that classifies emails. Classify the following email into one of these categories: ${classifications}. Return only the category name.`,
    ],
    ['human', state.email.body],
  ]);

  const classification = response.content as string;

  logger.info(`Email classified as: ${classification}`);

  return { classify: classification };
}
