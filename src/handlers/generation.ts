import logger from '../utils/logger';
import express from 'express';

export const generate = async (_req: express.Request, res: express.Response) => {
  logger.info('Generating Response');
  res.send('Generating Response');
};
