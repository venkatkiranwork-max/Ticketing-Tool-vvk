import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  forgotPasswordValidator,
  loginValidator,
  logoutValidator,
  refreshValidator,
  registerValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/refresh', refreshValidator, validateRequest, authController.refresh);
router.post('/logout', logoutValidator, validateRequest, authController.logout);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateRequest, authController.resetPassword);

router.get('/me', authenticate, authController.me);

router.get(
  '/admin/ping',
  authenticate,
  authorize('Super Admin', 'super_admin'),
  (_req, res) => sendSuccess(res, { ok: true }, 'Admin access granted'),
);

export default router;
