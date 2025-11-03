import { AxiosError } from 'axios';
import { api } from '@/shared/api';

export interface RegisterRequest {
	username: string;
	password: string;
}

export interface RegisterResponse {
	user: {
		id: number;
		username: string;
		role: 'ADMIN' | 'MODERATOR' | 'USER';
	};
}

export const registerRequest = async (
	data: RegisterRequest
): Promise<RegisterResponse> => {
	try {
		const { data: responseData } = await api.post<RegisterResponse>(
			'/auth/register',
			data
		);
		return responseData;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(
				error.response?.data?.error || 'Failed to register'
			);
		}
		throw error;
	}
};

