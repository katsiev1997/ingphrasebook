import { AxiosError } from 'axios';
import { Category } from '../types';
import { api } from '@/shared/api';

export const getCategoriesRequest = async (): Promise<Category[]> => {
	try {
		const { data } = await api.get('/categories');
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(error.response?.data.message);
		}
		throw error;
	}
};
