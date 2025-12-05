// routes/users.routes.js
import { Router } from 'express';
import { homepageHandler, registerHandler, loginHandler } from '../controllers/users.controller.js';
import { validationMiddleware, loginSchema, registerSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/', homepageHandler);

router.post('/register', validationMiddleware(registerSchema), registerHandler);

router.post('/login', validationMiddleware(loginSchema), loginHandler);

export default router;
