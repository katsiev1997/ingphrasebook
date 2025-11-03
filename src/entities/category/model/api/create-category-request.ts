import { AxiosError } from 'axios';
import { Category } from '../types';
import { api } from '@/shared/api';

interface CreateCategoryRequest {
	name: string;
}

export const createCategoryRequest = async (
	data: CreateCategoryRequest
): Promise<Category> => {
	try {
		const { data: responseData } = await api.post('/categories', data);
		return responseData;
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(error.response?.data?.error || 'Failed to create category');
		}
		throw error;
	}
};
