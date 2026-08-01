import { Router } from 'express';
import {
  listUsers,
  getUserById,
  updateUserProfile,
  inviteUser,
  createUserDirect,
  toggleUserStatus,
  updateScreenAccess,
  updateFeaturePermissions,
  resetUserPasswordAdmin,
  adminUpdateUser,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { AuditLog } from '../models/AuditLog.model.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

// Public / User level
router.get(['/', ''], listUsers);
router.get('/:id', getUserById);
router.patch('/:id/profile', updateUserProfile);

// Admin level operations (Super Admin)
router.post('/invite', authorize('Super Admin', 'super_admin'), inviteUser);
router.post('/direct', authorize('Super Admin', 'super_admin'), createUserDirect);
router.patch(['/:id/status', '/:id/status/'], authorize('Super Admin', 'super_admin'), toggleUserStatus);

// Flexible route matching for admin user update (supports /update, /admin-update, or /:id)
router.patch(
  ['/:id/update', '/:id/update/', '/:id/admin-update', '/:id/admin-update/', '/:id', '/:id/'],
  authorize('Super Admin', 'super_admin'),
  adminUpdateUser
);

router.patch(['/:id/screens', '/:id/screens/'], authorize('Super Admin', 'super_admin'), updateScreenAccess);
router.patch(['/:id/permissions', '/:id/permissions/'], authorize('Super Admin', 'super_admin'), updateFeaturePermissions);
router.post(['/:id/reset-password', '/:id/reset-password/'], authorize('Super Admin', 'super_admin'), resetUserPasswordAdmin);

// Audit logs list
router.get(
  '/audit-logs/list',
  authorize('Super Admin', 'super_admin'),
  asyncHandler(async (_req, res) => {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    return sendSuccess(res, logs, 'Audit logs retrieved');
  })
);

export default router;
