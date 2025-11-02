import * as Icons from 'lucide-react';
import type { LucideProps, LucideIcon } from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import type { LucideIconName } from '@/db/schema';
import { createElement } from 'react';

/**
 * Получает компонент иконки из lucide-react по имени
 * @param iconName - имя иконки (например: "Home", "User", "Settings")
 * @returns компонент иконки или null, если иконка не найдена
 */
export function getLucideIcon(
	iconName: LucideIconName | null | undefined
): LucideIcon | null {
	if (!iconName) return null;

	// В lucide-react иконки экспортируются с суффиксом "Icon"
	// Например: Home -> HomeIcon, User -> UserIcon
	const iconKey = `${iconName}Icon` as keyof typeof Icons;
	const IconComponent = Icons[iconKey];

	if (!IconComponent || typeof IconComponent !== 'function') {
		return null;
	}

	return IconComponent as LucideIcon;
}

/**
 * Компонент для отображения иконки по имени с fallback иконкой
 */
export function DynamicIcon({
	iconName,
	className,
	showFallback = true,
	...props
}: {
	iconName: LucideIconName | null | undefined;
	className?: string;
	showFallback?: boolean;
} & LucideProps) {
	const IconComponent = getLucideIcon(iconName);

	if (!IconComponent) {
		if (showFallback) {
			return <HelpCircle className={className} {...props} />;
		}
		return null;
	}

	return createElement(IconComponent, { className, ...props });
}
