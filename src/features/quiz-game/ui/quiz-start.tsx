import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { Leaderboard } from './leaderboard';

interface QuizStartProps {
	isLoading: boolean;
	startGame: () => void;
}

export const QuizStart = ({ isLoading, startGame }: QuizStartProps) => {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-6 mt-4">
					<h1 className="mb-4 text-2xl font-bold">Квиз</h1>
					<Leaderboard />
				</div>
				{isLoading ? (
					<div className="flex h-[40vh] items-center justify-center">
						<p className="text-muted-foreground">Загрузка...</p>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 py-8">
						<p className="text-center text-muted-foreground">
							Готовы начать? Проверьте свои знания ингушского языка!
						</p>
						<p className="text-center text-sm text-muted-foreground">
							Ошибки после игры попадут в{' '}
							<Link href="/study" className="text-primary underline">
								повторения
							</Link>
							, чтобы закрепить материал.
						</p>
						<Button
							onClick={startGame}
							size="lg"
							className="w-full active:bg-accent dark:active:bg-accent"
						>
							Начать игру
						</Button>
					</div>
				)}
			</main>
		</div>
	);
};
