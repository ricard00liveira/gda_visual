import { useJsApiLoader } from "@react-google-maps/api";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./routes";

const router = createRouter();

export function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCgunavWw1zPPLGG5CWOHFIf4N9NbLqrE0",
  });

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return <RouterProvider router={router} />;
}
