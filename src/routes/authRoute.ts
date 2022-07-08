import express from 'express';

import { createSessionHandler, refreshAccessTokenHandler } from '../controllers/authController';
import validate from '../middleware/validate';
import { createSessionSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/api/session/login', validate(createSessionSchema), createSessionHandler);
router.post('/api/sessions/refresh', refreshAccessTokenHandler);

export default router;
