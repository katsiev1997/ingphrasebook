import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { LucideIconName } from '@/db/schema';

/**
 * Получает компонент иконки из lucide-react по имени
 * @param iconName - имя иконки (например: "Home", "User", "Settings")
 * @returns компонент иконки или null, если иконка не найдена
 */
export function getLucideIcon(iconName: LucideIconName | null | undefined) {
	if (!iconName) return null;

	// В lucide-react иконки экспортируются с суффиксом "Icon"
	// Например: Home -> HomeIcon, User -> UserIcon
	const iconKey = `${iconName}Icon` as keyof typeof Icons;
	const IconComponent = Icons[iconKey];

	if (!IconComponent || typeof IconComponent !== 'function') {
		return null;
	}

	return IconComponent;
}

/**
 * Компонент для отображения иконки по имени
 */
export function DynamicIcon({
	iconName,
	className,
	...props
}: {
	iconName: LucideIconName | null | undefined;
	className?: string;
} & LucideProps) {
	const IconComponent = getLucideIcon(iconName);

	if (!IconComponent) {
		return null;
	}

	return <IconComponent className={className} {...props} />;
}

