import { Skeleton } from '@/shared/components/ui/skeleton';

export const PhrasesSkeleton = () => {
	return (
		<div className="mt-6 flex flex-col gap-3">
			{Array.from({ length: 5 }).map((_, index) => (
				<div
					key={index}
					className="flex flex-col gap-4 rounded-xl bg-component-light p-4 shadow-md dark:bg-component-dark"
				>
					<div className="flex items-center gap-2">
						<div className="flex flex-1 flex-col justify-center gap-0.5">
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-5 w-2/3" />
							<Skeleton className="h-4 w-1/2" />
						</div>
						<div className="flex flex-col gap-2">
							<Skeleton className="size-6 rounded-md" />
						</div>
					</div>
					<div className="space-y-3 my-2">
						<Skeleton className="h-9 w-full rounded-md" />
					</div>
				</div>
			))}
		</div>
	);
};
