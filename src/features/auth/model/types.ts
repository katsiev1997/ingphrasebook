export type AuthMode = 'login' | 'register';

export type AuthFormValues = {
	username: string;
	password: string;
	confirmPassword?: string;
};
