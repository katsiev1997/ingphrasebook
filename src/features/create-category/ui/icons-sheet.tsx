import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/shared/components/ui/sheet';
import { iconList } from '@/shared/consts/icon-list';
import { cn } from '@/shared/lib/utils';

interface IconsSheetProps {
	isSheetOpen: boolean;
	setIsSheetOpen: (isOpen: boolean) => void;
	selectedIcon: string;
	handleIconSelect: (iconName: string) => void;
}

export const IconsSheet = ({
	isSheetOpen,
	setIsSheetOpen,
	selectedIcon,
	handleIconSelect,
}: IconsSheetProps) => {
	return (
		<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
			<SheetContent side="right" className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-lg font-medium leading-normal text-black dark:text-white">
						Выберите иконку
					</SheetTitle>
				</SheetHeader>
				<div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[calc(100vh-120px)] px-4 pb-5">
					{iconList.map(({ name, component: Icon }) => {
						const isSelected = selectedIcon === name;
						return (
							<button
								key={name}
								type="button"
								onClick={() => handleIconSelect(name)}
								className={cn(
									'flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-colors',
									isSelected
										? 'bg-primary text-primary-foreground'
										: 'bg-component-light dark:bg-component-dark hover:bg-primary/10'
								)}
							>
								<Icon className="size-6" />
								<span className="text-xs truncate w-full text-center">
									{name.replace('Icon', '')}
								</span>
							</button>
						);
					})}
				</div>
			</SheetContent>
		</Sheet>
	);
};
