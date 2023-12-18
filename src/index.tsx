import React from "react";
import ReactDOM from "react-dom/client";

import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Projects from "./Projects";
import "@fortawesome/fontawesome-free/css/all.css";
import ProjectDetails from "./ProjectDetails";
import DevBlog from "./Blogs/DevBlog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/:projectId",
    element: <ProjectDetails />,
  },
  {
    path: "/projects/devblog",
    element: <DevBlog></DevBlog>,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
