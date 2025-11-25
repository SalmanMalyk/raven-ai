import express from 'express';
import { generate } from '../handlers/generation';

const router = express.Router();

router.post('/', generate);

export default router;
