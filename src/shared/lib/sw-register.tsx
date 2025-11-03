'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from './sw-register';

export const ServiceWorkerRegister = () => {
	useEffect(() => {
		registerServiceWorker();
	}, []);

	return null;
};
