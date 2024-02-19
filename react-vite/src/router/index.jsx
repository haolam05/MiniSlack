import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import WorkspaceForm from '../components/WorkspaceForm';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/workspace",
        element: <WorkspaceForm />
      }
    ],
  },
]);
