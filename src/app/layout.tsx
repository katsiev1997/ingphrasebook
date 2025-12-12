import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { MainProvider } from '@/shared/providers/main-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { FirstVisitRedirect } from '@/shared/components/first-visit-redirect';
import { YandexMetrika } from '@/shared/components/yandex-metrika';

const inter = Inter({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'IngPhrase',
	description: 'Ingush-Russian phrasebook',
	metadataBase: new URL('https://ingphrasebook.com'),
	openGraph: {
		title: 'IngPhrase',
		description: 'Ingush-Russian phrasebook',
		images: ['/favicon.ico'],
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
					<FirstVisitRedirect />
					{children}
					<BottomNavigation />
					<Toaster position="top-left" />
					<YandexMetrika />
				</MainProvider>
			</body>
		</html>
	);
}
