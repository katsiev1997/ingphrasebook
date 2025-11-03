'use client';

import { AuthForm } from '@/features/auth';
import { useAuth } from '@/shared/hooks/use-auth';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';

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
						<span className="text-sm text-muted-foreground">Пользователь:</span>
						<Badge variant="default">{user.username}</Badge>
					</div>
					<Button variant="outline" onClick={handleLogout} className="w-full">
						Выйти из аккаунта
					</Button>
				</div>
			) : (
				<AuthForm />
			)}
		</div>
	);
};
