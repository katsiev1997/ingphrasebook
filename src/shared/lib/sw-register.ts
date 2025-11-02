// Утилита для регистрации Service Worker
export const registerServiceWorker = async (): Promise<void> => {
	if (typeof window !== "undefined" && "serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js");
			console.log("Service Worker registered successfully:", registration);

			// Обработка обновлений service worker
			registration.addEventListener("updatefound", () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener("statechange", () => {
						if (
							newWorker.state === "installed" &&
							navigator.serviceWorker.controller
						) {
							// Новый service worker установлен, можно показать уведомление пользователю
							console.log("New service worker installed");
						}
					});
				}
			});
		} catch (error) {
			console.error("Service Worker registration failed:", error);
		}
	}
};

// Функция для проверки поддержки service worker
export const isServiceWorkerSupported = (): boolean => {
	return typeof window !== "undefined" && "serviceWorker" in navigator;
};
