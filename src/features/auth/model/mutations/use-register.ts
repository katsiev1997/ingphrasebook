import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	registerRequest,
	type RegisterRequest,
	type RegisterResponse,
} from '../api/register-request';
import { toast } from 'sonner';

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: RegisterRequest
		): Promise<RegisterResponse> => {
			return await registerRequest(data);
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
			toast.success('Регистрация прошла успешно');
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Ошибка при регистрации');
		},
	});
};

