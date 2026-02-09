'use client';

import { useCreatePhrase } from '@/entities/phrase/model/mutations/use-create-phrase';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

type CreatePhraseFormValues = {
	title: string;
	translate: string;
	transcription: string;
};

export const CreatePhraseForm = ({ categoryId }: { categoryId: string }) => {
	const createPhraseMutation = useCreatePhrase();

	const form = useForm<CreatePhraseFormValues>({
		defaultValues: {
			title: '',
			translate: '',
			transcription: '',
		},
		mode: 'onChange',
	});

	const isSubmitting = createPhraseMutation.isPending;

	const watchedValues = useWatch({
		control: form.control,
	});

	const canSubmit = useMemo(() => {
		const { title, translate, transcription } = watchedValues;
		return (
			Boolean(categoryId) &&
			title?.trim() !== '' &&
			translate?.trim() !== '' &&
			transcription?.trim() !== '' &&
			!isSubmitting
		);
	}, [categoryId, watchedValues, isSubmitting]);

	const onSubmit = async (values: CreatePhraseFormValues) => {
		await createPhraseMutation.mutateAsync({
			title: values.title.trim(),
			translate: values.translate.trim(),
			transcription: values.transcription.trim(),
			categoryId: Number(categoryId),
		});
		form.reset({ title: '', translate: '', transcription: '' });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
				<FormField
					name="title"
					control={form.control}
					rules={{ required: 'Укажите фразу' }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Фраза</FormLabel>
							<FormControl>
								<Input placeholder="Введите фразу" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="translate"
					control={form.control}
					rules={{ required: 'Укажите перевод' }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Перевод</FormLabel>
							<FormControl>
								<Input placeholder="Введите перевод" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="transcription"
					control={form.control}
					rules={{ required: 'Укажите транскрипцию' }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Транскрипция</FormLabel>
							<FormControl>
								<Input placeholder="Введите транскрипцию" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<button
					type="submit"
					className="mt-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm disabled:opacity-50"
					disabled={!canSubmit}
				>
					{isSubmitting ? 'Сохранение...' : 'Добавить'}
				</button>
			</form>
		</Form>
	);
};
