import { NextResponse } from 'next/server';
import { getAvailableIcons } from '@/shared/lib/icon-validator';

// GET /api/icons
// Возвращает список всех доступных иконок из lucide-react
export async function GET() {
	try {
		const icons = getAvailableIcons();
		return NextResponse.json({ icons });
	} catch (error) {
		console.error('Get icons error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
