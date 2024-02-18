import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import { CreateWorkspace } from '../components/CreateWorkspace/CreateWorkspace';
import { CreateChannel } from '../components/CreateChannel/CreateChannel';
import { CreateMessage } from '../components/CreateMessage/CreateMessage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path:"workspace/new",
        element: <CreateWorkspace />
      },
      {
        path:"channel/new",
        element: <CreateChannel />
      },
      {
        path:"message/new",
        element: <CreateMessage />
      }
    ],
  },
]);