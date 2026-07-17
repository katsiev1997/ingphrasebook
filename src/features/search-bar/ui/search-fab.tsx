'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function SearchFab() {
	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-28 z-60 mx-auto flex max-w-md justify-end px-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.8, y: 0 }}
				animate={{
					opacity: 1,
					scale: 1,
					y: [0, -10, -4, -12, 0],
				}}
				transition={{
					opacity: { duration: 0.2 },
					scale: { type: 'spring', stiffness: 400, damping: 22 },
					y: {
						duration: 6.4,
						repeat: Infinity,
						ease: 'easeInOut',
						times: [0, 0.35, 0.55, 0.75, 1],
					},
				}}
			>
				<Link
					href="/search"
					aria-label="Поиск фраз"
					className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-4px] shadow-primary/50"
				>
					<Search className="size-6" />
				</Link>
			</motion.div>
		</div>
	);
}
