'use client';

import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import { HelpCircle, Plus, type LucideIcon } from 'lucide-react';
import { iconList } from '@/shared/consts/icon-list';
import { IconsSheet } from './icons-sheet';

const iconMap = iconList.reduce((acc, { name, component }) => {
	acc[name] = component;
	return acc;
}, {} as Record<string, LucideIcon>);

export const CreateCategory = () => {
	const [name, setName] = useState('');
	const [selectedIcon, setSelectedIcon] = useState<string>('HelpCircleIcon');
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const IconComponent = iconMap[selectedIcon] || HelpCircle;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь будет логика отправки формы
		console.log('Create category:', { name, icon: selectedIcon || null });
	};

	const handleIconSelect = (iconName: string) => {
		setSelectedIcon(iconName);
		setIsSheetOpen(false);
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className={cn(
					'flex flex-col gap-4 rounded-xl bg-component-light p-4 shadow-sm dark:bg-component-dark'
				)}
			>
				{/* Поле ввода названия */}
				<div className="flex w-full items-center gap-4">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
						<IconComponent className="size-5" />
					</div>
					<Input
						type="text"
						placeholder="Название категории"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="flex-1 text-base font-normal leading-normal text-black dark:text-white"
					/>
				</div>

				{/* Кнопка смены иконки */}
				<Button
					type="button"
					variant="outline"
					onClick={() => setIsSheetOpen(true)}
					className="w-full active:bg-primary dark:active:bg-primary"
				>
					Сменить иконку
				</Button>

				{/* Кнопка добавления */}
				<Button
					type="submit"
					className="w-full active:bg-primary dark:active:bg-primary"
				>
					<Plus className="size-4" />
					Добавить
				</Button>
			</form>
			<IconsSheet
				isSheetOpen={isSheetOpen}
				setIsSheetOpen={setIsSheetOpen}
				selectedIcon={selectedIcon}
				handleIconSelect={handleIconSelect}
			/>
		</>
	);
};
