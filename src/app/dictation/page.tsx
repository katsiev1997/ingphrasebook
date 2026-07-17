'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Volume2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { BackButton } from '@/shared/components/back-button';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetDueCards } from '@/features/flashcards/model/queries/use-learning-queries';
import { useSubmitReview } from '@/features/flashcards/model/mutations/use-learning-mutations';
import { useGetGamePhrases } from '@/features/quiz-game/model/queries/use-get-game-phrases';
import type { Phrase } from '@/db/schema';

function normalize(text: string) {
	return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function DictationPage() {
	const { isAuthenticated } = useAuth();
	const { data: dueCards, isPending } = useGetDueCards(
		{ limit: 30 },
		isAuthenticated
	);
	const { data: demoPhrases } = useGetGamePhrases();
	const { mutateAsync: submitReview, isPending: reviewing } = useSubmitReview();

	const deck = useMemo(() => {
		if (isAuthenticated && dueCards) {
			return dueCards
				.map((c) => c.phrase)
				.filter((p): p is Phrase => !!p?.audioUrl);
		}
		return (demoPhrases || []).filter((p) => !!p.audioUrl).slice(0, 10);
	}, [isAuthenticated, dueCards, demoPhrases]);

	const [index, setIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
	const [knownCount, setKnownCount] = useState(0);
	const [finished, setFinished] = useState(false);

	const current = deck[index];

	const play = () => {
		if (!current?.audioUrl) {
			return;
		}
		void new Audio(current.audioUrl).play();
	};

	const check = async () => {
		if (!current || result) {
			return;
		}
		const ok = normalize(answer) === normalize(current.title);
		setResult(ok ? 'correct' : 'wrong');
		if (ok) {
			setKnownCount((c) => c + 1);
		}
		if (isAuthenticated) {
			await submitReview({ phraseId: current.id, known: ok });
		}
	};

	const next = () => {
		setAnswer('');
		setResult(null);
		if (index + 1 >= deck.length) {
			setFinished(true);
		} else {
			setIndex((i) => i + 1);
		}
	};

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Диктовка
					</h1>
					<BackButton />
				</div>

				{!isAuthenticated && (
					<p className="text-sm text-muted-foreground">
						Демо: прогресс не сохраняется. Нужны фразы с аудио.
					</p>
				)}

				{isPending && isAuthenticated && (
					<p className="text-muted-foreground">Загрузка...</p>
				)}

				{!isPending && deck.length === 0 && (
					<div className="space-y-3 text-center mt-8">
						<p className="text-muted-foreground">
							Нет фраз с аудио для диктовки.
						</p>
						<Button asChild variant="outline">
							<Link href="/study">К учёбе</Link>
						</Button>
					</div>
				)}

				{finished && (
					<div className="mt-8 space-y-4 text-center">
						<p className="text-2xl font-bold">Готово</p>
						<p className="text-muted-foreground">
							Верно: {knownCount} / {deck.length}
						</p>
						<Button asChild className="w-full">
							<Link href="/study">К учёбе</Link>
						</Button>
					</div>
				)}

				{current && !finished && (
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							{index + 1} / {deck.length}
						</p>
						<Button type="button" className="w-full h-14" onClick={play}>
							<Volume2 className="mr-2 size-5" />
							Прослушать
						</Button>
						<p className="text-sm text-muted-foreground">
							Напишите фразу на ингушском
						</p>
						<Input
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Ваш ответ"
							disabled={!!result || reviewing}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									void check();
								}
							}}
						/>
						{result === 'correct' && (
							<p className="flex items-center gap-2 text-green-600 dark:text-green-400">
								<Check className="size-4" /> Верно
							</p>
						)}
						{result === 'wrong' && (
							<div className="space-y-1 text-red-600 dark:text-red-400">
								<p className="flex items-center gap-2">
									<X className="size-4" /> Неверно
								</p>
								<p className="text-sm text-muted-foreground">
									Правильно: {current.title}
								</p>
							</div>
						)}
						{!result ? (
							<Button
								className="w-full"
								disabled={!answer.trim() || reviewing}
								onClick={() => void check()}
							>
								Проверить
							</Button>
						) : (
							<Button className="w-full" onClick={next}>
								Дальше
							</Button>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
