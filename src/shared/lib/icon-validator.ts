import * as Icons from 'lucide-react';

/**
 * Проверяет, существует ли иконка в lucide-react
 * @param iconName - имя иконки с суффиксом "Icon" (например: "HomeIcon", "UserIcon", "SettingsIcon")
 *                   или без суффикса для обратной совместимости
 * @returns true если иконка существует, false иначе
 */
export function isValidLucideIcon(
	iconName: string | null | undefined
): boolean {
	if (!iconName) return false;

	// Поддерживаем обратную совместимость
	const iconKey = iconName.endsWith('Icon') ? iconName : `${iconName}Icon`;

	const IconComponent = Icons[iconKey as keyof typeof Icons];

	return IconComponent !== undefined && typeof IconComponent === 'function';
}

/**
 * Получает список всех доступных иконок из lucide-react
 * @returns массив имен иконок с суффиксом "Icon"
 */
export function getAvailableIcons(): string[] {
	return Object.keys(Icons)
		.filter((key) => key.endsWith('Icon'))
		.sort();
}
