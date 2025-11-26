import express from 'express';
import { generate } from '../handlers/generation';
import { authenticateUser } from '@/middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticateUser, generate);

export default router;
