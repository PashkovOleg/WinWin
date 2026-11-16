import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppliedFilters } from '@/features/filter/model/useAppliedFilters'
import { ConfirmFilterDialog } from '@/features/filter/ui/ConfirmFilterDialog'
import { FilterModal } from '@/features/filter/ui/FilterModal'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

export const App = () => {
	const { t } = useTranslation('filter')
	const applied = useAppliedFilters(state => state.applied)
	const applyFilters = useAppliedFilters(state => state.applyFilters)
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [pending, setPending] = useState<SearchRequestFilter | null>(null)

	const openFilters = () => {
		setIsFilterOpen(true)
	}

	const closeFilters = () => {
		setIsFilterOpen(false)
		setIsConfirmOpen(false)
		setPending(null)
	}

	const requestApply = (next: SearchRequestFilter) => {
		setPending(next)
		setIsConfirmOpen(true)
	}

	const applyNew = () => {
		if (pending) {
			applyFilters(pending)
		}
		setPending(null)
		setIsConfirmOpen(false)
		setIsFilterOpen(false)
	}

	const useOld = () => {
		setPending(null)
		setIsConfirmOpen(false)
		setIsFilterOpen(false)
	}

	const dismissConfirm = () => {
		setPending(null)
		setIsConfirmOpen(false)
	}

	useEffect(() => {
		if (!isFilterOpen && !isConfirmOpen) {
			return
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') {
				return
			}
			event.preventDefault()
			event.stopPropagation()
			if (isConfirmOpen) {
				setPending(null)
				setIsConfirmOpen(false)
				return
			}
			setIsFilterOpen(false)
			setIsConfirmOpen(false)
			setPending(null)
		}

		window.addEventListener('keydown', handleKeyDown, true)
		return () => {
			window.removeEventListener('keydown', handleKeyDown, true)
		}
	}, [isConfirmOpen, isFilterOpen])

	return (
		<section className="flex min-h-dvh flex-col items-center gap-8 px-6 py-16">
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<h1 className="text-center text-6xl text-gray-600">
				WinWinTravel frontend test task
			</h1>
			<button
				className="cursor-pointer rounded-full bg-[#FF5C00] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#e04e00]"
				onClick={openFilters}
				type="button"
			>
				{t('open')}
			</button>
			<pre className="w-full max-w-3xl overflow-auto rounded-xl bg-neutral-100 p-4 text-left text-sm text-neutral-800">
				{JSON.stringify(applied, null, 2)}
			</pre>
			<FilterModal
				isOpen={isFilterOpen}
				onApply={requestApply}
				onClose={closeFilters}
			/>
			<ConfirmFilterDialog
				isOpen={isConfirmOpen}
				onApply={applyNew}
				onClose={useOld}
				onEscape={dismissConfirm}
				onUseOld={useOld}
			/>
		</section>
	)
}
