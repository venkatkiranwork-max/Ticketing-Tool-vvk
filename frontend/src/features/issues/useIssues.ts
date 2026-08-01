import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { mockIssues, type MockIssue, type IssueCommentItem, type IssueAttachmentItem, type IssueChecklistItem } from '@/mock/issues';
import { addMockNotification, saveNotifications } from '@/mock/notifications';
import { mockUsers, type MockUser, toMockUser } from '@/mock/users';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { USE_MOCK_DATA } from '@/mock/config';
import { issueService } from '@/services/issueService';

// In-memory reactive store backing TanStack Query for demo/local operations
let localIssuesState: MockIssue[] = [...mockIssues];

const notifyProjectManagers = (actor: MockUser, action: string, message: string, targetKey?: string) => {
  const managers = mockUsers.filter((u) => u.role === 'Project Manager');
  managers.forEach((pm) => {
    addMockNotification({
      type: 'issue_updated',
      title: pm.id === actor.id ? `${action} (Self)` : action,
      message,
      sender: actor,
      targetKey,
    });
  });
};

const notifyAssignee = (actor: MockUser, assignee: MockUser, title: string, message: string, targetKey?: string) => {
  if (assignee.id !== actor.id) {
    addMockNotification({
      type: 'issue_assigned',
      title,
      message,
      sender: actor,
      targetKey,
    });
  }
};

export function useIssuesQuery(projectId?: string) {
  return useQuery({
    queryKey: ['issues', projectId || 'all'],
    queryFn: async () => {
      if (!USE_MOCK_DATA) {
        const fetched = await issueService.getIssues();
        if (!projectId || projectId === 'all') {
          return fetched;
        }
        return fetched.filter((i) => i.projectId === projectId);
      }

      await new Promise((res) => setTimeout(res, 30));
      if (!projectId || projectId === 'all') {
        return [...localIssuesState];
      }
      return localIssuesState.filter((i) => i.projectId === projectId);
    },
  });
}

export function useIssueDetailsQuery(issueId: string | null) {
  return useQuery({
    queryKey: ['issue', issueId],
    enabled: Boolean(issueId),
    queryFn: async () => {
      if (!USE_MOCK_DATA && issueId) {
        const allIssues = await issueService.getIssues();
        const found = allIssues.find((i) => i.id === issueId || i._id === issueId);
        if (found) return found;
      }

      await new Promise((res) => setTimeout(res, 30));
      const found = localIssuesState.find((i) => i.id === issueId || i._id === issueId);
      return found ? { ...found } : null;
    },
  });
}

export function useCreateIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      type: MockIssue['type'];
      status: MockIssue['status'];
      priority: MockIssue['priority'];
      assigneeId: string;
      reporter: MockUser;
      projectId: string;
      projectName: string;
      sprint: string;
      dueDate: string;
      labels: string[];
      storyPoints?: number;
      attachments?: IssueAttachmentItem[];
      checklist?: IssueChecklistItem[];
    }) => {
      if (!USE_MOCK_DATA) {
        const created = await issueService.createIssue({
          title: input.title,
          description: input.description || '',
          type: input.type,
          status: input.status,
          priority: input.priority,
          assigneeId: input.assigneeId,
          reporterId: (input.reporter as any).id || (input.reporter as any)._id,
          projectId: input.projectId,
          projectName: input.projectName,
          sprint: input.sprint,
          dueDate: input.dueDate,
          labels: input.labels,
          storyPoints: input.storyPoints,
        });
        return created;
      }

      await new Promise((res) => setTimeout(res, 50));

      const assigneeUser = mockUsers.find((u) => u.id === input.assigneeId) || mockUsers[0];
      const newId = `iss-${Date.now()}`;
      const newKey = `ENG-${localIssuesState.length + 101}`;

      const newIssue: MockIssue = {
        _id: newId,
        id: newId,
        key: newKey,
        title: input.title,
        description: input.description || '',
        type: input.type,
        status: input.status,
        priority: input.priority,
        assignee: assigneeUser,
        reporter: input.reporter,
        projectId: input.projectId,
        projectName: input.projectName,
        workspaceId: 'ws-1',
        sprint: input.sprint || 'Sprint 24 (Q3 Platform)',
        dueDate: input.dueDate,
        labels: input.labels || ['Feature'],
        storyPoints: input.storyPoints || 3,
        checklist: input.checklist || [],
        comments: [],
        attachments: input.attachments || [],
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now',
            actor: input.reporter,
            action: 'ISSUE_CREATED',
            details: `Created issue ${newKey}`,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localIssuesState = [newIssue, ...localIssuesState];

      // Automatically push persistent mock notifications
      if (input.reporter.role === 'Member') {
        notifyProjectManagers(
          input.reporter,
          'New Issue Created',
          `Member ${input.reporter.firstName} created issue ${newKey}: "${input.title}".`,
          newKey
        );
      }
      notifyAssignee(
        input.reporter,
        assigneeUser,
        'Issue Assigned to You',
        `${input.reporter.firstName} assigned ${newKey} to you.`,
        newKey
      );

      return newIssue;
    },
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success(`Issue ${newIssue.key || 'created'} successfully!`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create issue';
      toast.error(msg);
    },
  });
}

