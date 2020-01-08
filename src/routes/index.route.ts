import fastify from "fastify";
import { userRoutes } from "./user.route";

type Routes = fastify.RouteOptions[];

const routes: Routes = [...userRoutes];

export default routes;
