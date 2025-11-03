import ReactQueryProvider from './react-query-provider';
import { ThemeProvider } from './theme-provider';

export function MainProvider({ children }: { children: React.ReactNode }) {
	return (
		<ReactQueryProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</ReactQueryProvider>
	);
}
