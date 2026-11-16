import { type MouseEvent, type SyntheticEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type ConfirmFilterDialogProps = {
	isOpen: boolean
	onClose: () => void
	onEscape: () => void
	onApply: () => void
	onUseOld: () => void
}

const confirmButtonClassName =
	'min-w-0 flex-1 cursor-pointer rounded-2xl border-2 px-6 py-4 text-sm font-medium transition-colors'

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

export const ConfirmFilterDialog = ({
	isOpen,
	onClose,
	onEscape,
	onApply,
	onUseOld
}: ConfirmFilterDialogProps) => {
	const { t } = useTranslation('filter')
	const dialogRef = useRef<HTMLDialogElement>(null)

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
		onEscape()
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<dialog
			aria-labelledby="confirm-filter-title"
			className="m-auto hidden w-[min(40rem,calc(100%-2rem))] rounded-2xl border-0 bg-white p-0 text-neutral-700 shadow-xl open:block backdrop:bg-black/40"
			onCancel={handleCancel}
			onClick={handleBackdropClick}
			ref={dialogRef}
		>
			<div className="relative px-8 pb-10 pt-8">
				<h2
					className="px-8 text-center text-[22px] font-medium text-neutral-700"
					id="confirm-filter-title"
				>
					{t('confirmTitle')}
				</h2>
				<button
					aria-label={t('close')}
					className="absolute right-5 top-5 cursor-pointer rounded-full p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
					onClick={onClose}
					type="button"
				>
					<CloseIcon />
				</button>
				<div className="mt-10 flex items-center gap-4">
					<button
						className={`${confirmButtonClassName} border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50`}
						onClick={onUseOld}
						type="button"
					>
						{t('useOld')}
					</button>
					<button
						className={`${confirmButtonClassName} border-[#FF5C00] bg-[#FF5C00] text-white hover:border-[#e04e00] hover:bg-[#e04e00]`}
						onClick={onApply}
						type="button"
					>
						{t('applyNew')}
					</button>
				</div>
			</div>
		</dialog>
	)
}
