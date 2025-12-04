'use client';

import { AuthForm } from '@/features/auth';
import { useAuth } from '@/shared/hooks/use-auth';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { toast } from 'sonner';

const userType = {
	USER: 'Пользователь',
	MODERATOR: 'Модератор',
	ADMIN: 'Админ',
};

export const AuthBlock = () => {
	const { user, isAuthenticated, logout, loading } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Вы успешно вышли из аккаунта');
		} catch {
			toast.error('Ошибка при выходе');
		}
	};

	return (
		<div>
			{loading ? (
				<div className="text-muted-foreground">Загрузка...</div>
			) : isAuthenticated && user ? (
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">
							{userType[user.role]}:
						</span>
						<Badge variant="default">{user.username}</Badge>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" className="w-full">
								Выйти из аккаунта
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Подтвердите выход</AlertDialogTitle>
								<AlertDialogDescription>
									Вы уверены, что хотите выйти из аккаунта? Вам потребуется
									снова войти для доступа к избранным фразам и статистике.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Отмена</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleLogout}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Выйти
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			) : (
				<AuthForm />
			)}
		</div>
	);
};
