import { Loader2Icon } from 'lucide-react';

export const QuizLoader = () => {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="flex h-[60vh] gap-2 items-center justify-center">
					<p className="text-muted-foreground">Loading...</p>
					<Loader2Icon className="size-5 text-primary animate-spin" />
				</div>
			</main>
		</div>
	);
};
