import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FilterPages, { regionLoader } from './Pages/FilterPages';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FilterPages />,
    loader: regionLoader,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
