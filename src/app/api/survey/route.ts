import { db } from '@/db/drizzle';
import { productSurveyResponses } from '@/db/schema';
import { SURVEY_VERSION } from '@/features/survey/model/survey-questions';
import { submitSurveyBodySchema } from '@/features/survey/model/survey-schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const existing = await db
			.select({ id: productSurveyResponses.id })
			.from(productSurveyResponses)
			.where(eq(productSurveyResponses.userId, userId))
			.limit(1);

		return NextResponse.json({ submitted: existing.length > 0 });
	} catch (error) {
		console.error('Error fetching survey status:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const body = await req.json();
		const parsed = submitSurveyBodySchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: 'Invalid survey data', details: parsed.error.flatten() },
				{ status: 400 }
			);
		}

		const existing = await db
			.select({ id: productSurveyResponses.id })
			.from(productSurveyResponses)
			.where(eq(productSurveyResponses.userId, userId))
			.limit(1);

		if (existing.length > 0) {
			return NextResponse.json(
				{ error: 'Survey already submitted' },
				{ status: 409 }
			);
		}

		const { openFeedback: rawFeedback, ...rest } = parsed.data.answers;
		const openFeedback = rawFeedback?.trim();
		const answers = {
			...rest,
			...(openFeedback ? { openFeedback } : {}),
		};

		const [row] = await db
			.insert(productSurveyResponses)
			.values({
				userId,
				surveyVersion: SURVEY_VERSION,
				answers: JSON.stringify(answers),
			})
			.returning();

		return NextResponse.json({ id: row.id, submitted: true }, { status: 201 });
	} catch (error) {
		console.error('Error submitting survey:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
