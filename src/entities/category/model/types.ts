import { iconList } from '@/shared/consts/icon-list';

export type IconName = (typeof iconList)[number]['name'];

export type Category = {
	id: number;
	name: string;
	icon: IconName;
	createdAt?: string;
	updatedAt: string;
	phraseCount?: number;
};
