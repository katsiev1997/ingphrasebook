'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import type { AuthFormValues, AuthMode } from '../model';
import { useLogin } from '../model/mutations/use-login';
import { useRegister } from '../model/mutations/use-register';

type AuthFormProps = {
	onSubmit?: (values: AuthFormValues, mode: AuthMode) => void;
};

export const AuthForm = ({ onSubmit }: AuthFormProps) => {
	const [mode, setMode] = useState<AuthMode>('login');
	const loginMutation = useLogin();
	const registerMutation = useRegister();

	const form = useForm<AuthFormValues>({
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
		mode: 'onChange',
	});

	const handleModeChange = (newMode: AuthMode) => {
		setMode(newMode);
		if (newMode === 'login') {
			form.setValue('confirmPassword', '');
			form.clearErrors('confirmPassword');
		}
	};

	const password = useWatch({
		control: form.control,
		name: 'password',
	});

	// Перепроверяем confirmPassword при изменении password
	useEffect(() => {
		if (mode === 'register' && form.getValues('confirmPassword')) {
			form.trigger('confirmPassword');
		}
	}, [password, mode, form]);

	const handleSubmit = async (values: AuthFormValues) => {
		try {
			if (onSubmit) {
				await onSubmit(values, mode);
				return;
			}

			if (mode === 'login') {
				await loginMutation.mutateAsync({
					username: values.username,
					password: values.password,
				});
			} else {
				await registerMutation.mutateAsync({
					username: values.username,
					password: values.password,
				});
			}

			// Очищаем форму только при успехе
			form.reset({
				username: '',
				password: '',
				confirmPassword: '',
			});
		} catch {
			// Ошибки обрабатываются в mutations через toast
			// Не очищаем форму при ошибке, чтобы пользователь мог исправить данные
		}
	};

	const isSubmitting = loginMutation.isPending || registerMutation.isPending;

	return (
		<div className="space-y-4">
			<div className="flex gap-2 border-b border-border">
				<button
					type="button"
					onClick={() => handleModeChange('login')}
					className={`pb-2 px-2 text-sm font-medium transition-colors ${
						mode === 'login'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Вход
				</button>
				<button
					type="button"
					onClick={() => handleModeChange('register')}
					className={`pb-2 px-2 text-sm font-medium transition-colors ${
						mode === 'register'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Регистрация
				</button>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						name="username"
						control={form.control}
						rules={{ required: 'Введите имя пользователя' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя пользователя</FormLabel>
								<FormControl>
									<Input placeholder="Введите имя пользователя" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="password"
						control={form.control}
						rules={{
							required: 'Введите пароль',
							pattern: {
								value: /^\d{6}$/,
								message: 'Пароль должен состоять из 6 цифр',
							},
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Пароль</FormLabel>
								<FormControl>
									<Input
										type="password"
										inputMode="numeric"
										placeholder="Введите 6-значный пароль"
										maxLength={6}
										{...field}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, '');
											field.onChange(value);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{mode === 'register' && (
						<FormField
							name="confirmPassword"
							control={form.control}
							rules={{
								required: 'Повторите пароль',
								validate: (value) => {
									if (value !== form.getValues('password')) {
										return 'Пароли не совпадают';
									}
									return true;
								},
							}}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Повторите пароль</FormLabel>
									<FormControl>
										<Input
											type="password"
											inputMode="numeric"
											placeholder="Повторите 6-значный пароль"
											maxLength={6}
											{...field}
											onChange={(e) => {
												const value = e.target.value.replace(/\D/g, '');
												field.onChange(value);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting
							? 'Загрузка...'
							: mode === 'login'
							? 'Войти'
							: 'Зарегистрироваться'}
					</Button>
				</form>
			</Form>
		</div>
	);
};
