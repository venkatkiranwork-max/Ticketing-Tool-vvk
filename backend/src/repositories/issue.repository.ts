import { Issue, type IssueDocument, type IIssueAttachment, type IIssueChecklistItem, type IIssueComment } from '../models/Issue.model.js';

type IssueStatus = IssueDocument['status'];
type IssuePriority = IssueDocument['priority'];
type IssueType = IssueDocument['type'];

export const issueRepository = {
  create(data: {
    projectId: string;
    workspaceId: string;
    key?: string;
    title: string;
    description?: string;
    type?: IssueType;
    status?: IssueStatus;
    priority?: IssuePriority;
    labels?: string[];
    assigneeId?: string;
    reporterId: string;
    dueDate?: Date;
    attachments?: IIssueAttachment[];
    checklist?: IIssueChecklistItem[];
    comments?: IIssueComment[];
  }): Promise<IssueDocument> {
    const key = data.key || `ENG-${Date.now().toString().slice(-4)}`;
    return Issue.create({ ...data, key });
  },

  findByProjectId(projectId?: string): Promise<IssueDocument[]> {
    const query = projectId ? { projectId } : {};
    return Issue.find(query).sort({ createdAt: -1 }).exec();
  },

  findById(id: string): Promise<IssueDocument | null> {
    return Issue.findById(id).exec();
  },

  updateById(id: string, updates: Partial<IssueDocument>): Promise<IssueDocument | null> {
    return Issue.findByIdAndUpdate(id, updates, { new: true }).exec();
  },

  remove(id: string): Promise<IssueDocument | null> {
    return Issue.findByIdAndDelete(id).exec();
  },
};
