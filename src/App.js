import React from "react";
import { useRoutes } from "react-router-dom";

import Home from "./pages/Home";
import Assets from "./pages/Assets";
import HomeContent from "./pages/HomeContent";
import Employee from "./pages/Employee";
import Login from "./pages/Login";
import Place from "./pages/Place";
import Assign from "./pages/Assign";
import { RequireAuth } from "./hook/auth";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <HomeContent />,
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <Home />
            </RequireAuth>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/assets",
          element: (
            <RequireAuth>
              <Assets />
            </RequireAuth>
          ),
        },
        {
          path: "/assign",
          element: (
            <RequireAuth>
              <Assign />
            </RequireAuth>
          ),
        },
        {
          path: "/place",
          element: (
            <RequireAuth>
              <Place />
            </RequireAuth>
          ),
        },
        {
          path: "/employee",
          element: (
            <RequireAuth>
              <Employee />
            </RequireAuth>
          ),
        },
      ],
    },
  ]);

  return routes;
}

export default App;
