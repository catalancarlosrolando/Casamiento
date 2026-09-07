import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import NotFound from "../pages/404.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import Home from "../pages/Home.tsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />
      },
      {
        path: "*",
        element: <NotFound />
      }

    ]
  }
]);