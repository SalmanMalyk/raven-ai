import logger from '../utils/logger';
import express from 'express';
import * as z from 'zod';

import { emailWorkflow } from '../ai/workflow/generate.workflow';

export const requestEmail = z.object({
  from: z.string('From email field is required').email(),
  subject: z.string().optional(),
  body: z.string('Body field is required').min(10),
});

export type RequestEmail = z.infer<typeof requestEmail>;

export const generate = async (_req: express.Request, res: express.Response) => {
  logger.info('Started generating response handler.');

  try {
    const validated = requestEmail.parse(_req.body);

    const result = await emailWorkflow.invoke({ email: validated });

    res.status(200).json({
      message: 'Data received',
      data: result.generate,
    });
  } catch (error) {
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
