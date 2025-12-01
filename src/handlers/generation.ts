import logger from '../utils/logger';
import express from 'express';
import * as z from 'zod';

import { emailWorkflow } from '../ai/workflow/generate.workflow';
import { getAuthenticatedSupabaseClient } from '@/utils/supabase';
import { followupWorkflow } from '@/ai/workflow/followup.workflow';

export const requestEmail = z.object({
  agent_id: z.string('Agent ID is required').uuid(),
  agent: z.object().optional(),
  from: z.string('From email field is required').email(),
  subject: z.string().optional(),
  body: z.string('Body field is required').min(10),
});

export type RequestEmail = z.infer<typeof requestEmail>;

export const generate = async (req: express.Request, res: express.Response) => {
  logger.info('Started generating response handler.');

  try {
    const validated = requestEmail.parse(req.body);
    const agent = await getAgentById(validated.agent_id, req.token ?? '');

    const result = await emailWorkflow.invoke({ email: validated, agent: agent });

    res.status(200).json({
      message: 'Data received',
      data: result.generate,
    });
  } catch (error) {
    logger.error(error);

    if (error instanceof z.ZodError) {
      return res.status(422).json({
        success: false,
        message: 'Validation Error',
        errors: z.flattenError(error),
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: error.message,
      });
    }
  }
};

export const generateFollowup = async (req: express.Request, res: express.Response) => {
  logger.info('Started generating followup response handler.');

  try {
    const validated = requestEmail.parse(req.body);
    const agent = await getAgentById(validated.agent_id, req.token ?? '');

    const result = await followupWorkflow.invoke({
      thread_id: '1',
      email: validated,
      agent: agent,
      followup_number: 1,
      history: [],
    });

    res.status(200).json({
      message: 'Data received',
      data: result.generate,
    });
  } catch (error) {
    logger.error(error);

    if (error instanceof z.ZodError) {
      return res.status(422).json({
        success: false,
        message: 'Validation Error',
        errors: z.flattenError(error),
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: error.message,
      });
    }
  }
};

const getAgentById = async (agentId: string, token: string) => {
  const supabase = getAuthenticatedSupabaseClient(token);
  const { data: agent, error } = await supabase.from('agents').select('*').eq('id', agentId).single();
  if (error) {
    logger.error(error);
    return {
      success: false,
      message: 'Internal Server Error',
      errors: error.message,
    };
  }

  return agent;
};
