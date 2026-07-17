'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { useSubmitSurvey } from '../model/mutations/use-survey-mutations';
import {
	audienceOptions,
	blockerOptions,
	formatOptions,
	frequencyOptions,
	goalOptions,
	MAX_GOALS,
	MAX_OPEN_FEEDBACK,
	wishlistOptions,
	type SurveyOption,
} from '../model/survey-questions';
import {
	surveyAnswersSchema,
	type SurveyAnswers,
} from '../model/survey-schema';

function OptionRow({
	id,
	label,
	control,
}: {
	id: string;
	label: string;
	control: ReactNode;
}) {
	return (
		<label
			htmlFor={id}
			className="flex cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2.5 hover:bg-muted/40"
		>
			<span className="mt-0.5">{control}</span>
			<span className="text-sm leading-snug">{label}</span>
		</label>
	);
}

function SingleChoice({
	name,
	options,
	value,
	onChange,
}: {
	name: string;
	options: SurveyOption[];
	value: string | undefined;
	onChange: (value: string) => void;
}) {
	return (
		<RadioGroup value={value} onValueChange={onChange} className="gap-2">
			{options.map((opt) => (
				<OptionRow
					key={opt.id}
					id={`${name}-${opt.id}`}
					label={opt.label}
					control={
						<RadioGroupItem value={opt.id} id={`${name}-${opt.id}`} />
					}
				/>
			))}
		</RadioGroup>
	);
}

function MultiChoice({
	name,
	options,
	values,
	onChange,
	max,
}: {
	name: string;
	options: SurveyOption[];
	values: string[];
	onChange: (next: string[]) => void;
	max?: number;
}) {
	const toggle = (id: string, checked: boolean) => {
		if (checked) {
			if (max && values.length >= max) return;
			onChange([...values, id]);
			return;
		}
		onChange(values.filter((v) => v !== id));
	};

	return (
		<div className="grid gap-2">
			{options.map((opt) => {
				const checked = values.includes(opt.id);
				const disabled = Boolean(max && !checked && values.length >= max);
				return (
					<OptionRow
						key={opt.id}
						id={`${name}-${opt.id}`}
						label={opt.label}
						control={
							<Checkbox
								id={`${name}-${opt.id}`}
								checked={checked}
								disabled={disabled}
								onCheckedChange={(state) =>
									toggle(opt.id, state === true)
								}
							/>
						}
					/>
				);
			})}
		</div>
	);
}

type FormState = {
	audience?: string;
	frequency?: string;
	goals: string[];
	blockers: string[];
	format?: string;
	wishlist?: string;
	nps?: number;
	openFeedback: string;
};

const initialState: FormState = {
	goals: [],
	blockers: [],
	openFeedback: '',
};

export function SurveyForm({ onSubmitted }: { onSubmitted?: () => void }) {
	const [form, setForm] = useState<FormState>(initialState);
	const [error, setError] = useState<string | null>(null);
	const submit = useSubmitSurvey();

	const canSubmit = useMemo(() => {
		return (
			Boolean(form.audience) &&
			Boolean(form.frequency) &&
			form.goals.length > 0 &&
			form.blockers.length > 0 &&
			Boolean(form.format) &&
			Boolean(form.wishlist) &&
			typeof form.nps === 'number'
		);
	}, [form]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const payload: SurveyAnswers = {
			audience: form.audience as SurveyAnswers['audience'],
			frequency: form.frequency as SurveyAnswers['frequency'],
			goals: form.goals as SurveyAnswers['goals'],
			blockers: form.blockers as SurveyAnswers['blockers'],
			format: form.format as SurveyAnswers['format'],
			wishlist: form.wishlist as SurveyAnswers['wishlist'],
			nps: form.nps as number,
			openFeedback: form.openFeedback.trim() || undefined,
		};

		const parsed = surveyAnswersSchema.safeParse(payload);
		if (!parsed.success) {
			setError('Проверьте ответы — заполните обязательные поля.');
			return;
		}

		try {
			await submit.mutateAsync(parsed.data);
			onSubmitted?.();
		} catch {
			setError('Не удалось отправить. Попробуйте ещё раз.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			<section className="space-y-3">
				<h2 className="text-base font-semibold">1. Кто вы?</h2>
				<SingleChoice
					name="audience"
					options={audienceOptions}
					value={form.audience}
					onChange={(audience) => setForm((s) => ({ ...s, audience }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">2. Как часто открываете приложение?</h2>
				<SingleChoice
					name="frequency"
					options={frequencyOptions}
					value={form.frequency}
					onChange={(frequency) => setForm((s) => ({ ...s, frequency }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">
					3. Зачем чаще всего заходите?
				</h2>
				<p className="text-sm text-muted-foreground">
					Можно выбрать до {MAX_GOALS} вариантов
				</p>
				<MultiChoice
					name="goals"
					options={goalOptions}
					values={form.goals}
					max={MAX_GOALS}
					onChange={(goals) => setForm((s) => ({ ...s, goals }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">
					4. Что мешает заниматься регулярно?
				</h2>
				<p className="text-sm text-muted-foreground">Можно несколько вариантов</p>
				<MultiChoice
					name="blockers"
					options={blockerOptions}
					values={form.blockers}
					onChange={(blockers) => setForm((s) => ({ ...s, blockers }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">5. Какой формат обучения вам ближе?</h2>
				<SingleChoice
					name="format"
					options={formatOptions}
					value={form.format}
					onChange={(format) => setForm((s) => ({ ...s, format }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">
					6. Что добавить в первую очередь?
				</h2>
				<SingleChoice
					name="wishlist"
					options={wishlistOptions}
					value={form.wishlist}
					onChange={(wishlist) => setForm((s) => ({ ...s, wishlist }))}
				/>
			</section>

			<section className="space-y-3">
				<h2 className="text-base font-semibold">
					7. Насколько вероятно, что порекомендуете друзьям?
				</h2>
				<p className="text-sm text-muted-foreground">0 — точно нет, 10 — обязательно</p>
				<div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
					{Array.from({ length: 11 }, (_, n) => (
						<button
							key={n}
							type="button"
							onClick={() => setForm((s) => ({ ...s, nps: n }))}
							className={cn(
								'h-10 rounded-md border text-sm font-medium transition-colors',
								form.nps === n
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border hover:bg-muted/50'
							)}
						>
							{n}
						</button>
					))}
				</div>
			</section>

			<section className="space-y-3">
				<Label htmlFor="openFeedback" className="text-base font-semibold">
					8. Чего больше всего не хватает?
				</Label>
				<p className="text-sm text-muted-foreground">Необязательно</p>
				<Textarea
					id="openFeedback"
					value={form.openFeedback}
					maxLength={MAX_OPEN_FEEDBACK}
					placeholder="Одной-двумя фразами…"
					onChange={(e) =>
						setForm((s) => ({ ...s, openFeedback: e.target.value }))
					}
				/>
			</section>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<Button
				type="submit"
				className="w-full"
				size="lg"
				disabled={!canSubmit || submit.isPending}
			>
				{submit.isPending ? 'Отправка…' : 'Отправить'}
			</Button>
		</form>
	);
}
