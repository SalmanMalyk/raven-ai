import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware';
import { createAgent, getAgents, getAgentById, updateAgent, deleteAgent } from '../handlers/agents';

const router = express.Router();

router.post('/', authenticateUser, createAgent);

router.get('/', authenticateUser, getAgents);

router.get('/:id', authenticateUser, getAgentById);

router.put('/:id', authenticateUser, updateAgent);

router.delete('/:id', authenticateUser, deleteAgent);

export default router;
