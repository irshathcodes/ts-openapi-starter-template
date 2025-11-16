import {createAuthenticatedRouter} from "@/lib/router.js";
import {registerRouteHandlers} from "@/lib/utils.js";
import handlers from "./ai.handler.js";
import routes from "./ai.routes.js";

const aiRouter = createAuthenticatedRouter();

registerRouteHandlers(aiRouter, routes, undefined, handlers);

export default aiRouter;
