import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost:
					'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

interface Ripple {
	id: string;
	x: number;
	y: number;
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	ripple = false,
	onClick,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		ripple?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';
	const [ripples, setRipples] = React.useState<Ripple[]>([]);
	const rippleIdCounter = React.useRef(0);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const wrapperRef = React.useRef<HTMLSpanElement>(null);

	const handleRipple = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (!ripple) {
				onClick?.(event);
				return;
			}

			// Вычисляем координаты относительно обертки
			const wrapper = wrapperRef.current;
			if (!wrapper) {
				onClick?.(event);
				return;
			}

			const rect = wrapper.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			rippleIdCounter.current += 1;
			const rippleId = `ripple-${rippleIdCounter.current}`;
			const newRipple: Ripple = { id: rippleId, x, y };

			setRipples((prev) => [...prev, newRipple]);

			// Удаляем ripple после анимации
			setTimeout(() => {
				setRipples((prev) => prev.filter((r) => r.id !== rippleId));
			}, 600);

			onClick?.(event);
		},
		[ripple, onClick]
	);

	if (!ripple) {
		return (
			<Comp
				{...(asChild ? {} : { ref: buttonRef })}
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				onClick={onClick}
				{...props}
			/>
		);
	}

	// Для ripple оборачиваем в span, чтобы ripple элементы были правильно позиционированы
	return (
		<span ref={wrapperRef} className="relative inline-flex overflow-hidden">
			{ripples.map((rippleEffect) => (
				<motion.span
					key={rippleEffect.id}
					className="absolute rounded-full bg-white/40 dark:bg-white/20 pointer-events-none"
					initial={{
						width: 0,
						height: 0,
						left: rippleEffect.x,
						top: rippleEffect.y,
						x: '-50%',
						y: '-50%',
						opacity: 0.6,
					}}
					animate={{
						width: 200,
						height: 200,
						opacity: 0,
					}}
					transition={{
						duration: 0.6,
						ease: 'easeOut',
					}}
				/>
			))}
			<Comp
				{...(asChild ? {} : { ref: buttonRef })}
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				onClick={handleRipple}
				{...props}
			/>
		</span>
	);
}

export { Button, buttonVariants };
