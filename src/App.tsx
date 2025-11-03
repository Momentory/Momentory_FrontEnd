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

import { CommunityPage, CommunityUploadPage, CommunityDetailPage } from "./pages/community-page";
import SplashPage from "./pages/Auth/SplashPage";
import LoginScreen from "./pages/Auth/LoginScreen";
import SigninScreen from "./pages/Auth/SigninScreen";
import CreateAccountPage from "./pages/Auth/CreateAccountPage";
import TermsOfServicePage from "./pages/Auth/TermsOfServicePage";
import CreateProfilePage from "./pages/Auth/CreateProfilePage";
import SelectCharacterPage from './pages/Auth/SelectCharacterPage';
import AccountCreatedPage from "./pages/Auth/AccountCreatedPage";
import KakaoCallback from "./pages/Auth/KakaoCallback";

import SettingsHomePage from "./pages/settings-page/SettingHomepage";
import ProfileEditPage from "./pages/settings-page/ProfileEditpage";
import NotificationSettingsPage from "./pages/settings-page/NotificationSettingsPage";
import PrivacyDataPage from "./pages/settings-page/PrivacyDataPage";
import ServicePage from "./pages/settings-page/ServicePage"
import PrivacyPolicyPage from "./pages/settings-page/PrivacyPolicyPage";
import SecurityPage from "./pages/settings-page/SecurityPage";
import WithdrawPage from "./pages/settings-page/WithdrawPage";
import ChangePasswordPage from "./pages/settings-page/ChangePasswordPage";


import MyMapPage from './pages/map-page/my-map-page';
import PublicMapPage from './pages/map-page/public-map-page';
import SharePage from './pages/share-page';
import RegionPhotosPage from './pages/photo-upload-page/region-photos-page';

import CreateAlbumPage from './pages/album-page/create-album-page';
import AlbumDetailPage from './pages/album-page/album-detail-page';
import EditAlbumPage from './pages/album-page/edit-album-page';
import MyClosetPage from './pages/shop-page/MyClosetPage';
import ShopPage from './pages/shop-page/ShopPage';

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
      { path: 'auth/kakao/callback', element: <KakaoCallback /> },
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
      { path: "community/upload", element: <CommunityUploadPage /> },
      { path: "community/:postId", element: <CommunityDetailPage /> },

      { path: 'settings', element: <SettingsHomePage /> },
      { path: '/settings/profile-edit', element: <ProfileEditPage /> },
      { path: '/settings/notifications', element: <NotificationSettingsPage /> },
      { path: '/settings/privacy-data', element: <PrivacyDataPage /> },
      { path: '/settings/terms-of-service', element: <ServicePage /> },
      { path: '/settings/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/settings/security', element: <SecurityPage /> },
      { path: '/settings/withdraw', element: <WithdrawPage/> },
      { path: '/settings/security/change-password', element: <ChangePasswordPage/> },
      
 
      { path: 'travel', element: <TravelPage /> },

      { path: 'myMap', element: <MyMapPage /> },
      { path: 'publicMap', element: <PublicMapPage /> },
      { path: 'share', element: <SharePage /> },
      { path: 'region-photos/:region', element: <RegionPhotosPage /> },

      { path: 'create-album', element: <CreateAlbumPage /> },
      { path: 'album/:albumId', element: <AlbumDetailPage /> },
      { path: 'edit/:id', element: <EditAlbumPage /> },

      { path: 'myMap', element: <MyMapPage /> },
      { path: 'publicMap', element: <PublicMapPage /> },
      { path: 'share', element: <SharePage /> },
      { path: 'shop', element: <ShopPage/> },
      { path: 'closet', element: <MyClosetPage/> },
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
