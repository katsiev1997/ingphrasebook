import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { MainProvider } from '@/shared/providers/main-provider';

const inter = Inter({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'IngPhrase',
	description: 'Ingush-Russian phrasebook',
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
					{children}
					<BottomNavigation />
				</MainProvider>
			</body>
		</html>
	);
}
