import {createFileRoute, Outlet, redirect} from "@tanstack/react-router";
import {authClient} from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (!session.data) {
			throw redirect({
				to: "/login",
			});
		}

		return {session: session.data.session, user: session.data.user};
	},
});

function RouteComponent() {
	return <Outlet />;
}
