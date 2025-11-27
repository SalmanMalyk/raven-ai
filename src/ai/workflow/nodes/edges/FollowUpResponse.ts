import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import { Agent } from '@/types/agent.types';

export async function followUpResponse(state: {
  email: RequestEmail;
  agent: Agent;
  classify: string;
  personalize: string;
}) {
  const prompt = `You are responding to a follow-up inquiry.
Agent Information: ${state.agent.name} - ${state.agent.description}
Website: ${state.agent.website}

Personalization Context: ${state.personalize}

Original Email: ${state.email.body}

Generate a responsive follow-up that:
- Addresses their specific questions or concerns
- Provides additional information they requested
- Moves the conversation forward
- Suggests concrete next steps`;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  return { generate: response.content as string };
}
