import React from 'react';
import ReactDOM from 'react-dom/client';

import HomePage from './HomePage';
import ErrorPage from './ErrorPage';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Projects from './Projects';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <ErrorPage/>,
  },
  {
        path: "/projects",
        element: <Projects/>
  },
]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    
    <RouterProvider router={router}/>
    
    
  </React.StrictMode>
);

