import { defineRoutes, createRouter, useNavigate } from "@solidjs/router";
import Cards from "./routes/Cards";
import Rules from "./routes/Rules";

export const routes = defineRoutes([
  { path: "/cards", component: Cards },
  { path: "/rules", component: Rules },
  {
    path: "*",
    component: () => {
      let nav = useNavigate();
      nav("/cards");
      return <></>;
    },
  },
]);
export const Router = createRouter({ routes });

export const { paths } = Router;
