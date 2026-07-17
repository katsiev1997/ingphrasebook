import { api } from '@/shared/api';
import type { SurveyAnswers } from '../survey-schema';
import { SURVEY_VERSION } from '../survey-questions';

export type SurveyStatus = { submitted: boolean };

export const getSurveyStatusRequest = async () => {
	const { data } = await api.get<SurveyStatus>('/survey');
	return data;
};

export const submitSurveyRequest = async (answers: SurveyAnswers) => {
	const { data } = await api.post<{ id: number; submitted: boolean }>(
		'/survey',
		{
			surveyVersion: SURVEY_VERSION,
			answers,
		}
	);
	return data;
};
