import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export const BackButton = () => {
	return (
		<Link
			href="/"
			className="text-black dark:text-white hover:opacity-90 transition-opacity"
		>
			<button className="flex items-center gap-2 text-sm border border-border rounded-md px-4 py-2 active:bg-primary dark:active:bg-primary bg-component-light dark:bg-component-dark">
				<ArrowLeftIcon className="size-4" />
				<p>Назад</p>
			</button>
		</Link>
	);
};
