import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issueService } from '@/services/issueService';
import { queryKeys } from '@/lib/queryKeys';
import type { MockIssue } from '@/mock/issues';

export function useIssuesQuery() {
  const queryClient = useQueryClient();

  const issuesQuery = useQuery({
    queryKey: queryKeys.issues,
    queryFn: () => issueService.getIssues(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MockIssue['status'] }) =>
      issueService.updateIssueStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues });
    },
  });

  const deleteIssueMutation = useMutation({
    mutationFn: (id: string) => issueService.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues });
    },
  });

  return {
    ...issuesQuery,
    updateIssueStatus: updateStatusMutation.mutateAsync,
    deleteIssue: deleteIssueMutation.mutateAsync,
  };
}
