import { CHAT_ROUTE, PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants/route';
import { AuthenticationContext } from '@/core/authentication/Context';
import { Chat } from '@/pages/Chat';
import Login from '@/pages/Login';
import { useContext } from 'react';
import {
  Navigate,
  Route,
  RouteObject,
  Routes,
  useRoutes,
} from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Chat/components/Welcome';
import ChatRoom from './pages/Chat/components/ChatRoom';

const publicRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: PUBLIC_ROUTE.LOGIN,
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={PUBLIC_ROUTE.LOGIN} replace />,
  },
];

const privateRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: PRIVATE_ROUTE.CHAT,
        element: <Chat />,
        children: [
          {
            index: true,
            path: '',
            element: <Welcome />,
          },
          {
            path: CHAT_ROUTE.ROOM,
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={PRIVATE_ROUTE.CHAT} replace />,
      },
    ],
  },
];

const Router = () => {
  const { isLoggedIn } = useContext(AuthenticationContext);

  const PrivateRoutes = () => useRoutes(privateRoutes);
  const PublicRoutes = () => useRoutes(publicRoutes);

  return (
    <Routes>
      {isLoggedIn ? (
        <Route path="*" element={<PrivateRoutes />} />
      ) : (
        <Route path="*" element={<PublicRoutes />} />
      )}
    </Routes>
  );
};

export default Router;
