'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Loader2, RotateCcw, Volume2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetGamePhrases } from '@/features/quiz-game/model/queries/use-get-game-phrases';
import { useGetDueCards } from '../model/queries/use-learning-queries';
import { useSubmitReview } from '../model/mutations/use-learning-mutations';
import type { DueCard } from '../model/api/learning-requests';
import type { Phrase } from '@/db/schema';

function usePhraseAudio(audioUrl: string | null | undefined) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!audioUrl) {
			audioRef.current = null;
			return;
		}

		const audio = new Audio();
		audio.preload = 'auto';
		audioRef.current = audio;

		const markReady = () => setReady(true);
		audio.addEventListener('canplaythrough', markReady);
		audio.addEventListener('loadeddata', markReady);
		audio.src = audioUrl;
		audio.load();

		return () => {
			audio.pause();
			audio.removeEventListener('canplaythrough', markReady);
			audio.removeEventListener('loadeddata', markReady);
			audioRef.current = null;
		};
	}, [audioUrl]);

	const play = useCallback(() => {
		const audio = audioRef.current;
		if (!audio || !ready) {
			return;
		}
		audio.currentTime = 0;
		void audio.play();
	}, [ready]);

	return { ready, play, hasAudio: Boolean(audioUrl) };
}

function FlashcardSession({
	card,
	flipped,
	onFlip,
	onKnown,
	onUnknown,
	progressLabel,
	demo,
}: {
	card: Phrase;
	flipped: boolean;
	onFlip: () => void;
	onKnown: () => void;
	onUnknown: () => void;
	progressLabel: string;
	demo?: boolean;
}) {
	const { ready, play, hasAudio } = usePhraseAudio(card.audioUrl);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>{progressLabel}</span>
				{demo && <span>Демо (без сохранения)</span>}
			</div>

			<button
				type="button"
				onClick={onFlip}
				className="w-full min-h-[220px] rounded-2xl border border-border bg-card p-6 text-left shadow-sm active:scale-[0.99] transition"
			>
				<motion.div
					key={flipped ? 'back' : 'front'}
					initial={{ rotateY: 90, opacity: 0 }}
					animate={{ rotateY: 0, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					{/* Front: Russian prompt; back: Ingush + transcription */}
					<p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
						{flipped ? 'Ингушский' : 'Русский'}
					</p>
					<p className="text-2xl font-semibold text-foreground leading-snug">
						{flipped ? card.title : card.translate}
					</p>
					{flipped && (
						<p className="mt-3 text-muted-foreground">{card.transcription}</p>
					)}
					<p className="mt-8 text-sm text-muted-foreground">
						Нажмите, чтобы перевернуть
					</p>
				</motion.div>
			</button>

			{hasAudio && (
				<Button
					type="button"
					variant="outline"
					className="w-full active:scale-[0.98] active:bg-accent dark:active:bg-accent"
					disabled={!ready}
					onClick={play}
				>
					{ready ? (
						<Volume2 className="mr-2 size-4" />
					) : (
						<Loader2 className="mr-2 size-4 animate-spin" />
					)}
					{ready ? 'Слушать' : 'Загрузка аудио...'}
				</Button>
			)}

			<div className="grid grid-cols-2 gap-3">
				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={onUnknown}
					className="h-14 active:scale-[0.98] active:bg-accent dark:active:bg-accent"
				>
					<X className="mr-2 size-5" />
					Не знаю
				</Button>
				<Button
					type="button"
					size="lg"
					onClick={onKnown}
					className="h-14 active:scale-[0.98] active:bg-primary/80"
				>
					<Check className="mr-2 size-5" />
					Знаю
				</Button>
			</div>
		</div>
	);
}

function SessionEmpty({
	finished,
	knownCount,
	total,
	hardOnly,
}: {
	finished: boolean;
	knownCount: number;
	total: number;
	hardOnly: boolean;
}) {
	return (
		<div className="mt-12 space-y-4 text-center">
			<p className="text-2xl font-bold">
				{finished ? 'Сессия завершена' : 'На сегодня всё'}
			</p>
			{finished && (
				<p className="text-muted-foreground">
					Знакомых в этой сессии: {knownCount} / {total}
				</p>
			)}
			{!finished && (
				<p className="text-muted-foreground">
					Нет карточек к повторению. Загляните завтра или добавьте фразы в
					избранное.
				</p>
			)}
			<div className="grid gap-2">
				<Button asChild className="w-full">
					<Link href="/">К фразам</Link>
				</Button>
				{!hardOnly && (
					<Button asChild variant="outline" className="w-full">
						<Link href="/flashcards?hard=1">Сложные фразы</Link>
					</Button>
				)}
				<Button asChild variant="outline" className="w-full">
					<Link href="/dictation">Диктовка</Link>
				</Button>
				<Button asChild variant="outline" className="w-full">
					<Link href="/dialogues">Диалоги</Link>
				</Button>
			</div>
		</div>
	);
}

function DemoFlashcards({ phrases }: { phrases: Phrase[] }) {
	const deck = useMemo(() => phrases.slice(0, 10), [phrases]);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [done, setDone] = useState(false);
	const [knownCount, setKnownCount] = useState(0);

	const card = deck[index];

	const answer = (known: boolean) => {
		if (known) {
			setKnownCount((c) => c + 1);
		}
		setFlipped(false);
		if (index + 1 >= deck.length) {
			setDone(true);
		} else {
			setIndex((i) => i + 1);
		}
	};

	if (deck.length === 0) {
		return (
			<p className="text-muted-foreground text-center mt-12">
				Недостаточно фраз для демо.
			</p>
		);
	}

	if (done) {
		return (
			<div className="mt-12 space-y-4 text-center">
				<p className="text-2xl font-bold">Демо завершено</p>
				<p className="text-muted-foreground">
					Знакомых: {knownCount} / {deck.length}
				</p>
				<p className="text-sm text-muted-foreground">
					Войдите в аккаунт, чтобы сохранять прогресс и повторять по расписанию.
				</p>
				<Button asChild className="w-full">
					<Link href="/settings">Войти</Link>
				</Button>
			</div>
		);
	}

	return (
		<FlashcardSession
			card={card}
			flipped={flipped}
			onFlip={() => setFlipped((f) => !f)}
			onKnown={() => answer(true)}
			onUnknown={() => answer(false)}
			progressLabel={`${index + 1} / ${deck.length}`}
			demo
		/>
	);
}

function AuthenticatedFlashcardDeck({
	initialQueue,
	hardOnly,
}: {
	initialQueue: DueCard[];
	hardOnly: boolean;
}) {
	const queryClient = useQueryClient();
	const { mutate: submitReview } = useSubmitReview();
	/** Snapshot for the whole session — do not replace when due-query refetches. */
	const [queue] = useState(initialQueue);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [knownCount, setKnownCount] = useState(0);
	const [finished, setFinished] = useState(false);
	/** Prevents double-tap reviewing the same card twice before React re-renders. */
	const lastAnsweredIdRef = useRef<number | null>(null);

	const current = queue[index]?.phrase;

	useEffect(() => {
		if (!finished) {
			return;
		}
		void queryClient.invalidateQueries({ queryKey: ['learning-due'] });
		void queryClient.invalidateQueries({ queryKey: ['learning-summary'] });
	}, [finished, queryClient]);

	const handleAnswer = useCallback(
		(known: boolean) => {
			if (!current || finished) {
				return;
			}
			if (lastAnsweredIdRef.current === current.id) {
				return;
			}
			lastAnsweredIdRef.current = current.id;

			const phraseId = current.id;
			const nextIndex = index + 1;
			const isLast = nextIndex >= queue.length;

			// Optimistic UI: advance immediately, persist in background
			if (known) {
				setKnownCount((c) => c + 1);
			}
			setFlipped(false);
			if (isLast) {
				setFinished(true);
			} else {
				setIndex(nextIndex);
			}

			submitReview({ phraseId, known });
		},
		[current, finished, index, queue.length, submitReview]
	);

	if (!queue.length || finished || !current) {
		return (
			<SessionEmpty
				finished={finished}
				knownCount={knownCount}
				total={queue.length}
				hardOnly={hardOnly}
			/>
		);
	}

	return (
		<FlashcardSession
			key={current.id}
			card={current}
			flipped={flipped}
			onFlip={() => setFlipped((f) => !f)}
			onKnown={() => handleAnswer(true)}
			onUnknown={() => handleAnswer(false)}
			progressLabel={`${index + 1} / ${queue.length}`}
		/>
	);
}

export function FlashcardsView() {
	const { isAuthenticated, loading: authLoading } = useAuth();
	const searchParams = useSearchParams();
	const favoritesOnly = searchParams.get('favorites') === '1';
	const hardOnly = searchParams.get('hard') === '1';
	const categoryIdParam = searchParams.get('categoryId');
	const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

	const dueParams = useMemo(
		() => ({
			favoritesOnly,
			hardOnly,
			categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
			limit: 20,
		}),
		[favoritesOnly, hardOnly, categoryId]
	);

	const { data: dueCards, isPending, isError, refetch } = useGetDueCards(
		dueParams,
		isAuthenticated
	);
	const { data: demoPhrases } = useGetGamePhrases();

	if (authLoading) {
		return <p className="text-muted-foreground mt-8">Загрузка...</p>;
	}

	if (!isAuthenticated) {
		return (
			<div className="space-y-4">
				<p className="text-muted-foreground">
					Демо-режим: прогресс не сохраняется. Войдите, чтобы включить
					повторения по интервалам.
				</p>
				<DemoFlashcards phrases={demoPhrases || []} />
			</div>
		);
	}

	if (isPending) {
		return <p className="text-muted-foreground mt-8">Загрузка карточек...</p>;
	}

	if (isError) {
		return (
			<div className="mt-8 space-y-3 text-center">
				<p className="text-muted-foreground">Не удалось загрузить карточки</p>
				<Button variant="outline" onClick={() => refetch()}>
					<RotateCcw className="mr-2 size-4" />
					Повторить
				</Button>
			</div>
		);
	}

	return (
		<AuthenticatedFlashcardDeck
			key={`deck-${favoritesOnly}-${hardOnly}-${categoryId ?? 'all'}`}
			initialQueue={dueCards ?? []}
			hardOnly={hardOnly}
		/>
	);
}
