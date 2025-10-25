import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  type RouteObject,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import CharacterPage from './pages/character-page';
import HomePage from './pages/home-page';
import TravelPage from './pages/travel-page';
import MyAlbumPage from './pages/album-page';
import UploadPage from './pages/photo-upload-page/UploadPage';
import { CommunityPage, CommunityUploadPage } from './pages/community-page';
import SplashPage from './pages/Auth/SplashPage';
import LoginScreen from './pages/Auth/LoginScreen';
import SigninScreen from './pages/Auth/SigninScreen';
import CreateAccountPage from './pages/Auth/CreateAccountPage';
import TermsOfServicePage from './pages/Auth/TermsOfServicePage';
import CreateProfilePage from './pages/Auth/CreateProfilePage';
import SelectCharacterPage from './pages/Auth/SelectCharacterPage';
import AccountCreatedPage from './pages/Auth/AccountCreatedPage';

import CreateAlbumPage from './pages/album-page/create-album-page';
import AlbumDetailPage from './pages/album-page/album-detail-page';
import EditAlbumPage from './pages/album-page/edit-album-page';

import MyMapPage from './pages/map-page/MyMapPage';
import PublicMapPage from './pages/map-page/PublicMapPage';

const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <SplashPage /> },
      { path: 'login', element: <LoginScreen /> },
      { path: 'signinscreen', element: <SigninScreen /> },
      { path: 'signup', element: <CreateAccountPage /> },
      { path: 'terms', element: <TermsOfServicePage /> },
      { path: 'create-profile', element: <CreateProfilePage /> },
      { path: 'select', element: <SelectCharacterPage /> },
      { path: 'account', element: <AccountCreatedPage /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'character', element: <CharacterPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'album', element: <MyAlbumPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'community/upload', element: <CommunityUploadPage /> },
      { path: 'travel', element: <TravelPage /> },

      { path: 'create-album', element: <CreateAlbumPage /> },
      { path: 'album/:albumId', element: <AlbumDetailPage /> },
      { path: 'edit/:id', element: <EditAlbumPage /> },

      { path: 'myMap', element: <MyMapPage /> },
      { path: 'publicMap', element: <PublicMapPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
