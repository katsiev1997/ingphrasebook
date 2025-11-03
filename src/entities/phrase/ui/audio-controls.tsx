"use client";

import { useState, useRef } from "react";
import {
	Trash2,
	Mic,
	Loader2Icon,
	Play,
	Square,
	RotateCcw,
} from "lucide-react";
import { useUploadAudio } from "../model/mutations/use-upload-audio";
import { useDeleteAudio } from "../model/mutations/use-delete-audio";
import { useAuth } from "@/shared/hooks/use-auth";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface AudioControlsProps {
	phraseId: string;
	audioUrl?: string;
}

// Компонент для записи голоса пользователя
const UserVoiceRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Определяем поддерживаемый формат
			let mimeType = "audio/webm;codecs=opus";
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/webm";
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/mp4";
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/wav";
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
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Recording error:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
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
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
		setIsPlaying(false);
	};

	return (
		<div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
			<h3 className="text-sm font-medium text-gray-700 mb-2">
				Записать свой голос для сравнения
			</h3>

			{!userAudioUrl ?
				<div className="flex items-center gap-2">
					<button
						onClick={isRecording ? stopRecording : startRecording}
						className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
							isRecording ?
								"bg-red-600 text-white hover:bg-red-700"
							:	"bg-blue-600 text-white hover:bg-blue-700"
						}`}
					>
						{isRecording ?
							<>
								<Square className="h-4 w-4 mr-2" />
								Остановить запись
							</>
						:	<>
								<Mic className="h-4 w-4 mr-2" />
								Начать запись
							</>
						}
					</button>
				</div>
			:	<div className="space-y-3">
					<div className="flex items-center gap-2">
						<button
							onClick={isPlaying ? stopUserRecording : playUserRecording}
							className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
								isPlaying ?
									"bg-orange-600 text-white hover:bg-orange-700"
								:	"bg-green-600 text-white hover:bg-green-700"
							}`}
						>
							{isPlaying ?
								<>
									<Square className="h-4 w-4 mr-2" />
									Остановить
								</>
							:	<>
									<Play className="h-4 w-4 mr-2" />
									Воспроизвести
								</>
							}
						</button>

						<button
							onClick={resetRecording}
							className="flex items-center justify-center py-2 px-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
							title="Записать заново"
						>
							<RotateCcw className="h-4 w-4" />
						</button>
					</div>

					{userAudioUrl && (
						<audio
							ref={audioRef}
							src={userAudioUrl}
							onEnded={() => setIsPlaying(false)}
							onPause={() => setIsPlaying(false)}
							style={{ display: "none" }}
						/>
					)}
				</div>
			}
		</div>
	);
};

export const AudioControls = ({ phraseId, audioUrl }: AudioControlsProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const { user } = useAuth();
	const uploadAudio = useUploadAudio();
	const deleteAudio = useDeleteAudio();

	// Проверяем права доступа
	const canManageAudio = user?.role === "MODERATOR" || user?.role === "ADMIN";

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Определяем поддерживаемый формат (приоритет для iOS совместимости)
			let mimeType = "audio/mp4";
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/webm;codecs=opus";
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/webm";
			}
			if (!MediaRecorder.isTypeSupported(mimeType)) {
				mimeType = "audio/wav";
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
				const mimeType = mediaRecorder.mimeType || "audio/webm";
				const audioBlob = new Blob(chunksRef.current, { type: mimeType });
				const extension = mimeType.split("/")[1]?.split(";")[0] || "webm";
				const audioFile = new File([audioBlob], `recording.${extension}`, {
					type: mimeType,
				});

				try {
					await uploadAudio.mutateAsync({
						phraseId,
						audioFile,
					});
				} catch (error) {
					console.error("Upload recording error:", error);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Recording error:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const handleDeleteAudio = async () => {
		if (confirm("Вы уверены, что хотите удалить аудио?")) {
			try {
				await deleteAudio.mutateAsync(phraseId);
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	return (
		<div className="space-y-4 my-2">
			{/* Компонент для записи голоса пользователя - доступен всем */}
			<UserVoiceRecorder />

			{/* Оригинальное аудио и управление для модераторов/админов */}
			{audioUrl ?
				<div className="space-y-2">
					<div className="p-4 bg-blue-50 rounded-lg border">
						<h3 className="text-sm font-medium text-blue-700 mb-2">
							Правильное произношение
						</h3>
						<AudioPlayer
							src={audioUrl}
							showJumpControls={false}
							showFilledProgress={true}
							showFilledVolume={true}
							layout="horizontal"
							preload="metadata"
							style={{
								width: "100%",
								borderRadius: "0.5rem",
							}}
							className="custom-audio-player"
						/>
					</div>

					{canManageAudio && (
						<div className="flex items-center gap-2 w-full">
							<button
								onClick={handleDeleteAudio}
								className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
								disabled={uploadAudio.isPending || deleteAudio.isPending}
							>
								{deleteAudio.isPending ?
									<Loader2Icon className="animate-spin" />
								:	<>
										<Trash2 className="h-5 w-5 mr-2" />
										Удалить аудио
									</>
								}
							</button>
						</div>
					)}
				</div>
			:	canManageAudio && (
					<div className="p-4 bg-yellow-50 rounded-lg border">
						<h3 className="text-sm font-medium text-yellow-700 mb-2">
							Загрузка правильного произношения (только для модераторов)
						</h3>
						<div className="flex items-center gap-2 w-full">
							<button
								onClick={isRecording ? stopRecording : startRecording}
								className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
									isRecording ?
										"bg-red-600 text-white hover:bg-red-700"
									:	"bg-emerald-600 text-white hover:bg-emerald-700"
								}`}
								disabled={uploadAudio.isPending}
							>
								{uploadAudio.isPending ?
									<Loader2Icon className="animate-spin" />
								:	<>
										<Mic className="h-5 w-5 mr-2" />
										{isRecording ? "Стоп" : "Записать"}
									</>
								}
							</button>
						</div>
					</div>
				)
			}
		</div>
	);
};
