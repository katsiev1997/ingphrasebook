'use client';

import { PhraseList } from '@/entities/phrase';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetFavoritePhrases } from '../../../entities/phrase/model/queries/use-get-favorite-phrases';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export const FavoritePhraseList = () => {
	const { user, isAuthenticated, loading } = useAuth();
	const userId = user?.id;
	const { data: phrases, isPending, isError } = useGetFavoritePhrases(userId);

	// Если загружается информация об авторизации, не показываем ничего
	if (loading) {
		return null;
	}

	// Если пользователь не авторизован, показываем сообщение
	if (!isAuthenticated) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-8 text-center">
					<LogIn className="size-12 text-muted-foreground mb-4" />
					<p className="text-lg font-medium mb-2">Требуется авторизация</p>
					<p className="text-sm text-muted-foreground mb-4">
						Войдите в аккаунт, чтобы просматривать избранные фразы
					</p>
					<Link href="/settings" className="text-sm text-primary hover:underline">
						Перейти к настройкам
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<PhraseList phrases={phrases} isPending={isPending} isError={isError} />
	);
};
