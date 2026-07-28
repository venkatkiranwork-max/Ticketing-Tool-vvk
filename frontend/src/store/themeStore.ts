import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaletteMode } from '@mui/material';

type ThemeState = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      toggleMode: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
      setMode: (mode) => set({ mode }),
    }),
    { name: 'ticketflow-theme' },
  ),
);
