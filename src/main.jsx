import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProviderWrapper } from "./ThemeProvider";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css/global.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import ListadoSensei from "./components/ListadoSensei";
import ListadoAprendiz from "./components/ListadoAprendiz";
import ModificarSensei from "./components/ModificarSensei";
import ModificarAprendiz from "./components/ModificarAprendiz";
import AltaSensei from "./components/AltaSensei";
import AltaAprendiz from "./components/AltaAprendiz";
import GraficaSenseis from "./components/GraficaSenseis";
import PaginaError from "./pages/PaginaError";

/**
 * Configuración de las rutas de la aplicación.
 * Define las rutas principales y sus componentes correspondientes.
 */
let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PaginaError />,
    children: [
      {
        path: "listadosensei",
        element: <ListadoSensei />,
      },
      {
        path: "listadoaprendiz",
        element: <ListadoAprendiz />,
      },
      {
        path: "altasensei",
        element: <AltaSensei />,
      },
      {
        path: "altaaprendiz",
        element: <AltaAprendiz />,
      },
      {
        path: "modificarsensei/:idSensei",
        element: <ModificarSensei />,
      },
      {
        path: "modificarAprendiz/:idAprendiz",
        element: <ModificarAprendiz />,
      },
      {
        path: "graficasenseis",
        element: <GraficaSenseis />,
      },
    ],
  },
]);

/**
 * Renderiza la aplicación en el elemento con id "root".
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <RouterProvider router={router} />
    </ThemeProviderWrapper>
  </StrictMode>
);
