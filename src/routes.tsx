import App from "./App.tsx";
import Home from "./pages/home.tsx";
import Authentication from "./pages/authentication.tsx";
import Register from "./pages/register.tsx";
import MyProducts from "./pages/myproducts.tsx";
import MyAuctions from "./pages/myauctions.tsx";
import MyBids from "./pages/mybids.tsx";
import Root from "../layout/root.tsx";

export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/mes_produits",
        element: <MyProducts />,
      },
      {
        path: "/mes_encheres",
        element: <MyAuctions />,
      },
      {
        path: "/mes_offres",
        element: <MyBids />,
      },
    ],
  },
  {
    path: "/authentification",
    element: <Authentication />,
  },
  {
    path: "/inscription",
    element: <Register />,
  },
];
