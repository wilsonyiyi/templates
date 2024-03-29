import type { RouteObject } from "react-router-dom";
import ImageGeneration from "./pages/image-generation";
import ErrorPage from "./components/error-page";
type MyRouteObject = RouteObject & { title: string };

const routes: MyRouteObject[] = [
  {
    path: "/",
    element: <ImageGeneration />,
    title: "Image Generation",
    errorElement: <ErrorPage />,
  },
];

export default routes;
