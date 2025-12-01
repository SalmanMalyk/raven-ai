import { Agent } from '@/types/agent.types';
import { model } from '../../../llm';
import { RequestEmail } from 'src/handlers/generation';
import logger from '@/utils/logger';

export async function followUpResponse(state: { email: RequestEmail; agent: Agent; prompt: string; followup_number: number; history: any }) {
  logger.info('Started follow-up response handler.');

  let prompt = state.prompt;

  const history = state.history ? JSON.stringify(state.history) : '';

  prompt += `
    Goal: 
    Proactively re-engage the interested lead after n days of silence, using a strategy that adapts to the number of previous attempts.
    
    Instructions:
    - Analyze the Follow-up Count (${state.followup_number}):
    - Follow-up 1 or 2 (Initial Nudge): Keep the email very short, polite, and reference the previous conversation. Assume they got busy. Ask one simple, non-pressuring question to elicit a reply. Propose a specific time based on ${state.agent.business_hours}.
    - Follow-up 3 to 5 (Value Add): Briefly remind them of a key benefit of ${state.agent.description}. Share a quick, useful piece of content or a new insight (if available in the history) to justify the check-in. Be direct in asking for a quick call.
    - Follow-up 6+ (Breakup): State clearly that this is the final message regarding this proposal for now. Politely ask for a final YES or NO. Use the Agent Tone to provide closure (e.g., "I'll assume the timing isn't right."). Offer an easy path to reconnect in the future.
    - Crucially, review the entire (${history}) to ensure the new email does not repeat previous content or scheduling attempts.
    - Maintain the standard Agent Tone (${state.agent.tone}).
    `;

  const response = await model.invoke([
    ['system', prompt],
    ['human', 'Generate the response email'],
  ]);

  logger.info('Generated response: \n' + response.content);

  return { generate: response.content as string };
}
