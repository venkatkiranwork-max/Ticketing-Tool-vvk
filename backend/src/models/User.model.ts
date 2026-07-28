import mongoose, { Schema, Document } from 'mongoose';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Locked';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  role: string;
  team: string;
  status: UserStatus;
  screens?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
  mustChangePassword?: boolean;
  lastLoginAt?: Date;
  avatarUrl?: string;
  department?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate?: Date;
  refreshTokens: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = IUser;

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true, default: 'Member' },
    team: { type: String, required: true, default: 'Engineering' },
    status: { type: String, required: true, default: 'Active' },
    screens: { type: Schema.Types.Mixed, default: {} },
    permissions: { type: Schema.Types.Mixed, default: {} },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    avatarUrl: { type: String },
    department: { type: String },
    phone: { type: String },
    location: { type: String, default: 'Hyderabad' },
    bio: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    refreshTokens: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
export const User = UserModel;
