import type { Request, Response } from 'express';
import { User, UserStatus } from '../models/User.model.js';
import { AuditLog } from '../models/AuditLog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import { EmailService } from '../services/email.service.js';
import bcrypt from 'bcrypt';

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 });
  return sendSuccess(res, users, 'Users loaded successfully');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }
  return sendSuccess(res, user, 'User profile loaded');
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { avatarUrl, phone, location, bio } = req.body;
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }

  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (bio !== undefined) user.bio = bio;

  await user.save();
  return sendSuccess(res, user, 'Profile updated successfully');
});

export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, role, team } = req.body;
  const defaultPassword = await bcrypt.hash('Password123!', 10);
  const firstName = email.split('@')[0];
  const count = await User.countDocuments();
  const employeeId = `EMP-${1001 + count}`;

  const user = await User.create({
    email,
    passwordHash: defaultPassword,
    firstName,
    lastName: 'User',
    employeeId,
    role: role || 'Member',
    team: team || 'Engineering',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: team || 'Engineering',
    location: 'Hyderabad',
    bio: '',
    joinDate: new Date(),
  });

  return sendCreated(res, user, 'User invited successfully');
});

export const createUserDirect = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, employeeId, department, team, role, phone, location } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  const tempPassword = 'Temp@1234';
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const count = await User.countDocuments();
  const finalEmpId = employeeId || `EMP-${1001 + count}`;

  const user = await User.create({
    firstName,
    lastName,
    email,
    employeeId: finalEmpId,
    department: department || 'Engineering',
    team: team || 'Engineering',
    role: role || 'Member',
    phone: phone || '',
    location: location || 'Hyderabad',
    passwordHash,
    status: 'Active',
    mustChangePassword: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  // Send Welcome Email
  await EmailService.sendWelcomeEmail({
    recipientName: `${firstName} ${lastName}`,
    email,
    temporaryPassword: tempPassword,
  });

  // Audit Log
  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'CREATE_USER',
    module: 'User Management',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Created user account for ${firstName} ${lastName} (${email}) with EMP ID ${finalEmpId}`,
  });

  return sendCreated(res, user, 'User created successfully and welcome email queued');
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { status } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const targetStatus: UserStatus = status || (user.status === 'Active' ? 'Inactive' : 'Active');
  user.status = targetStatus;
  await user.save();

  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'UPDATE_USER_STATUS',
    module: 'User Management',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Updated status for ${user.firstName} ${user.lastName} to ${targetStatus}`,
  });

  return sendSuccess(res, user, `User status updated to ${user.status}`);
});

export const updateScreenAccess = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { screens } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.screens = { ...user.screens, ...screens };
  user.markModified('screens');
  await user.save();

  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'UPDATE_SCREEN_ACCESS',
    module: 'Screen Access',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Updated screen access permissions for ${user.firstName} ${user.lastName}`,
  });

  return sendSuccess(res, user, 'Screen access updated successfully');
});

export const updateFeaturePermissions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { permissions } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.permissions = { ...user.permissions, ...permissions };
  user.markModified('permissions');
  await user.save();

  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'UPDATE_FEATURE_PERMISSIONS',
    module: 'Permissions',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Updated feature permissions for ${user.firstName} ${user.lastName}`,
  });

  return sendSuccess(res, user, 'Feature permissions updated successfully');
});

export const resetUserPasswordAdmin = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const tempPassword = 'Temp@1234';
  user.passwordHash = await bcrypt.hash(tempPassword, 10);
  user.mustChangePassword = true;
  await user.save();

  await EmailService.sendResetPasswordEmail({
    recipientName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    temporaryPassword: tempPassword,
  });

  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'RESET_PASSWORD',
    module: 'User Management',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Reset password for user ${user.firstName} ${user.lastName} (${user.email})`,
  });

  return sendSuccess(res, { email: user.email, temporaryPassword: tempPassword }, 'Password reset email queued');
});

export const adminUpdateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { firstName, lastName, email, role, team, department, status, phone, location, password } = req.body;

  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw new NotFoundError('User not found');
  }

  if (firstName !== undefined) user.firstName = firstName.trim();
  if (lastName !== undefined) user.lastName = lastName.trim();
  if (email !== undefined) user.email = email.trim().toLowerCase();
  if (role !== undefined) user.role = role;
  if (team !== undefined) user.team = team;
  if (department !== undefined) user.department = department;
  if (status !== undefined) user.status = status;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;

  if (password && password.trim().length > 0) {
    if (password.trim().length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long');
    }
    user.passwordHash = await bcrypt.hash(password.trim(), 10);
    user.mustChangePassword = false;
  }

  await user.save();

  const adminName = (req as any).user?.firstName ? `${(req as any).user.firstName} ${(req as any).user.lastName}` : 'Super Admin';
  const adminRole = (req as any).user?.role || 'Super Admin';
  await AuditLog.create({
    userName: adminName,
    userRole: adminRole,
    action: 'ADMIN_UPDATE_USER',
    module: 'User Management',
    ipAddress: req.ip || '127.0.0.1',
    status: 'SUCCESS',
    details: `Updated details/password for user ${user.firstName} ${user.lastName} (${user.email})`,
  });

  return sendSuccess(res, user, 'User updated successfully');
});
