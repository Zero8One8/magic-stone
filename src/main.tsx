import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const bootFallback = document.getElementById("boot-fallback");
const bootMessage = document.getElementById("boot-message");
const rootElement = document.getElementById("root");
let readyTimeoutId: number | undefined;
let slowBootTimeoutId: number | undefined;

const showBootError = () => {
	if (bootMessage) {
		bootMessage.textContent =
			"Не удалось загрузить интерфейс. Нажмите кнопку ниже, чтобы перезагрузить страницу.";
	}

	if (bootFallback) {
		bootFallback.style.display = "grid";
	}
};

const hideBootFallback = () => {
	if (readyTimeoutId !== undefined) {
		window.clearTimeout(readyTimeoutId);
		readyTimeoutId = undefined;
	}

	if (slowBootTimeoutId !== undefined) {
		window.clearTimeout(slowBootTimeoutId);
		slowBootTimeoutId = undefined;
	}

	if (bootFallback) {
		bootFallback.style.display = "none";
	}
};

try {
	if (!rootElement) {
		throw new Error("Root element not found");
	}

	window.addEventListener("app:ready", hideBootFallback);
	window.addEventListener("error", showBootError);
	window.addEventListener("unhandledrejection", showBootError);

	// Keep fallback hidden during normal fast startup. Show it only if boot becomes unusually slow.
	slowBootTimeoutId = window.setTimeout(() => {
		if (bootFallback) {
			bootFallback.style.display = "grid";
		}
	}, 2500);

	readyTimeoutId = window.setTimeout(showBootError, 8000);

	createRoot(rootElement).render(<App />);
} catch (error) {
	console.error("[Boot] Application startup failed:", error);
	showBootError();
}
