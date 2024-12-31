import { create } from 'zustand';
import { SearchMode } from '@web/components/SearchBar';

interface SearchState {
  keywords: string[];
  searchMode: SearchMode;
  setKeywords: (keywords: string[]) => void;
  setSearchMode: (mode: SearchMode) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keywords: [],
  searchMode: 'AND',
  setKeywords: (keywords) => set({ keywords }),
  setSearchMode: (mode) => set({ searchMode: mode }),
  reset: () => set({ keywords: [], searchMode: 'AND' }),
}));
