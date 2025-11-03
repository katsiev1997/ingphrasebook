import { AxiosError } from 'axios';
import { api } from '@/shared/api';

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: {
		id: number;
		username: string;
		role: 'ADMIN' | 'MODERATOR' | 'USER';
	};
}

export const loginRequest = async (
	data: LoginRequest
): Promise<LoginResponse> => {
	try {
		const { data: responseData } = await api.post<LoginResponse>(
			'/auth/login',
			data
		);
		return responseData;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(
				error.response?.data?.error || 'Failed to login'
			);
		}
		throw error;
	}
};

