import { create } from 'zustand';

export type DrawerTab = 'details' | 'comments' | 'attachments' | 'activity';

export interface IssueFilters {
  search: string;
  status: string;
  priority: string;
  project: string;
  type: string;
}

interface UiState {
  // Drawer state
  selectedIssueId: string | null;
  isDrawerOpen: boolean;
  activeDrawerTab: DrawerTab;

  // Create Issue Modal state
  isCreateModalOpen: boolean;

  // Filters
  filters: IssueFilters;

  // Actions
  openDrawer: (issueId: string, tab?: DrawerTab) => void;
  closeDrawer: () => void;
  setDrawerTab: (tab: DrawerTab) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setFilters: (newFilters: Partial<IssueFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: IssueFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  project: 'all',
  type: 'all',
};

export const useUiStore = create<UiState>((set) => ({
  selectedIssueId: null,
  isDrawerOpen: false,
  activeDrawerTab: 'details',

  isCreateModalOpen: false,

  filters: initialFilters,

  openDrawer: (issueId, tab = 'details') =>
    set({
      selectedIssueId: issueId,
      isDrawerOpen: true,
      activeDrawerTab: tab,
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      selectedIssueId: null,
    }),

  setDrawerTab: (tab) => set({ activeDrawerTab: tab }),

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));
