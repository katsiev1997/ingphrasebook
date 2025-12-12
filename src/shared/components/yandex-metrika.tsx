'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ym, { YMInitializer } from 'react-yandex-metrika';

const YM_COUNTER_ID = 105812506; // Замените на ваш ID счетчика

export const YandexMetrika = () => {
	const pathname = usePathname();

	// Отправляем событие "hit" при изменении маршрута
	useEffect(() => {
		if (pathname) {
			ym('hit', pathname);
		}
	}, [pathname]);

	return (
		<YMInitializer
			accounts={[YM_COUNTER_ID]}
			options={{
				ssr: true,
				clickmap: true,
				ecommerce: 'dataLayer',
				accurateTrackBounce: true,
				trackLinks: true,
			}}
			version="2"
		/>
	);
};
