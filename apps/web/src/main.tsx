import {RouterProvider} from "@tanstack/react-router";
import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import {createRouter} from "@/router";

// Create a new router instance
const router = createRouter();

// Render the app
const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
