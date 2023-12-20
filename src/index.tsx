import React from "react";
import ReactDOM from "react-dom/client";

import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.css";

import DevBlog from "./Blogs/DevBlog";
import CloudResumeChallenge from "./Blogs/CloudResumeChallenge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/projects/devblog",
    element: <DevBlog />,
  },
  {
    path: "/projects/cloud-resume-challenge",
    element: <CloudResumeChallenge />,
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
