import express from 'express';
import { generate, generateFollowup } from '../handlers/generation';
import { authenticateUser } from '@/middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticateUser, generate);

router.post('/followup', authenticateUser, generateFollowup);

export default router;
