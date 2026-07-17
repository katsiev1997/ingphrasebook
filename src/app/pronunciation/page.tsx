import { Volume2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BackButton } from '@/shared/components/back-button';

export const metadata: Metadata = {
	title: 'Произношение звуков | IngPhrase',
	description: 'Руководство по произношению звуков ингушского языка',
};

export default function PronunciationPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-6">
				<div className="flex items-center justify-between gap-3">
					<h1 className="text-3xl font-bold text-black dark:text-white">
						Произношение звуков
					</h1>
					<BackButton fallbackHref="/study" />
				</div>

				{/* Введение о транскрипции */}
				<section className="space-y-3">
					<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Предлагаемая в разговорнике транскрипция разработана на графической
							основе русского алфавита. В целях точной передачи различных фонетических
							деталей живого произношения в разговорнике использована фонематическая
							транскрипция смешанного (аналитико-синтетического) типа: краткие гласные
							фонемы обозначаются отдельными буквами и долгие гласные – сочетанием
							гласных с дополнительным значком (например, <strong>а:</strong>,{' '}
							<strong>е:</strong>, <strong>и:</strong> и т.д.).
						</p>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							В случае отсутствия дополнительного знака долготы звука (
							<strong>:</strong>) гласная произносится кратко. Смычная гортанная
							звонкая фонема <strong>I</strong> (приблизительно соответствующая
							арабскому звуку айн) в начале и в конце слова обозначена в транскрипции
							значком <strong>′</strong>, например <strong>′а</strong> (Iа) «зима»,{' '}
							<strong>во′</strong> (воI) «сын» и т.п.
						</p>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Учитывая, что алфавит ингушского языка основан на графической основе
							русского алфавита, для владеющих русским языком не составит особой
							сложности прочитать и произнести правильно слова на ингушском языке.
							Вместе с тем мы полагаем, что некоторые сведения о характере определенных
							звуков ингушского языка, приводимые нами ниже, не будут лишними для
							пользователя данного разговорника.
						</p>
					</div>
				</section>

				{/* Произношение гласных звуков */}
				<section className="space-y-3">
					<div className="flex gap-3 items-start">
						<div className="shrink-0 mt-1">
							<Volume2 className="size-5 text-primary" />
						</div>
						<h2 className="text-xl font-semibold text-black dark:text-white">
							Произношение гласных звуков
						</h2>
					</div>

					<div className="space-y-4">
						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								Ингушские гласные произносятся вообще кратко и отрывисто. Исключение
								представляют <strong>«а:»</strong> и <strong>«аь»</strong>.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">А: (а:)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Первая произносится несколько протяжнее, чем в русском языке,
								представляя на слух как бы соединение двух последовательных{' '}
								<strong>а</strong>: <strong>да:</strong> – «отец»,{' '}
								<strong>ма:рша воагIалва</strong> – «с приездом» и т.п.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">Аь (аь)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								В середине слов практически не отличается от русского <strong>я</strong>
								: <strong>маьчи</strong> «чувяки» / «обувь»; <strong>къаьнк</strong>{' '}
								«мальчик». В начале слова <strong>аь</strong> произносится как{' '}
								<strong>эа</strong>: <strong>аьннад</strong> – «сказал»,{' '}
								<strong>аьха</strong> – «вспаханный».
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">А (а)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Беглый звук, активно употребляемый в ингушском языке. По произношению
								это звук является средним между <strong>а</strong>, <strong>э</strong> и{' '}
								<strong>ы</strong>: <strong>барт</strong> – «согласие»,{' '}
								<strong>бе:зам</strong> – «любовь» и др. В русском языке ближе всего к
								краткому <strong>а</strong> подходит <strong>о</strong> неударное,
								например, произношение <strong>о</strong> в словах «говорить», «Федор» и
								др.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">Е (е)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Соответствует русскому <strong>«э»</strong>: <strong>эзар</strong> –
								«тысяча», <strong>дей</strong> – «легкий» и др.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">И (и)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								В ряде случаев произносится приблизительно так, как русское{' '}
								<strong>«ы»</strong>, но очень коротко и отрывисто: <strong>из</strong>{' '}
								– «он», <strong>ишкол</strong> – «школа» и др.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								Остальные гласные
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Остальные гласные: <strong>и</strong>, <strong>о</strong>,{' '}
								<strong>у</strong> произносятся так же, как и соответствующие звуки
								русского языка: <strong>итт</strong> – «десять», <strong>ги</strong> –
								«семя», <strong>дом</strong> – «пыль», <strong>уст</strong> – «бык»,{' '}
								<strong>гу</strong> – «вижу» и др.
							</p>
						</div>
					</div>
				</section>

				{/* Произношение согласных звуков */}
				<section className="space-y-3">
					<div className="flex gap-3 items-start">
						<div className="shrink-0 mt-1">
							<Volume2 className="size-5 text-primary" />
						</div>
						<h2 className="text-xl font-semibold text-black dark:text-white">
							Произношение согласных звуков
						</h2>
					</div>

					<div className="space-y-4">
						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								О произношении согласных звуков ингушского языка следует помнить
								следующее:
							</p>
							<ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
								<li className="leading-relaxed">
									Сочетания <strong>лг</strong>, <strong>рг</strong>, <strong>шк</strong>
									, <strong>кк</strong> и буквы <strong>г</strong> и <strong>к</strong>{' '}
									на конце слов произносятся всегда мягко, как бы <strong>льгь</strong>,{' '}
									<strong>рьгь</strong>, <strong>шькь</strong>, <strong>ськь</strong>,{' '}
									<strong>ккь</strong>: <strong>кулг</strong> (кульгь) – «рука»,{' '}
									<strong>лерг</strong> (лерьгь) – «ухо», <strong>пишк</strong> (пишькь)
									– «печка», <strong>циськь</strong> (циськь) – «кошка»,{' '}
									<strong>икк</strong> (иккь) – «сапог», <strong>гийг</strong> (гийгь) –
									«живот» / «желудок». Исключение составляет слово <strong>барг</strong>{' '}
									– «копыто», в котором исходные <strong>рг</strong> произносятся всегда
									твердо.
								</li>
								<li className="leading-relaxed">
									Буква <strong>з</strong> имеет в ингушском языке двоякое произношение:
									во-первых, как чистое русское <strong>з</strong>: <strong>боз</strong>{' '}
									– «бязь» и, во-вторых, как <strong>дз</strong>, произносимое слитно:{' '}
									<strong>морз</strong> (мордз) – «сыворотка», <strong>герз</strong>{' '}
									(гердз) – «оружие». Следует уяснить, что в начале слова{' '}
									<strong>з</strong> практически всегда произносится как{' '}
									<strong>дз</strong>. Такой же характер имеет и произношение буквы{' '}
									<strong>ж</strong>, которая выговаривается и как <strong>ж</strong>, и
									как <strong>дж</strong>: <strong>мож</strong> (модж) – «борода»,{' '}
									<strong>гIаж</strong> (гIаж) – «гусь», <strong>жа</strong> (джа) –
									«овцы» и др.
								</li>
							</ol>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								Особо сложными для произношения в ингушском языке являются следующие
								фонемы, в отношении каждой из которых нами дается небольшая справка.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ГI (гI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Щелевой звонкий согласный звук, в образовании которого, кроме основного
								шума, участвует и музыкальный тон. Эту фонему еще называют фарингальной.
								Фонема <strong>гI</strong> более глубокозаднего образования, чем
								заднеязычные <strong>г</strong>, <strong>к</strong>, <strong>х</strong>.
								Она образуется почти в гортани и произносится с относительно слабым
								придыханием. Подобной фонемы нет в русском языке.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ХЬ (хь)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Гортанная щелевая глухая фонема, произносится с придыханием. По своей
								природе всегда является твердой. Не озвончается перед звонкими
								согласными и гласными.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ХI (хI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Щелевая глухая (соответствует немецкому <strong>h</strong>). Эту фонему
								называют звуком свободного выдоха, соответственно, является
								придыхательной.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ПI (пI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Смычно-гортанная глухая фонема, в образовании которой музыкальный тон не
								участвует. Фонема <strong>пI</strong> произносится с более сильным
								напряжением артикулирующих органов и с более сильной струей выдыхаемого
								воздуха, чем фонема <strong>п</strong>.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ТI (тI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Мгновенная надгортанная зубная глухая фонема. Произносится с более
								сильным напряжением артикулирующих органов и с более сильной струей
								выдыхаемого воздуха, чем <strong>т</strong>. Данный звук произносится
								твердо, то есть почти не смягчается перед передними гласными, поэтому не
								имеет мягкого варианта.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">КI (кI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Мгновенная заднетвердонебная смычно-гортанная глухая фонема,
								произносится с более сильным напряжением артикулирующих органов и с
								более сильной струей выдыхаемого воздуха, чем <strong>к</strong>. Данный
								звук абсолютно глухой, в его образовании голос (музыкальный тон) не
								участвует. Фонема <strong>кI</strong> относится к числу сильно
								придыхательных звуков ингушского языка, особенно сильно проявляется
								придыхание в позиции <strong>кI</strong> в начале и в конце слова.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ДЗ (дз)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Зубная твердая звонкая аффриката, произносится с придыханием и, как
								правило, твердо. Перед глухими согласными не оглушается.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">Дж (дж)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Переднетвердонебная звонкая аффриката, произносится, как правило,
								твердо, с придыханием и не оглушается перед согласными.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">Кх (кх)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Заднемягконебная несмычно-гортанная глухая аффриката, то есть
								фарингальная фонема. Она относится к числу звуков, произносящихся с
								придыханием. В ингушском языке встречается долгая (графически удвоенная){' '}
								<strong>кх</strong>: <strong>воаккха саг</strong> – «старец».
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ЦI (цI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Зубная смычно-гортанная глухая аффриката, представляет собой фонему{' '}
								<strong>ц</strong> с дополнительным (смычно-гортанным) признаком,
								создаваемым полной преградой в полости гортани. Произносится с
								придыханием.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">ЧI (чI)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Переднетвердонебная смычно-гортанная глухая фонема, произносится с
								придыханием. Всегда звонкая.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">Къ (къ)</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Заднемягконебная смычно-гортанная глухая аффриката, всегда произносится
								с придыханием. Практически в любых позициях звучит твердо и не
								озвончается перед звонкими согласными.
							</p>
						</div>
					</div>
				</section>

				{/* Классы существительного */}
				<section className="space-y-3">
					<div className="flex gap-3 items-start">
						<div className="shrink-0 mt-1">
							<Volume2 className="size-5 text-primary" />
						</div>
						<h2 className="text-xl font-semibold text-black dark:text-white">
							Классы существительного
						</h2>
					</div>

					<div className="space-y-4">
						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								Понимание этого вопроса является одним из самых сложных для изучающих
								ингушский язык, поскольку в нем представлены 6 классов имени
								существительного, определяющегося формами настоящего времени глагола
								быть:
							</p>
							<div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<p>
									<strong className="text-black dark:text-white">Да ва</strong> – «Отец
									есть» (классный показатель <strong>в</strong>)
								</p>
								<p>
									<strong className="text-black dark:text-white">Нана йа</strong> – «Мать
									есть» (<strong>й</strong>)
								</p>
								<p>
									<strong className="text-black dark:text-white">Маьнги ба</strong> –
									«Кровать есть» (<strong>б</strong>)
								</p>
								<p>
									<strong className="text-black dark:text-white">Говр йа</strong> –
									«Лошадь есть» (<strong>й</strong>)
								</p>
								<p>
									<strong className="text-black dark:text-white">Iаж ба</strong> –
									«Яблоко есть» (<strong>б</strong>)
								</p>
								<p>
									<strong className="text-black dark:text-white">Бер да</strong> – «Дитя
									есть» (<strong>д</strong>)
								</p>
							</div>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								Таким образом, мы имеем четыре подвижные буквы (<strong>в</strong>,{' '}
								<strong>й</strong>, <strong>б</strong>, <strong>д</strong>), которые и
								называются классным показателем.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								Учитывая, что не имеется возможности однозначно распределить все слова
								ингушского языка по классам в виде устоявшегося правила, хотим дать
								некоторые рекомендации, которые облегчат в определенной степени создание
								речевых конструкций в соответствии с нормами ингушского языка. В
								частности, нельзя путать класс существительного с тем, что в русском
								называется родом, так как признак пола не является для классов
								определяющим.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								в-б – класс мужчин
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								<strong>къонах ва</strong> – «мужчина есть»,{' '}
								<strong>къонахий ба</strong> – «мужчины есть»
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								й-б – класс женщин
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								<strong>кхалсаг йа</strong> – «женщина есть»,{' '}
								<strong>кхалнах ба</strong> – «женщины есть»
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								й-й – класс вещей
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Самый многочисленный в ингушском языке и постоянно пополняющийся,
								поскольку, как правило, подавляющая часть заимствованных слов относят к
								этому классу: <strong>шарф йа</strong> – «шарф есть»,{' '}
								<strong>шарфаш йа</strong> – «шарфы есть»
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								б-б – класс вещей
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Также класс вещей, является малочисленным
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">
								б-д – класс вещей и животных
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								<strong>устагI ба</strong> – «баран есть», <strong>устагIий да</strong>{' '}
								– «бараны есть»
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-3">
							<h3 className="font-medium text-black dark:text-white">д-д – класс</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								Класс, к которому относится основной исконный (общий для нахских языков)
								слой лексики: <strong>хий да</strong> – «вода есть»,{' '}
								<strong>хиш да</strong> – «воды есть», <strong>Iаса да</strong> –
								«теленок есть», <strong>Iаьсий да</strong> – «телята есть»
							</p>
						</div>
					</div>
				</section>

				{/* Ссылка на страницу "О проекте" */}
				<section className="pt-2">
					<div className="bg-component-light dark:bg-component-dark rounded-lg p-4">
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							<Link
								href="/about"
								className="underline text-primary hover:text-primary/80"
							>
								Вернуться к информации о проекте
							</Link>
						</p>
					</div>
				</section>
			</main>
		</div>
	);
}
