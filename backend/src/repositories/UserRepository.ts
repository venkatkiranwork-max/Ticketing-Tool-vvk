import { UserModel, IUser } from '../models/User.model.js';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email, isDeleted: false });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false });
  }

  async findAll(filter: Record<string, unknown> = {}, skip = 0, limit = 20): Promise<{ users: IUser[]; total: number }> {
    const query = { ...filter, isDeleted: false };
    const [users, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);
    return { users, total };
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true });
  }

  async softDelete(id: string, deletedBy: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }
}