export function useUpdateIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      updates,
    }: {
      issueId: string;
      updates: Partial<MockIssue>;
      actor?: MockUser;
    }) => {
      if (!USE_MOCK_DATA) {
        const updated = await issueService.updateIssue(issueId, updates);
        return updated;
      }

      await new Promise((res) => setTimeout(res, 50));

      let updatedIssue: MockIssue | null = null;
      localIssuesState = localIssuesState.map((issue) => {
        if (issue.id === issueId || issue._id === issueId) {
          updatedIssue = {
            ...issue,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updatedIssue;
        }
        return issue;
      });

      return updatedIssue;
    },
    onMutate: async ({ issueId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });

      const previousQueries = queryClient.getQueriesData<MockIssue[]>({ queryKey: ['issues'] });

      queryClient.setQueriesData<MockIssue[]>({ queryKey: ['issues'] }, (old) => {
        if (!old) return old;
        return old.map((iss) => {
          if (iss.id === issueId || iss._id === issueId) {
            return { ...iss, ...updates, updatedAt: new Date().toISOString() };
          }
          return iss;
        });
      });

      queryClient.setQueryData<MockIssue | null>(['issue', issueId], (old) => {
        if (!old) return old;
        return { ...old, ...updates, updatedAt: new Date().toISOString() };
      });

      return { previousQueries };
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const msg = err?.response?.data?.message || err?.message || 'Failed to update status';
      toast.error(msg);
    },
    onSuccess: (data, variables) => {
      if (!data) return;

      const actor = variables.actor || mockUsers[0];

      // 1. If Status Changed
      if (variables.updates.status) {
        if (actor.role === 'Member') {
          notifyProjectManagers(
            actor,
            'Board Status Moved',
            `Member ${actor.firstName} moved issue ${data.key} (${data.title}) to ${variables.updates.status.toUpperCase().replace('_', ' ')}.`,
            data.key
          );
        }
        if (data.assignee) {
          notifyAssignee(
            actor,
            data.assignee,
            'Issue Status Updated',
            `Issue ${data.key} status was updated to ${variables.updates.status.toUpperCase().replace('_', ' ')} by ${actor.firstName}.`,
            data.key
          );
        }
      }

      // 2. If Assignee Changed
      if (variables.updates.assignee) {
        notifyAssignee(
          actor,
          variables.updates.assignee,
          'New Issue Assigned to You',
          `${actor.firstName} assigned ${data.key} "${data.title}" to you.`,
          data.key
        );
        if (actor.role === 'Member') {
          notifyProjectManagers(
            actor,
            'Issue Reassigned',
            `Member ${actor.firstName} reassigned issue ${data.key} to ${variables.updates.assignee.firstName}.`,
            data.key
          );
        }
      }

      // 3. If Priority Changed
      if (variables.updates.priority) {
        if (actor.role === 'Member') {
          notifyProjectManagers(
            actor,
            'Priority Updated',
            `Member ${actor.firstName} updated priority of issue ${data.key} to ${variables.updates.priority.toUpperCase()}.`,
            data.key
          );
        }
        if (data.assignee) {
          notifyAssignee(
            actor,
            data.assignee,
            'Issue Priority Changed',
            `Issue ${data.key} priority was changed to ${variables.updates.priority.toUpperCase()} by ${actor.firstName}.`,
            data.key
          );
        }
      }

      // 4. If Description Changed
      if (variables.updates.description) {
        if (actor.role === 'Member') {
          notifyProjectManagers(
            actor,
            'Description Updated',
            `Member ${actor.firstName} updated the description of issue ${data.key}.`,
            data.key
          );
        }
        if (data.assignee) {
          notifyAssignee(
            actor,
            data.assignee,
            'Issue Description Updated',
            `Issue ${data.key} description was updated by ${actor.firstName}.`,
            data.key
          );
        }
      }

      // Always save notifications to localStorage so they persist across refreshes!
      saveNotifications();
      toast.success('Project stakeholders notified of updates!');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', variables.issueId] });
    },
  });
}

