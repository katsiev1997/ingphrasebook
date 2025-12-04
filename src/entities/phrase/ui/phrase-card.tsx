'use client';

import { cn } from '@/shared/lib/utils';
import { AudioControls } from './audio-controls';
import {
	StarIcon,
	SettingsIcon,
	CheckIcon,
	TrashIcon,
	Loader2Icon,
	EyeIcon,
} from 'lucide-react';
import { useToggleFavorite } from '../model/mutations/use-toggle-favorite';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetFavoritePhrases } from '../model/queries/use-get-favorite-phrases';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/shared/components/ui/select';
import { useUpdatePhrase } from '../model/mutations/use-update-phrase';
import { useDeletePhrase } from '../model/mutations/use-delete-phrase';
import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import { incrementPhraseViewsRequest } from '../model/api/increment-phrase-views-request';
import { useInView } from 'react-intersection-observer';

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

	// Отслеживаем видимость карточки
	const { ref, inView } = useInView({
		threshold: 0.5, // Элемент считается видимым, если видно 50%
		triggerOnce: false, // Позволяем повторно отслеживать видимость
	});

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
				oldCategoryId:
					categoryId !== null && categoryId !== newCategoryId
						? categoryId
						: undefined,
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

	return (
		<div
			ref={ref}
			className={cn(
				'flex flex-col gap-4 rounded-xl bg-component-light p-4 shadow-md dark:bg-component-dark',
				className
			)}
		>
			<div className="flex items-center gap-2">
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
				<div className="flex flex-col gap-2">
					<button onClick={onToggleFavorite}>
						<StarIcon
							className={cn('size-6 text-foreground', {
								'text-primary': isFavorite,
								'text-primary/50': isFavoritePending,
							})}
						/>
					</button>
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
						className="flex-1"
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
						className="flex-1"
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
