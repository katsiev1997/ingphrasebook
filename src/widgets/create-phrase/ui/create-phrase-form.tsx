'use client';

import React, { useMemo } from 'react';
import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import { useCreatePhrase } from '@/entities/phrase/model/mutations/use-create-phrase';
import { Input } from '@/shared/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/shared/components/ui/select';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/shared/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';

type CreatePhraseFormValues = {
	title: string;
	translate: string;
	transcription: string;
	categoryId: string; // store as string for Select
};

export const CreatePhraseForm = ({
	defaultCategoryId,
}: {
	defaultCategoryId: string;
}) => {
	const { data: categories, isPending: isCategoriesLoading } =
		useGetCategories();
	const createPhraseMutation = useCreatePhrase();

	const form = useForm<CreatePhraseFormValues>({
		defaultValues: {
			title: '',
			translate: '',
			transcription: '',
			categoryId: '',
		},
		mode: 'onChange',
	});

	const watchedCategoryId = useWatch({
		control: form.control,
		name: 'categoryId',
	});

	// Derive selected category without effects
	const computedCategoryId = useMemo(() => {
		if (watchedCategoryId) return watchedCategoryId;
		if (defaultCategoryId) return defaultCategoryId;
		if (categories && categories.length > 0) return String(categories[0].id);
		return '';
	}, [watchedCategoryId, defaultCategoryId, categories]);

	const isSubmitting = createPhraseMutation.isPending;

	const canSubmit = useMemo(() => {
		const { title, translate, transcription } = form.getValues();
		return (
			Boolean(computedCategoryId) &&
			title.trim() !== '' &&
			translate.trim() !== '' &&
			transcription.trim() !== '' &&
			!isSubmitting
		);
	}, [computedCategoryId, form, isSubmitting]);

	const onSubmit = async (values: CreatePhraseFormValues) => {
		const effectiveCategoryId = values.categoryId || computedCategoryId;
		await createPhraseMutation.mutateAsync({
			title: values.title.trim(),
			translate: values.translate.trim(),
			transcription: values.transcription.trim(),
			categoryId: Number(effectiveCategoryId),
		});
		form.reset({ title: '', translate: '', transcription: '', categoryId: '' });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
				<FormField
					name="categoryId"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Категория</FormLabel>
							<FormControl>
								<Select
									value={computedCategoryId}
									onValueChange={(val) => field.onChange(val)}
									disabled={isCategoriesLoading}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												isCategoriesLoading ? 'Загрузка…' : 'Выберите категорию'
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{categories?.map((c) => (
											<SelectItem key={c.id} value={String(c.id)}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
