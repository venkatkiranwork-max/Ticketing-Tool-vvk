import { RefreshToken, type RefreshTokenDocument } from '../models/RefreshToken.model.js';

export const refreshTokenRepository = {
  create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshTokenDocument> {
    return RefreshToken.create(data);
  },

  findValidByHash(tokenHash: string): Promise<RefreshTokenDocument | null> {
    return RefreshToken.findOne({
      tokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  },

  async revokeByHash(tokenHash: string): Promise<void> {
    await RefreshToken.updateOne({ tokenHash }, { revoked: true }).exec();
  },

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshToken.updateMany({ userId, revoked: false }, { revoked: true }).exec();
  },
};
