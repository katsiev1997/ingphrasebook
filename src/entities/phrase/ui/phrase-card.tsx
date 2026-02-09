'use client';

import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import { useAuth } from '@/shared/hooks/use-auth';
import { cn } from '@/shared/lib/utils';
import {
	CheckIcon,
	CopyIcon,
	EyeIcon,
	LinkIcon,
	Loader2Icon,
	SettingsIcon,
	Share2Icon,
	StarIcon,
	TrashIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { incrementPhraseViewsRequest } from '../model/api/increment-phrase-views-request';
import { useDeletePhrase } from '../model/mutations/use-delete-phrase';
import { useToggleFavorite } from '../model/mutations/use-toggle-favorite';
import { useUpdatePhrase } from '../model/mutations/use-update-phrase';
import { useGetFavoritePhrases } from '../model/queries/use-get-favorite-phrases';
import { AudioControls } from './audio-controls';

type PhraseCardProps = {
	phrase: string;
	translation: string;
	transcription: string;
	id: number;
	categoryId: number | null;
	audioUrl?: string;
	className?: string;
	views?: number;
	favoritesCount?: number;
};

export function PhraseCard({
	phrase,
	translation,
	transcription,
	audioUrl,
	className,
	id,
	categoryId,
	views: initialViews = 0,
	favoritesCount: initialFavoritesCount = 0,
}: PhraseCardProps) {
	const { user, isModeratorOrAdmin } = useAuth();
	const userId = user?.id;
	const { data: favoritePhrases } = useGetFavoritePhrases(userId);
	const { data: categories } = useGetCategories();
	const isFavorite = favoritePhrases?.findIndex((item) => item.id === id) !== -1;
	const { mutate: toggleFavorite, isPending: isFavoritePending } =
		useToggleFavorite(isFavorite);
	const { mutate: updatePhrase, isPending: isUpdatePending } = useUpdatePhrase();
	const { mutate: deletePhrase, isPending: isDeletePending } = useDeletePhrase();

	const [isEditing, setIsEditing] = useState(false);
	const [editedPhrase, setEditedPhrase] = useState(phrase);
	const [editedTranslation, setEditedTranslation] = useState(translation);
	const [editedTranscription, setEditedTranscription] = useState(transcription);
	const [editedCategoryId, setEditedCategoryId] = useState(
		String(categoryId || '')
	);
	const [views, setViews] = useState(initialViews);
	const hasIncrementedViews = useRef(false);
	const viewTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isHighlighted, setIsHighlighted] = useState(false);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const searchParams = useSearchParams();

	// Отслеживаем видимость карточки
	const { ref: inViewRef, inView } = useInView({
		threshold: 0.5, // Элемент считается видимым, если видно 50%
		triggerOnce: false, // Позволяем повторно отслеживать видимость
	});
	const setRefs = useCallback(
		(node: HTMLDivElement | null) => {
			inViewRef(node);
			cardRef.current = node;
		},
		[inViewRef]
	);

	// Увеличиваем счетчик просмотров только если фраза была видна больше 3 секунд
	// Это гарантирует, что пользователь действительно просмотрел фразу (прочитал оригинал, перевод и транскрипцию)
	useEffect(() => {
		if (inView && !hasIncrementedViews.current) {
			// Запускаем таймер на 3 секунды
			viewTimerRef.current = setTimeout(() => {
				if (!hasIncrementedViews.current) {
					hasIncrementedViews.current = true;
					incrementPhraseViewsRequest(id)
						.then((response) => {
							setViews(response.views);
						})
						.catch((error) => {
							console.error('Failed to increment phrase views:', error);
						});
				}
			}, 3000);
		} else if (!inView && viewTimerRef.current) {
			// Если элемент стал невидимым до истечения секунды, отменяем таймер
			clearTimeout(viewTimerRef.current);
			viewTimerRef.current = null;
		}

		// Очистка таймера при размонтировании
		return () => {
			if (viewTimerRef.current) {
				clearTimeout(viewTimerRef.current);
			}
		};
	}, [inView, id]);

	// Прокрутка и подсветка при переходе по ссылке ?phrase={id}
	useEffect(() => {
		const queryId = searchParams?.get('phrase');
		if (queryId && Number(queryId) === id && cardRef.current) {
			cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
			const raf = requestAnimationFrame(() => setIsHighlighted(true));
			const timer = setTimeout(() => setIsHighlighted(false), 2500);
			return () => {
				cancelAnimationFrame(raf);
				clearTimeout(timer);
			};
		}
	}, [id, searchParams]);

	// Синхронизируем счетчик избранного с пропсами (обновляется через refetch)
	const favoritesCount = initialFavoritesCount;

	const onToggleFavorite = () => {
		if (userId !== undefined) {
			toggleFavorite({ userId, phraseId: id });
		}
	};

	const onEdit = () => {
		setIsEditing(true);
		setEditedPhrase(phrase);
		setEditedTranslation(translation);
		setEditedTranscription(transcription);
		setEditedCategoryId(String(categoryId));
	};

	const onCancel = () => {
		setIsEditing(false);
		setEditedPhrase(phrase);
		setEditedTranslation(translation);
		setEditedTranscription(transcription);
		setEditedCategoryId(String(categoryId));
	};

	const onSave = () => {
		const newCategoryId = Number(editedCategoryId);
		updatePhrase(
			{
				id,
				title: editedPhrase,
				translate: editedTranslation,
				transcription: editedTranscription,
				categoryId: newCategoryId,
				audioUrl: audioUrl || undefined,
			},
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			}
		);
	};

	const onDelete = () => {
		if (confirm('Вы уверены, что хотите удалить эту фразу?')) {
			deletePhrase({
				phraseId: id,
				categoryId: categoryId ?? undefined,
			});
		}
	};

	const shareText = `${phrase}\n${translation}\n[${transcription}]`;
	const shareUrl =
		categoryId !== null && typeof window !== 'undefined'
			? `${window.location.origin}/phrases/${categoryId}?phrase=${id}`
			: null;

	const onCopyText = async () => {
		try {
			await navigator.clipboard.writeText(shareText);
			toast.success('Фраза скопирована');
			setIsPopoverOpen(false);
		} catch (error) {
			console.error('Copy failed', error);
			toast.error('Не удалось скопировать');
		}
	};

	const onCopyLink = async () => {
		if (!shareUrl) {
			toast.error('Категория неизвестна, ссылка не создана');
			return;
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
			toast.success('Ссылка скопирована');
			setIsPopoverOpen(false);
		} catch (error) {
			console.error('Link copy failed', error);
			toast.error('Не удалось скопировать ссылку');
		}
	};

	return (
		<div
			ref={setRefs}
			className={cn(
				'flex flex-col gap-4 rounded-xl bg-component-light p-4 shadow-md dark:bg-component-dark transition-all',
				isHighlighted && 'ring-2 ring-primary shadow-lg',
				className
			)}
		>
			<div className="flex gap-2">
				<div
					className={cn('flex flex-1 flex-col justify-center', {
						'gap-2': isEditing,
						'gap-0.5': !isEditing,
					})}
				>
					{isEditing ? (
						<>
							<Select
								value={editedCategoryId}
								onValueChange={setEditedCategoryId}
								disabled={!categories || categories.length === 0}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Выберите категорию" />
								</SelectTrigger>
								<SelectContent>
									{categories?.map((category) => (
										<SelectItem key={category.id} value={String(category.id)}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input
								value={editedPhrase}
								onChange={(e) => setEditedPhrase(e.target.value)}
								className="text-lg font-medium"
								placeholder="Фраза"
							/>
							<Input
								value={editedTranslation}
								onChange={(e) => setEditedTranslation(e.target.value)}
								className="text-base"
								placeholder="Перевод"
							/>
							<Input
								value={editedTranscription}
								onChange={(e) => setEditedTranscription(e.target.value)}
								className="text-base"
								placeholder="Транскрипция"
							/>
						</>
					) : (
						<>
							<p className="text-lg font-medium leading-normal text-black dark:text-white">
								{phrase}
							</p>
							<p className="text-base font-normal leading-normal text-muted-foreground">
								{translation}
							</p>
							<p className="text-base font-normal leading-normal text-muted-foreground/80">
								[{transcription}]
							</p>
						</>
					)}
				</div>
				<div className="flex flex-col gap-3">
					<button onClick={onToggleFavorite}>
						<StarIcon
							className={cn('size-6 text-foreground', {
								'text-primary': isFavorite,
								'text-primary/50': isFavoritePending,
							})}
						/>
					</button>
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<button>
								<Share2Icon className="size-6 text-foreground" />
							</button>
						</PopoverTrigger>
						<PopoverContent side="left" className="w-56 space-y-2">
							<p className="text-sm font-medium text-foreground">Поделиться</p>
							<div className="flex flex-col gap-2">
								<Button
									className="active:bg-primary dark:active:bg-primary"
									variant="secondary"
									size="sm"
									onClick={onCopyText}
								>
									<CopyIcon className="mr-2 size-4" />
									Скопировать текст
								</Button>
								<Button
									className="active:bg-primary dark:active:bg-primary"
									variant="secondary"
									size="sm"
									onClick={onCopyLink}
								>
									<LinkIcon className="mr-2 size-4" />
									Скопировать ссылку
								</Button>
							</div>
						</PopoverContent>
					</Popover>
					{isModeratorOrAdmin && (
						<button onClick={isEditing ? onCancel : onEdit}>
							<SettingsIcon
								className={cn('size-6 text-foreground', {
									'text-primary': isEditing,
								})}
							/>
						</button>
					)}
				</div>
			</div>
			{!isEditing && (
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<EyeIcon className="size-4" />
						<span>{views}</span>
					</div>
					<div className="flex items-center gap-1">
						<StarIcon className="size-4" />
						<span>{favoritesCount}</span>
					</div>
				</div>
			)}
			{isEditing && (
				<div className="flex gap-2">
					<Button
						onClick={onSave}
						disabled={isUpdatePending}
						size="sm"
						className="flex-1 active:bg-primary dark:active:bg-primary"
					>
						{isUpdatePending ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : (
							<CheckIcon className="size-4" />
						)}
						Сохранить
					</Button>
					<Button
						onClick={onDelete}
						disabled={isDeletePending}
						size="sm"
						variant="destructive"
						className="flex-1 active:bg-primary dark:active:bg-primary"
					>
						{isDeletePending ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : (
							<TrashIcon className="size-4" />
						)}
						Удалить
					</Button>
				</div>
			)}
			{!isEditing && <AudioControls phraseId={id} audioUrl={audioUrl} />}
		</div>
	);
}
