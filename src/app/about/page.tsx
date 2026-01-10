import {
	BookOpen,
	Heart,
	Moon,
	Plus,
	Search,
	Star,
	User,
	Volume2,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'О проекте | IngPhrase',
	description: 'Информация о проекте IngPhrase и инструкция по использованию',
};

export default function AboutPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-6">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					О проекте
				</h1>

				{/* О проекте */}
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
					IngPhrase — это современный разговорник для изучения ингушского языка.
					Приложение помогает изучающим язык быстро находить нужные фразы,
					прослушивать их произношение и систематизировать изучение по категориям.
				</p>

				{/* Основные возможности */}
				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						Основные возможности
					</h2>
					<div className="space-y-4">
						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<BookOpen className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Категории фраз
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Фразы организованы по категориям для удобной навигации. Выберите
									интересующую категорию, чтобы просмотреть все фразы в ней.
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<Search className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Поиск фраз
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Используйте поиск на главной странице для быстрого нахождения нужных
									фраз по ключевым словам.
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<Volume2 className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Аудио произношение
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
									Прослушивайте правильное произношение фраз, чтобы улучшить свои навыки
									говорения и восприятия на слух.
								</p>
								<Link
									href="/pronunciation"
									className="text-sm text-primary hover:text-primary/80 underline"
								>
									Узнать больше о произношении звуков →
								</Link>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<Star className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Избранное
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Сохраняйте важные фразы в избранное для быстрого доступа к ним в любое
									время.
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<Plus className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Создание фраз
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Авторизованные пользователи могут добавлять новые фразы и категории,
									расширяя базу данных приложения.
								</p>
							</div>
						</div>

						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<Moon className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-medium text-black dark:text-white mb-1">
									Темная тема
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Переключайтесь между светлой и темной темой для комфортного
									использования в любое время суток.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Как пользоваться */}
				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						Как пользоваться
					</h2>
					<div className="space-y-3">
						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-black dark:text-white">
								1. Просмотр фраз по категориям
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								На главной странице выберите интересующую категорию. Откроется список
								всех фраз в этой категории с переводом и транскрипцией.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-black dark:text-white">2. Поиск фраз</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Введите ключевое слово в строку поиска на главной странице. Результаты
								появятся в реальном времени.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-black dark:text-white">
								3. Прослушивание произношения
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								На странице с фразами нажмите на кнопку воспроизведения аудио, чтобы
								прослушать произношение фразы.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-black dark:text-white">
								4. Добавление в избранное
							</h3>
							<p className="text-sm text-gray-400">
								Для сохранения фраз в избранное необходимо войти в аккаунт. После
								авторизации вы сможете добавлять фразы в избранное и просматривать их на
								соответствующей странице.
							</p>
						</div>

						<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
							<h3 className="font-medium text-black dark:text-white">
								5. Настройки и авторизация
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Перейдите в раздел &quot;Настройки&quot; для входа в аккаунт,
								переключения темы и управления другими параметрами приложения.
							</p>
						</div>
					</div>
				</section>

				{/* Информация о проекте */}
				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						Техническая информация
					</h2>
					<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Приложение разработано с использованием современных веб-технологий:
							Next.js, React, TypeScript и Tailwind CSS. Данные хранятся в базе данных
							PostgreSQL, а аудио файлы размещены в облачном хранилище.
						</p>
					</div>
				</section>

				{/* Контакты или поддержка */}
				<section className="space-y-3 pt-2">
					<div className="bg-component-light dark:bg-component-dark rounded-lg p-4">
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							Если у вас возникли вопросы или предложения по улучшению приложения,
							пожалуйста, свяжитесь со{' '}
							<a href="https://t.me/mikail_katsiev" className="underline">
								мной
							</a>
							.
						</p>
					</div>
				</section>

				{/* Автор проекта */}
				<section className="space-y-3 pt-2">
					<h2 className="text-xl font-semibold text-black dark:text-white">
						Автор проекта
					</h2>
					<div className="bg-component-light dark:bg-component-dark rounded-lg p-4 space-y-4">
						<div className="flex gap-3 items-start">
							<div className="shrink-0 mt-1">
								<User className="size-5 text-primary" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-black dark:text-white mb-1">
									Микаил Кациев
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
									Разработчик и создатель проекта IngPhrase
								</p>
								<div className="space-y-2">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Telegram:{' '}
										<a
											href="https://t.me/mikail_katsiev"
											className="underline text-primary hover:text-primary/80"
											target="_blank"
											rel="noopener noreferrer"
										>
											@mikail_katsiev
										</a>
									</p>
								</div>
							</div>
						</div>

						<div className="pt-3 border-t border-gray-200 dark:border-gray-700">
							<div className="flex gap-3 items-start">
								<div className="shrink-0 mt-1">
									<Heart className="size-5 text-primary" />
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-black dark:text-white mb-2">
										Поддержка проекта
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
										Если вам нравится проект и вы хотите его поддержать:
									</p>
									<div className="text-sm">
										<p className="text-gray-600 dark:text-gray-400 mb-1">
											<strong className="text-black dark:text-white">Т-банк:</strong>
										</p>
										<p className="text-lg font-mono text-black dark:text-white font-medium">
											5536 9138 3162 9981
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
