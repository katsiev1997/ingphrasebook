export const SURVEY_VERSION = 'v1' as const;

export type SurveyOption = { id: string; label: string };

export const audienceOptions: SurveyOption[] = [
	{ id: 'beginner', label: 'Учу ингушский с нуля' },
	{ id: 'heritage', label: 'Восстанавливаю / поддерживаю язык' },
	{ id: 'phrasebook', label: 'Нужен разговорник «на сейчас»' },
	{ id: 'other', label: 'Другое' },
];

export const frequencyOptions: SurveyOption[] = [
	{ id: 'daily', label: 'Почти каждый день' },
	{ id: 'few_per_week', label: 'Несколько раз в неделю' },
	{ id: 'weekly_or_less', label: 'Раз в неделю или реже' },
	{ id: 'rare', label: 'Зашёл(ла) впервые / почти не пользуюсь' },
];

export const goalOptions: SurveyOption[] = [
	{ id: 'lookup', label: 'Найти нужную фразу' },
	{ id: 'learn', label: 'Повторить / выучить фразы' },
	{ id: 'quiz', label: 'Поиграть в квиз' },
	{ id: 'audio', label: 'Послушать произношение' },
	{ id: 'browse', label: 'Просто полистать категории' },
];

export const blockerOptions: SurveyOption[] = [
	{ id: 'unclear_start', label: 'Не понимаю, с чего начать' },
	{ id: 'forget', label: 'Забываю открыть приложение' },
	{ id: 'little_audio', label: 'Мало фраз с аудио' },
	{ id: 'no_progress', label: 'Скучно / непонятно, есть ли прогресс' },
	{ id: 'no_time', label: 'Не хватает времени' },
	{ id: 'nothing', label: 'Ничего не мешает' },
];

export const formatOptions: SurveyOption[] = [
	{ id: 'short_daily', label: 'Короткие повторения каждый день (5–10 мин)' },
	{ id: 'rare_long', label: 'Редкие, но длинные сессии' },
	{ id: 'reference', label: 'В основном справочник, без «обучения»' },
	{ id: 'not_tried', label: 'Ещё не пробовал(а) обучение' },
];

export const wishlistOptions: SurveyOption[] = [
	{ id: 'starter_pack', label: 'Готовый стартовый набор «must-know» фраз' },
	{ id: 'more_audio', label: 'Больше аудио' },
	{ id: 'offline', label: 'Офлайн / PWA' },
	{ id: 'export', label: 'Экспорт избранного' },
	{ id: 'weekly_plan', label: 'План на неделю / цели' },
	{ id: 'notes', label: 'Заметки к фразам (контекст, культура)' },
	{ id: 'pronunciation', label: 'Практика произношения' },
	{ id: 'other', label: 'Другое' },
];

export const MAX_GOALS = 2;
export const MAX_OPEN_FEEDBACK = 500;
