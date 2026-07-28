import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { queryKeys } from '@/lib/queryKeys';
import type { MockProject } from '@/mock/projects';

export function useProjectsQuery() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => projectService.getProjects(),
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: Partial<MockProject>) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });

  const archiveProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.archiveProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MockProject> }) => projectService.updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });

  return {
    ...projectsQuery,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    archiveProject: archiveProjectMutation.mutateAsync,
  };
}