export function useDeleteIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      if (!USE_MOCK_DATA) {
        await issueService.deleteIssue(issueId);
        return issueId;
      }
      await new Promise((res) => setTimeout(res, 50));
      localIssuesState = localIssuesState.filter((i) => i.id !== issueId && i._id !== issueId);
      return issueId;
    },
    onSuccess: (issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      
      try {
        const actor = toMockUser(useAuthStore.getState().user);
        if (actor && actor.role === 'Member') {
          notifyProjectManagers(
            actor,
            'Issue Deleted',
            `Member ${actor.firstName} deleted issue ID: ${issueId}.`
          );
          saveNotifications();
        }
      } catch (err) {
        console.error('Failed to dispatch delete notification:', err);
      }
      toast.success('Issue deleted');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete issue';
      toast.error(msg);
    },
  });
}

// Comments mutation hook
export function useCommentMutations(issueId: string | null) {
  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationFn: async ({ text, actor }: { text: string; actor: MockUser }) => {
      if (!issueId || !text.trim()) return;
      await new Promise((res) => setTimeout(res, 30));

      const newComment: IssueCommentItem = {
        id: `c-${Date.now()}`,
        user: actor,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const comments = [newComment, ...(iss.comments || [])];
          const history = [
            {
              id: `h-${Date.now()}-c`,
              timestamp: new Date().toISOString(),
              timeAgo: 'Just now',
              actor,
              action: 'COMMENT_ADDED',
              details: `Added a comment: "${text.slice(0, 30)}..."`,
            },
            ...(iss.history || []),
          ];

          // Notify assignee and project managers dynamically
          if (iss.assignee) {
            notifyAssignee(
              actor,
              iss.assignee,
              'New Comment Added',
              `${actor.firstName} commented on ${iss.key}: "${text.slice(0, 40)}..."`,
              iss.key
            );
          }
          if (actor.role === 'Member') {
            notifyProjectManagers(
              actor,
              'New Comment Added',
              `Member ${actor.firstName} commented on ${iss.key}: "${text.slice(0, 40)}..."`,
              iss.key
            );
          }
          saveNotifications();

          return { ...iss, comments, history, updatedAt: new Date().toISOString() };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      toast.success('Comment posted');
    },
  });

  const editComment = useMutation({
    mutationFn: async ({ commentId, newText }: { commentId: string; newText: string }) => {
      if (!issueId || !newText.trim()) return;
      await new Promise((res) => setTimeout(res, 30));

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const comments = (iss.comments || []).map((c) =>
            c.id === commentId ? { ...c, text: newText.trim(), updatedAt: new Date().toISOString() } : c
          );
          return { ...iss, comments };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      toast.success('Comment updated');
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!issueId) return;
      await new Promise((res) => setTimeout(res, 30));

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const comments = (iss.comments || []).filter((c) => c.id !== commentId);
          return { ...iss, comments };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      toast.success('Comment deleted');
    },
  });

  return { addComment, editComment, deleteComment };
}

