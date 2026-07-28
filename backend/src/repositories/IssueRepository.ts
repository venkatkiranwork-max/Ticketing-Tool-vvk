import { IssueModel, IIssue } from '../models/Issue.model.js';

export class IssueRepository {
  async findById(id: string): Promise<IIssue | null> {
    return IssueModel.findOne({ _id: id, isDeleted: false });
  }

  async findByKey(key: string): Promise<IIssue | null> {
    return IssueModel.findOne({ key, isDeleted: false });
  }

  async findAll(filter: Record<string, unknown> = {}, skip = 0, limit = 50): Promise<{ issues: IIssue[]; total: number }> {
    const query = { ...filter, isDeleted: false };
    const [issues, total] = await Promise.all([
      IssueModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      IssueModel.countDocuments(query),
    ]);
    return { issues, total };
  }

  async create(issueData: Partial<IIssue>): Promise<IIssue> {
    const issue = new IssueModel(issueData);
    return issue.save();
  }

  async update(id: string, updateData: Partial<IIssue>): Promise<IIssue | null> {
    return IssueModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true });
  }

  async softDelete(id: string, deletedBy: string): Promise<IIssue | null> {
    return IssueModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }
}
