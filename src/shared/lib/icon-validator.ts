import * as Icons from 'lucide-react';

/**
 * Проверяет, существует ли иконка в lucide-react
 * @param iconName - имя иконки без суффикса "Icon" (например: "Home", "User", "Settings")
 * @returns true если иконка существует, false иначе
 */
export function isValidLucideIcon(
	iconName: string | null | undefined
): boolean {
	if (!iconName) return false;

	const iconKey = `${iconName}Icon` as keyof typeof Icons;
	const IconComponent = Icons[iconKey];

	return IconComponent !== undefined && typeof IconComponent === 'function';
}

/**
 * Получает список всех доступных иконок из lucide-react
 * @returns массив имен иконок (без суффикса "Icon")
 */
export function getAvailableIcons(): string[] {
	return Object.keys(Icons)
		.filter((key) => key.endsWith('Icon'))
		.map((key) => key.replace('Icon', ''))
		.sort();
}

