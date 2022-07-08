import express from 'express';

import validate from '../middleware/validate';
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from '../schemas/userSchema';
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from '../controllers/userController';

const router = express.Router();

router.post('/api/users/register', validate(createUserSchema), createUserHandler);
router.post(
  '/api/users/verify/:id/:verificationCode',
  validate(verifyUserSchema),
  verifyUserHandler
);
router.post('/api/users/forgotpassword', validate(forgotPasswordSchema), forgotPasswordHandler);
router.post(
  '/api/users/resetpassword/:id/:passwordResetCode',
  validate(resetPasswordSchema),
  resetPasswordHandler
);
router.get('/api/users/me', getCurrentUserHandler)

export default router;
