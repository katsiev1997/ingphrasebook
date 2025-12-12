'use client';

import { useState, useRef } from 'react';
import {
	Trash2,
	Mic,
	Loader2Icon,
	Play,
	Square,
	RotateCcw,
	PlayIcon,
	PauseIcon,
	BarChart3,
} from 'lucide-react';
import { useUploadAudio } from '../model/mutations/use-upload-audio';
import { useDeleteAudio } from '../model/mutations/use-delete-audio';
import { useAuth } from '@/shared/hooks/use-auth';

interface AudioControlsProps {
	phraseId: number;
	audioUrl?: string;
}

// Компонент для записи голоса пользователя
const UserVoiceRecorder = ({
	referenceAudioUrl,
}: {
	referenceAudioUrl?: string;
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
	const [userAudioBlob, setUserAudioBlob] = useState<Blob | null>(null);
	const [isComparing, setIsComparing] = useState(false);
	const [comparisonScore, setComparisonScore] = useState<number | null>(null);
	const [comparisonError, setComparisonError] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			// Проверяем доступность mediaDevices API
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				alert(
					'Доступ к микрофону недоступен. Убедитесь, что:\n' +
						'1. Вы используете HTTPS или localhost\n' +
						'2. Ваш браузер поддерживает Web Audio API\n' +
						'3. Разрешён доступ к микрофону в настройках браузера'
				);
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Определяем поддерживаемый формат
			let mimeType = 'audio/webm;codecs=opus';
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/webm';
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/mp4';
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/wav';
			}

			const mediaRecorder = new MediaRecorder(stream, { mimeType });
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				chunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunksRef.current, { type: mimeType });
				const audioUrl = URL.createObjectURL(audioBlob);
				setUserAudioUrl(audioUrl);
				setUserAudioBlob(audioBlob);
				// Сбрасываем предыдущий результат сравнения
				setComparisonScore(null);
				setComparisonError(null);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error('Recording error:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const playUserRecording = () => {
		if (audioRef.current && userAudioUrl) {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	const stopUserRecording = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		}
	};

	const resetRecording = () => {
		if (userAudioUrl) {
			URL.revokeObjectURL(userAudioUrl);
			setUserAudioUrl(null);
		}
		setUserAudioBlob(null);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
		setComparisonScore(null);
		setComparisonError(null);
	};

	const comparePronunciation = async () => {
		if (!userAudioBlob || !referenceAudioUrl) {
			return;
		}

		setIsComparing(true);
		setComparisonError(null);

		try {
			const formData = new FormData();
			formData.append('referenceAudioUrl', referenceAudioUrl);

			// Создаем File из Blob
			const extension = userAudioBlob.type.split('/')[1]?.split(';')[0] || 'webm';
			const audioFile = new File([userAudioBlob], `user_recording.${extension}`, {
				type: userAudioBlob.type,
			});
			formData.append('userAudio', audioFile);

			const response = await fetch('/api/compare-pronunciation', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				// Используем userMessage если есть, иначе error или details
				const errorMessage =
					errorData.userMessage ||
					errorData.error ||
					errorData.details ||
					'Не удалось сравнить произношение';
				throw new Error(errorMessage);
			}

			const result = await response.json();
			setComparisonScore(result.score);
		} catch (error) {
			console.error('Compare pronunciation error:', error);
			setComparisonError(
				error instanceof Error ? error.message : 'Не удалось сравнить произношение'
			);
		} finally {
			setIsComparing(false);
		}
	};

	if (userAudioUrl) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<button
						onClick={isPlaying ? stopUserRecording : playUserRecording}
						className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
							isPlaying
								? 'bg-orange-600 text-white hover:bg-orange-700'
								: 'bg-green-600 text-white hover:bg-green-700'
						}`}
					>
						{isPlaying ? (
							<>
								<Square className="h-4 w-4 mr-2" />
								Остановить
							</>
						) : (
							<>
								<Play className="h-4 w-4 mr-2" />
								Воспроизвести
							</>
						)}
					</button>

					<button
						onClick={resetRecording}
						className="flex items-center justify-center py-2 px-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
						title="Записать заново"
					>
						<RotateCcw className="h-4 w-4" />
					</button>
				</div>

				{referenceAudioUrl && (
					<button
						onClick={comparePronunciation}
						disabled={isComparing}
						className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isComparing ? (
							<>
								<Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
								Сравнение...
							</>
						) : (
							<>
								<BarChart3 className="h-4 w-4 mr-2" />
								Сравнить произношение
							</>
						)}
					</button>
				)}

				{comparisonScore !== null && (
					<div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-blue-900 dark:text-blue-100">
								Оценка произношения:
							</span>
							<span className="text-lg font-bold text-blue-700 dark:text-blue-300">
								{(comparisonScore * 100).toFixed(1)}%
							</span>
						</div>
						<div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
							<div
								className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
								style={{ width: `${comparisonScore * 100}%` }}
							/>
						</div>
					</div>
				)}

				{comparisonError && (
					<div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
						<p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">
							{comparisonError}
						</p>
					</div>
				)}

				<audio
					ref={audioRef}
					src={userAudioUrl}
					onEnded={() => setIsPlaying(false)}
					onPause={() => setIsPlaying(false)}
					style={{ display: 'none' }}
				/>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={isRecording ? stopRecording : startRecording}
				className={`flex-1 h-9 flex items-center justify-center px-4 rounded-md transition-colors ${
					isRecording
						? 'bg-red-600 text-white hover:bg-red-700'
						: 'bg-primary text-white hover:bg-primary/70'
				}`}
			>
				{isRecording ? (
					<>
						<Square className="h-4 w-4 mr-2" />
						Остановить запись
					</>
				) : (
					<>
						<Mic className="h-4 w-4 mr-2" />
						Записать свой голос
					</>
				)}
			</button>
		</div>
	);
};

export const AudioControls = ({ phraseId, audioUrl }: AudioControlsProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const [isPlayingAudio, setIsPlayingAudio] = useState(false);
	const [isLoadingAudio, setIsLoadingAudio] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const { isModeratorOrAdmin } = useAuth();
	const uploadAudio = useUploadAudio();
	const deleteAudio = useDeleteAudio();

	const startRecording = async () => {
		try {
			// Проверяем доступность mediaDevices API
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				alert(
					'Доступ к микрофону недоступен. Убедитесь, что:\n' +
						'1. Вы используете HTTPS или localhost\n' +
						'2. Ваш браузер поддерживает Web Audio API\n' +
						'3. Разрешён доступ к микрофону в настройках браузера'
				);
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Определяем поддерживаемый формат (приоритет для iOS совместимости)
			let mimeType = 'audio/mp4';
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/webm;codecs=opus';
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/webm';
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = 'audio/wav';
			}

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType,
			});
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				chunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				// Используем тот же MIME тип, что и при записи
				const mimeType = mediaRecorder.mimeType || 'audio/webm';
				const audioBlob = new Blob(chunksRef.current, { type: mimeType });
				const extension = mimeType.split('/')[1]?.split(';')[0] || 'webm';
				const audioFile = new File([audioBlob], `recording.${extension}`, {
					type: mimeType,
				});

				try {
					await uploadAudio.mutateAsync({
						phraseId,
						audioFile,
					});
				} catch (error) {
					console.error('Upload recording error:', error);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error('Recording error:', error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const handleDeleteAudio = async () => {
		if (confirm('Вы уверены, что хотите удалить аудио?')) {
			try {
				await deleteAudio.mutateAsync(phraseId);
			} catch (error) {
				console.error('Delete error:', error);
			}
		}
	};

	const toggleAudioPlayback = () => {
		if (audioRef.current && !isLoadingAudio) {
			if (isPlayingAudio) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlayingAudio(!isPlayingAudio);
		}
	};

	return (
		<div className="space-y-3 my-2">
			{/* Компонент для записи голоса пользователя - доступен всем */}
			<UserVoiceRecorder referenceAudioUrl={audioUrl} />

			{/* Оригинальное аудио и управление для модераторов/админов */}
			{audioUrl ? (
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<button
							onClick={toggleAudioPlayback}
							disabled={isLoadingAudio}
							className="w-full h-9 bg-accent flex items-center justify-center gap-2 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
							title="Правильное произношение"
						>
							{isLoadingAudio ? (
								<Loader2Icon className="h-4 w-4 animate-spin" />
							) : isPlayingAudio ? (
								<PauseIcon className="h-4 w-4" />
							) : (
								<PlayIcon className="h-4 w-4" />
							)}
							<span className="text-sm text-foreground">
								{isLoadingAudio ? 'Загрузка...' : 'Правильное произношение'}
							</span>
						</button>
						{isModeratorOrAdmin && (
							<button
								onClick={handleDeleteAudio}
								className="w-16 h-9 flex items-center justify-center py-2 px-3 rounded-md bg-red-600/80 text-white hover:bg-red-700/80 transition-colors"
								disabled={uploadAudio.isPending || deleteAudio.isPending}
								title="Удалить аудио"
							>
								{deleteAudio.isPending ? (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								) : (
									<Trash2 className="h-4 w-4" />
								)}
							</button>
						)}
					</div>
					<audio
						ref={audioRef}
						src={audioUrl}
						onLoadStart={() => setIsLoadingAudio(true)}
						onCanPlay={() => setIsLoadingAudio(false)}
						onLoadedData={() => setIsLoadingAudio(false)}
						onWaiting={() => setIsLoadingAudio(true)}
						onError={() => setIsLoadingAudio(false)}
						onEnded={() => setIsPlayingAudio(false)}
						onPause={() => setIsPlayingAudio(false)}
						onPlay={() => setIsPlayingAudio(true)}
						style={{ display: 'none' }}
					/>
				</div>
			) : (
				isModeratorOrAdmin && (
					<div className="flex items-center gap-2">
						<button
							onClick={isRecording ? stopRecording : startRecording}
							className={`w-full h-9 flex items-center justify-center py-1.5 px-3 rounded-md transition-colors ${
								isRecording
									? 'bg-red-900 text-white hover:bg-red-700'
									: 'bg-emerald-900 text-white hover:bg-emerald-700'
							}`}
							disabled={uploadAudio.isPending}
						>
							{uploadAudio.isPending ? (
								<Loader2Icon className="h-4 w-4 animate-spin" />
							) : (
								<>
									<Mic className="h-4 w-4 mr-1.5" />
									<span className="text-sm">
										{isRecording ? 'Стоп' : 'Записать правильное произношение'}
									</span>
								</>
							)}
						</button>
					</div>
				)
			)}
		</div>
	);
};
