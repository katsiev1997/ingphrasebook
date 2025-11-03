import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface UserData {
	id: number;
	email: string;
	role: 'ADMIN' | 'MODERATOR' | 'USER';
}

interface AuthResponse {
	authenticated: boolean;
	user: UserData | null;
}

export const useAuth = () => {
	const queryClient = useQueryClient();

	const {
		data: authData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['auth'],
		queryFn: async (): Promise<AuthResponse> => {
			const { data } = await api.get<AuthResponse>('/auth');
			return data;
		},
		staleTime: 5 * 60 * 1000, // 5 минут
		retry: 1,
		refetchOnWindowFocus: false,
	});

	const user = authData?.authenticated ? authData.user : null;

	const logout = async () => {
		try {
			await api.post('/auth/logout');
			// Инвалидируем кеш аутентификации
			queryClient.setQueryData(['auth'], {
				authenticated: false,
				user: null,
			});
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const isModeratorOrAdmin = () => {
		return user?.role === 'ADMIN' || user?.role === 'MODERATOR';
	};

	return {
		user,
		loading: isLoading,
		isAuthenticated: !!user,
		isModeratorOrAdmin: isModeratorOrAdmin(),
		refetch,
		logout,
		error,
	};
};
