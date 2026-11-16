import { useQuery } from '@tanstack/react-query'

import { FilterItem } from '@/shared/api/types/Filter'
import filterData from '@/shared/temp/filterData.json'

export const filterItemsQueryKey = ['filterItems'] as const

const loadFilterItems = async (): Promise<FilterItem[]> => {
	const data = filterData as { filterItems: FilterItem[] }
	return data.filterItems
}

export const useFilterItems = () =>
	useQuery({
		queryKey: filterItemsQueryKey,
		queryFn: loadFilterItems
	})
