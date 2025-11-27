import logger from '@/utils/logger';
import { cleanAndParseJsonString } from '@/utils/helpers';
import { generatedResponseSchema } from '@/types/email.type';

export async function structureEmail(state: { generate: string; classify: string }) {
  logger.info('Step 4: Structuring email');

  const cleanedJsonString = cleanAndParseJsonString(state.generate as string);

  const parsedData = generatedResponseSchema.parse(cleanedJsonString);

  parsedData.classification = state.classify;

  logger.info('Structured response data: \n' + JSON.stringify(parsedData));

  return { generate: parsedData };
}
