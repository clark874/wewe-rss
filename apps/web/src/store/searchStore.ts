import { create } from 'zustand';
import type { SearchMode } from '@web/components/SearchBar';

interface SearchStore {
  keywords: string[];
  searchMode: SearchMode;
  deduplicate: boolean;
  setKeywords: (keywords: string[]) => void;
  setSearchMode: (mode: SearchMode) => void;
  setDeduplicate: (deduplicate: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  keywords: [],
  searchMode: 'AND',
  deduplicate: false,
  setKeywords: (keywords) => set({ keywords }),
  setSearchMode: (searchMode) => set({ searchMode }),
  setDeduplicate: (deduplicate) => set({ deduplicate }),
}));
