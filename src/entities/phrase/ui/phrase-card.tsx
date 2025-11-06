'use client';

import { cn } from '@/shared/lib/utils';
import { AudioControls } from './audio-controls';
import { StarIcon } from 'lucide-react';
import { useToggleFavorite } from '../model/mutations/use-toggle-favorite';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetFavoritePhrases } from '../model/queries/use-get-favorite-phrases';

type PhraseCardProps = {
	phrase: string;
	translation: string;
	transcription: string;
	id: number;
	audioUrl?: string;
	className?: string;
};

export function PhraseCard({
	phrase,
	translation,
	transcription,
	audioUrl,
	className,
	id,
}: PhraseCardProps) {
	const { user } = useAuth();
	const userId = user?.id;
	const { data: favoritePhrases } = useGetFavoritePhrases(userId);
	const isFavorite = favoritePhrases?.findIndex((item) => item.id === id) !== -1;
	const { mutate, isPending } = useToggleFavorite(isFavorite);

	const onToggleFavorite = () => {
		if (userId !== undefined) {
			mutate({ userId, phraseId: id });
		}
	};
	return (
		<div
			className={cn(
				'flex flex-col gap-4 rounded-xl bg-component-light p-4 shadow-md dark:bg-component-dark',
				className
			)}
		>
			<div className="flex items-center gap-2">
				<div className="flex flex-1 flex-col justify-center gap-0.5">
					<p className="text-lg font-medium leading-normal text-black dark:text-white">
						{phrase}
					</p>
					<p className="text-base font-normal leading-normal text-muted-foreground">
						{translation}
					</p>
					<p className="text-base font-normal leading-normal text-muted-foreground/80">
						[{transcription}]
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<button onClick={onToggleFavorite}>
						<StarIcon
							className={cn('size-6 text-foreground', {
								'text-primary': isFavorite,
								'text-primary/50': isPending,
							})}
						/>
					</button>
				</div>
			</div>
			<AudioControls phraseId={id} audioUrl={audioUrl} />
		</div>
	);
}
