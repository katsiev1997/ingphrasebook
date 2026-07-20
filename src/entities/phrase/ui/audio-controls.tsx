"use client";

import { useState, useRef } from "react";
import {
  Trash2,
  Mic,
  Loader2Icon,
  Play,
  Square,
  RotateCcw,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
import { useUploadAudio } from "../model/mutations/use-upload-audio";
import { useDeleteAudio } from "../model/mutations/use-delete-audio";
import { useAuth } from "@/shared/hooks/use-auth";

interface AudioControlsProps {
  phraseId: number;
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
      // Проверяем доступность mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Доступ к микрофону недоступен. Убедитесь, что:\n" +
            "1. Вы используете HTTPS или localhost\n" +
            "2. Ваш браузер поддерживает Web Audio API\n" +
            "3. Разрешён доступ к микрофону в настройках браузера",
        );
        return;
      }

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

  if (userAudioUrl) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? stopUserRecording : playUserRecording}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              isPlaying
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-green-600 text-white hover:bg-green-700"
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

        <audio
          ref={audioRef}
          src={userAudioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          style={{ display: "none" }}
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
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-primary text-white hover:bg-primary/70"
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
          "Доступ к микрофону недоступен. Убедитесь, что:\n" +
            "1. Вы используете HTTPS или localhost\n" +
            "2. Ваш браузер поддерживает Web Audio API\n" +
            "3. Разрешён доступ к микрофону в настройках браузера",
        );
        return;
      }

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
      <UserVoiceRecorder />

      {/* Оригинальное аудио и управление для модераторов/админов */}
      {audioUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudioPlayback}
              disabled={isLoadingAudio}
              className="w-full h-9 bg-background border border-border flex items-center justify-center gap-2 px-3 rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Правильное произношение"
            >
              {isLoadingAudio ? (
                <Loader2Icon className="h-4 w-4 animate-spin text-foreground" />
              ) : isPlayingAudio ? (
                <PauseIcon className="h-4 w-4 text-foreground" />
              ) : (
                <PlayIcon className="h-4 w-4 text-foreground" />
              )}
              <span className="text-sm text-foreground">
                {isLoadingAudio ? "Загрузка..." : "Правильное произношение"}
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
            style={{ display: "none" }}
          />
        </div>
      ) : (
        isModeratorOrAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full h-9 flex items-center justify-center py-1.5 px-3 rounded-md transition-colors ${
                isRecording
                  ? "bg-red-900 text-white hover:bg-red-700"
                  : "bg-emerald-900 text-white hover:bg-emerald-700"
              }`}
              disabled={uploadAudio.isPending}
            >
              {uploadAudio.isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">
                    {isRecording ? "Стоп" : "Записать правильное произношение"}
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
