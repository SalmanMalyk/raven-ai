import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import { getProfile } from '../handlers/user';

const router = express.Router();

router.get('/profile', authenticateUser, getProfile);

export default router;
