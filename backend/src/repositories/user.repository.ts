import { User, type UserDocument } from '../models/User.model.js';

export const userRepository = {
  findByEmail(email: string, includePassword = false): Promise<UserDocument | null> {
    let query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query = query.select('+passwordHash');
    }
    return query.exec();
  },

  findById(id: string): Promise<UserDocument | null> {
    return User.findById(id).exec();
  },

  findByResetToken(tokenHash: string): Promise<UserDocument | null> {
    return User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    })
      .select('+passwordHash +resetPasswordToken +resetPasswordExpires')
      .exec();
  },

  create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<UserDocument> {
    return User.create(data);
  },

  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  },

  countDocuments(): Promise<number> {
    return User.countDocuments().exec();
  },
};
