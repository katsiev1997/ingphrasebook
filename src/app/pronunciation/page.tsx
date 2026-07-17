import type { Metadata } from "next";
import { BackButton } from "@/shared/components/back-button";
import { PronunciationGuide } from "./pronunciation-guide";

export const metadata: Metadata = {
  title: "Произношение звуков | IngPhrase",
  description: "Руководство по произношению звуков ингушского языка",
};

export default function PronunciationPage() {
  return (
    <div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 px-4 py-4 pb-24 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Произношение
          </h1>
          <BackButton fallbackHref="/study" />
        </div>

        <PronunciationGuide />
      </main>
    </div>
  );
}
