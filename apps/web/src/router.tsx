import {createRouter as createTanStackRouter} from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {createQueryClient} from "@/lib/query-client";
import {oRqc} from "./lib/openapi-react-query";
import {routeTree} from "./routeTree.gen";

export const createRouter = () => {
	const queryClient = createQueryClient();

	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {queryClient, oRqc},
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({children}) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	});
	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
