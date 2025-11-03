import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	loginRequest,
	type LoginRequest,
	type LoginResponse,
} from '../api/login-request';
import { toast } from 'sonner';

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
			return await loginRequest(data);
		},
		onSuccess: (data) => {
			// Устанавливаем данные сразу для мгновенного обновления UI
			// Cookies уже установлены сервером в HTTP ответе
			const authData = {
				authenticated: true,
				user: {
					id: data.user.id,
					username: data.user.username,
					role: data.user.role,
				},
			};
			queryClient.setQueryData(['auth'], authData);
			toast.success('Вы успешно вошли в систему');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Ошибка при входе');
		},
	});
};

