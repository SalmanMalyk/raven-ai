import express from 'express';
import { login, register, resetPassword, logout, verifyEmail } from '../handlers/auth';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/reset-password', resetPassword);

router.post('/logout', logout);

router.get('/verify', verifyEmail);

export default router;
