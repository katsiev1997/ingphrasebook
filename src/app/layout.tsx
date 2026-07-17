import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { MainProvider } from '@/shared/providers/main-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { FirstVisitRedirect } from '@/shared/components/first-visit-redirect';
import { YandexMetrika } from '@/shared/components/yandex-metrika';
import { ServiceWorkerRegister } from '@/shared/lib/service-worker-register';
import { InstallPrompt } from '@/features/pwa-install';

const inter = Inter({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'IngPhrase',
	description: 'Ingush-Russian phrasebook',
	metadataBase: new URL('https://ingphrasebook.com'),
	appleWebApp: {
		capable: true,
		title: 'IngPhrase',
		statusBarStyle: 'default',
	},
	icons: {
		icon: [
			{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
			{ url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
		],
		apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
	},
	openGraph: {
		title: 'IngPhrase',
		description: 'Ingush-Russian phrasebook',
		images: ['/icons/icon-512.png'],
	},
	verification: {
		yandex: 'ef95042f4ee58daa',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	userScalable: false,
	viewportFit: 'cover',
	themeColor: '#ee8c2b',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body className={`${inter.variable} antialiased`}>
				<MainProvider>
					<ServiceWorkerRegister />
					<FirstVisitRedirect />
					{children}
					<BottomNavigation />
					<InstallPrompt />
					<Toaster position="top-left" />
					<YandexMetrika />
				</MainProvider>
			</body>
		</html>
	);
}
