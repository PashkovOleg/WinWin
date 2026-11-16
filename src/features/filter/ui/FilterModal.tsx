import {
	type MouseEvent,
	type SubmitEvent,
	type SyntheticEvent,
	useEffect,
	useRef,
	useState
} from 'react'
import { useTranslation } from 'react-i18next'

import { FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

import { useFilterItems } from '../api/useFilterItems'
import { useAppliedFilters } from '../model/useAppliedFilters'

type FilterModalProps = {
	isOpen: boolean
	onClose: () => void
	onApply: (next: SearchRequestFilter) => void
}

const CloseIcon = () => (
	<svg
		aria-hidden="true"
		className="size-5"
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			d="M6 6l12 12M18 6L6 18"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth="1.5"
		/>
	</svg>
)

const isOptionSelected = (
	draft: SearchRequestFilter,
	filterId: string,
	optionId: string
) =>
	draft.some(item => item.id === filterId && item.optionsIds.includes(optionId))

const toggleOption = (
	draft: SearchRequestFilter,
	filterId: string,
	optionId: string
): SearchRequestFilter => {
	const group = draft.find(item => item.id === filterId)
	if (!group) {
		return [
			...draft,
			{
				id: filterId,
				type: FilterType.OPTION,
				optionsIds: [optionId]
			}
		]
	}

	const isSelected = group.optionsIds.includes(optionId)
	const optionsIds = isSelected
		? group.optionsIds.filter(currentId => currentId !== optionId)
		: [...group.optionsIds, optionId]

	if (optionsIds.length === 0) {
		return draft.filter(item => item.id !== filterId)
	}

	return draft.map(item => {
		if (item.id !== filterId) {
			return item
		}
		return { ...item, optionsIds }
	})
}

export const FilterModal = ({ isOpen, onClose, onApply }: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const dialogRef = useRef<HTMLDialogElement>(null)
	const applied = useAppliedFilters(state => state.applied)
	const { data, isError, isPending } = useFilterItems()
	const [draft, setDraft] = useState<SearchRequestFilter>(applied)

	useEffect(() => {
		if (isOpen) {
			setDraft(applied)
		}
	}, [isOpen])

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) {
			return
		}
		if (isOpen) {
			if (!dialog.open) {
				dialog.showModal()
			}
			return
		}
		if (dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
		event.preventDefault()
		onClose()
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		onApply(draft)
	}

	const handleToggle = (filterId: string, optionId: string) => {
		setDraft(current => toggleOption(current, filterId, optionId))
	}

	const clearDraft = () => {
		setDraft([])
	}

	return (
		<dialog
			aria-labelledby="filter-modal-title"
			className="m-auto hidden max-h-[calc(100%-2rem)] w-[min(42rem,calc(100%-2rem))] flex-col rounded-2xl border-0 bg-white p-0 text-neutral-700 shadow-xl open:flex backdrop:bg-black/40"
			onCancel={handleCancel}
			onClick={handleBackdropClick}
			ref={dialogRef}
		>
			<form
				className="flex min-h-0 flex-1 flex-col"
				onSubmit={handleSubmit}
			>
				<div className="relative px-6 pb-2 pt-5">
					<h2
						className="text-center text-[22px] font-medium"
						id="filter-modal-title"
					>
						{t('title')}
					</h2>
					<button
						aria-label={t('close')}
						className="absolute right-5 top-5 cursor-pointer rounded-full p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
						onClick={onClose}
						type="button"
					>
						<CloseIcon />
					</button>
				</div>
				<div className="min-h-0 flex-1 overflow-y-auto px-8 pb-4">
					{isPending ? <p>{t('loading')}</p> : null}
					{isError ? <p>{t('error')}</p> : null}
					{data?.map(item => (
						<fieldset
							className="mb-4 border-0 border-b border-neutral-200 p-0 pb-4 last:mb-0 last:border-b-0"
							key={item.id}
						>
							<legend className="mb-3 text-sm font-medium text-neutral-800">
								{item.name}
							</legend>
							<ul className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
								{item.options.map(option => (
									<li key={option.id}>
										<label className="flex cursor-pointer items-start gap-2">
											<input
												checked={isOptionSelected(draft, item.id, option.id)}
												className="mt-0.5 size-3.5 accent-[#FF5C00]"
												onChange={() => {
													handleToggle(item.id, option.id)
												}}
												type="checkbox"
											/>
											<span className="text-sm text-neutral-700">
												{option.name}
											</span>
										</label>
									</li>
								))}
							</ul>
						</fieldset>
					))}
				</div>
				<div className="relative flex items-center justify-center px-6 pb-5 pt-4">
					<button
						className="cursor-pointer rounded-md bg-[#FF5C00] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e04e00]"
						type="submit"
					>
						{t('apply')}
					</button>
					<button
						className="absolute right-6 cursor-pointer text-sm font-medium text-[#0d9b9b] underline underline-offset-2 transition-colors hover:text-[#087a7a]"
						onClick={clearDraft}
						type="button"
					>
						{t('clearAll')}
					</button>
				</div>
			</form>
		</dialog>
	)
}