// Attachments mutation hook
export function useAttachmentMutations(issueId: string | null) {
  const queryClient = useQueryClient();

  const addAttachment = useMutation({
    mutationFn: async ({ file, actor }: { file: File; actor: MockUser }) => {
      if (!issueId) return;
      await new Promise((res) => setTimeout(res, 50));

      const newAttachment: IssueAttachmentItem = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        fileType: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
        uploadedBy: `${actor.firstName} ${actor.lastName}`,
        uploadedAt: new Date().toISOString(),
      };

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const attachments = [newAttachment, ...(iss.attachments || [])];
          const history = [
            {
              id: `h-${Date.now()}-att`,
              timestamp: new Date().toISOString(),
              timeAgo: 'Just now',
              actor,
              action: 'ATTACHMENT_ADDED',
              details: `Uploaded attachment ${file.name}`,
            },
            ...(iss.history || []),
          ];
          return { ...iss, attachments, history, updatedAt: new Date().toISOString() };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      toast.success('Attachment uploaded');
    },
  });

  const removeAttachment = useMutation({
    mutationFn: async (attachmentId: string) => {
      if (!issueId) return;
      await new Promise((res) => setTimeout(res, 30));

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const attachments = (iss.attachments || []).filter((a) => a.id !== attachmentId);
          return { ...iss, attachments };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      toast.success('Attachment deleted');
    },
  });

  return { addAttachment, removeAttachment };
}

// Checklist mutation hook
export function useChecklistMutations(issueId: string | null) {
  const queryClient = useQueryClient();

  const addChecklistItem = useMutation({
    mutationFn: async (text: string) => {
      if (!issueId || !text.trim()) return;
      await new Promise((res) => setTimeout(res, 30));

      const newItem: IssueChecklistItem = {
        id: `ck-${Date.now()}`,
        text: text.trim(),
        isCompleted: false,
      };

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const checklist = [...(iss.checklist || []), newItem];
          return { ...iss, checklist };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    },
  });

  const toggleChecklistItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (!issueId) return;
      await new Promise((res) => setTimeout(res, 30));

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const checklist = (iss.checklist || []).map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          );
          return { ...iss, checklist };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    },
  });

  const deleteChecklistItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (!issueId) return;
      await new Promise((res) => setTimeout(res, 30));

      localIssuesState = localIssuesState.map((iss) => {
        if (iss.id === issueId || iss._id === issueId) {
          const checklist = (iss.checklist || []).filter((item) => item.id !== itemId);
          return { ...iss, checklist };
        }
        return iss;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    },
  });

  return { addChecklistItem, toggleChecklistItem, deleteChecklistItem };
}

// Sprint mutation hook
export function useCloseSprintMutation() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  return useMutation({
    mutationFn: async ({ sprintName, actor }: { sprintName: string; actor: MockUser }) => {
      await new Promise((res) => setTimeout(res, 50));

      let closedCount = 0;
      localIssuesState = localIssuesState.map((iss) => {
        if (iss.sprint === sprintName && iss.status !== 'done') {
          closedCount++;
          return { ...iss, status: 'done', updatedAt: new Date().toISOString() };
        }
        return iss;
      });

      addNotification({
        userId: actor.id,
        type: 'project_updated',
        title: 'Sprint Closed',
        message: `${actor.firstName} closed ${sprintName}. ${closedCount} open issues marked as complete.`,
      });

      return { sprintName, closedCount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`${data.sprintName} closed successfully!`);
    },
  });
}
