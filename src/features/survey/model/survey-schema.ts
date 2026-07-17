import { z } from 'zod';
import { MAX_GOALS, MAX_OPEN_FEEDBACK, SURVEY_VERSION } from './survey-questions';

export const surveyAnswersSchema = z.object({
	audience: z.enum(['beginner', 'heritage', 'phrasebook', 'other']),
	frequency: z.enum(['daily', 'few_per_week', 'weekly_or_less', 'rare']),
	goals: z
		.array(z.enum(['lookup', 'learn', 'quiz', 'audio', 'browse']))
		.min(1)
		.max(MAX_GOALS),
	blockers: z
		.array(
			z.enum([
				'unclear_start',
				'forget',
				'little_audio',
				'no_progress',
				'no_time',
				'nothing',
			])
		)
		.min(1),
	format: z.enum(['short_daily', 'rare_long', 'reference', 'not_tried']),
	wishlist: z.enum([
		'starter_pack',
		'more_audio',
		'offline',
		'export',
		'weekly_plan',
		'notes',
		'pronunciation',
		'other',
	]),
	nps: z.number().int().min(0).max(10),
	openFeedback: z.string().max(MAX_OPEN_FEEDBACK).optional(),
});

export type SurveyAnswers = z.infer<typeof surveyAnswersSchema>;

export const submitSurveyBodySchema = z.object({
	surveyVersion: z.literal(SURVEY_VERSION),
	answers: surveyAnswersSchema,
});

export type SubmitSurveyBody = z.infer<typeof submitSurveyBodySchema>;