// routes/users.routes.js
import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import { createInteraction, getInteractions } from '../controllers/interactions.controller.js';

const router = Router();

router.post('/:companyId/interactions', authenticationMiddleware, createInteraction);
router.get('/:companyId/interactions', authenticationMiddleware, getInteractions);

export default router;
