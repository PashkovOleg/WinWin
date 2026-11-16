import { create } from 'zustand'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

type AppliedFiltersState = {
	applied: SearchRequestFilter
	applyFilters: (next: SearchRequestFilter) => void
}

export const useAppliedFilters = create<AppliedFiltersState>(set => ({
	applied: [],
	applyFilters: next => {
		set({ applied: next })
	}
}))
