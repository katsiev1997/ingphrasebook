import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { BottomNavigation } from '@/widgets/bottom-navigation';

const inter = Inter({
	variable: '--font-display',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Phrasebook',
	description: 'Phrasebook application',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased`}>
				<ThemeProvider>
					{children}
					<BottomNavigation />
				</ThemeProvider>
			</body>
		</html>
	);
}
