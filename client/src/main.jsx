import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

// Lazy load components
const Signin = lazy(() => import("./Auth/Signin.jsx"));
const Home = lazy(() => import("./Home/Home.jsx"));
const Data = lazy(() => import("./data/Data.jsx"));
const Customers = lazy(() => import("./customers/Customers.jsx"));
const Driver = lazy(() => import("./driver/Driver.jsx"));
const Vehcile = lazy(() => import("./vehcile/Vehcile.jsx"));
const Payments = lazy(() => import("./payments/Payments.jsx"));
const Expence = lazy(() => import("./expences/Expence.jsx"));
const GenerateInvoice = lazy(() => import("./generatestuff/GenerateInvoice.jsx"));
const GenerateVatInvoice = lazy(() => import("./generatestuff/GenerateVatInvoice.jsx"));
const OverviewInvoice = lazy(() => import("./generatestuff/OverviewInvoice.jsx"));
const DriverReport = lazy(() => import("./generatestuff/DriverReport.jsx"));
const PaymentInvoice = lazy(() => import("./generatestuff/PaymentInvoice.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signin",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Signin />
          </Suspense>
        ),
      },
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path:"/data",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Data/>
          </Suspense>
        )
      },
      {
        path:"/customers",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Customers/>
          </Suspense>
        )
      },
      {
        path:"/driver",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Driver/>
          </Suspense>
        )
      },
      {
        path:"/vehicle",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Vehcile/>
          </Suspense>
        )
      },
       {
        path:"/payment",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Payments/>
          </Suspense>
        )
      },
      {
        path:"/expenses",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Expence/>
          </Suspense>
        )
      },
      {
        path:"/invoicewithoutvat/:customerid",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenerateInvoice/>
          </Suspense>
        )
      },
      {
        path:"/generatevatinvoie/:customerid",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenerateVatInvoice/>
          </Suspense>
        )
      },
      {
        path:"/overviewinvoice/:customerid",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <OverviewInvoice/>
          </Suspense>
        )
      },
      {
        path:"/driverreport/:driverId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DriverReport/>
          </Suspense>
        )
      },
       {
        path:"/customerpayment/:customerid",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PaymentInvoice/>
          </Suspense>
        )
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
