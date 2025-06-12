import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Signin from "./Auth/Signin.jsx";
import Home from "./Home/Home.jsx";
import Data from "./data/Data.jsx";
import Filter from "./filter/Filter.jsx";
import Customers from "./customers/Customers.jsx";
import Driver from "./driver/Driver.jsx";
import Vehcile from "./vehcile/Vehcile.jsx";
import Payments from "./payments/Payments.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path:"/data",
        element:<Data/>
      },
      {
        path:"/filter",
        element:<Filter/>
      },
      {
        path:"/customers",
        element:<Customers/>
      },
      {
        path:"/driver",
        element:<Driver/>
      },
      {
        path:"/vehicle",
        element:<Vehcile/>
      },
       {
        path:"/payment",
        element:<Payments/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
<>
  <RouterProvider router={router}  />
<Toaster position="top-right" reverseOrder={false} />
</>
);
