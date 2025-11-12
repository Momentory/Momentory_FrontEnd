import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  type RouteObject,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';

// 기본 페이지
import CharacterPage from './pages/character-page';
import HomePage from './pages/home-page';
import TravelPage from './pages/travel-page';
import MyAlbumPage from './pages/album-page';

import CommunityDetailPage from './pages/community-page/CommunityDetailPage';
import CommunityPage from './pages/community-page/CommunityPage';
import CommunityMyPage from './pages/community-page/CommunityMyPage';
import CommunityWritePage from './pages/community-page/CommunityWritePage';
import CommunitySearchPage from './pages/community-page/CommunitySearchPage';
import UserProfilePage from './pages/community-page/UserProfilePage';

import SplashPage from './pages/Auth/SplashPage';
import LoginScreen from './pages/Auth/LoginScreen';
import SigninScreen from './pages/Auth/SigninScreen';
import CreateAccountPage from './pages/Auth/CreateAccountPage';
import TermsOfServicePage from './pages/Auth/TermsOfServicePage';
import CreateProfilePage from './pages/Auth/CreateProfilePage';
import SelectCharacterPage from './pages/Auth/SelectCharacterPage';
import AccountCreatedPage from './pages/Auth/AccountCreatedPage';
import KakaoCallback from './pages/Auth/KakaoCallback';

import SettingsHomePage from './pages/settings-page/SettingHomepage';
import ProfileEditPage from './pages/settings-page/ProfileEditpage';
import NotificationSettingsPage from './pages/settings-page/NotificationSettingsPage';
import PrivacyDataPage from './pages/settings-page/PrivacyDataPage';
import ServicePage from './pages/settings-page/ServicePage';
import PrivacyPolicyPage from './pages/settings-page/PrivacyPolicyPage';
import SecurityPage from './pages/settings-page/SecurityPage';
import WithdrawPage from './pages/settings-page/WithdrawPage';
import ChangePasswordPage from './pages/settings-page/ChangePasswordPage';

import MyMapPage from './pages/map-page/my-map-page';
import PublicMapPage from './pages/map-page/public-map-page';
import RoulettePage from './pages/roulette-page/index';
import SharePage from './pages/share-page';

import PhotoUploadPage from './pages/photo-upload-page';
import PhotoUploadProgressPage from './pages/photo-upload-page/upload-progress';
import PhotoUploadSuccessPage from './pages/photo-upload-page/upload-success';
import PhotoUploadCompletePage from './pages/photo-upload-page/upload-complete';
import StampAcquisitionPage from './pages/photo-upload-page/stamp-acquisition';
import QuestionPage from './pages/photo-upload-page/question';
import AuthenticationPage from './pages/photo-upload-page/authentication';
import AuthErrorResolutionPage from './pages/photo-upload-page/auth-error-resolution';
import RecommendedPlacesPage from './pages/photo-upload-page/recommended-places';

import PhotoEditPage from './pages/photo-edit-page';

import RegionPhotosPage from './pages/photo-upload-page/all-my-photos';
import AllMyPhotosViewerPage from './pages/photo-upload-page/all-my-photos-viewer';

import CreateAlbumPage from './pages/album-page/create-album-page';
import AlbumDetailPage from './pages/album-page/album-detail-page';
import EditAlbumPage from './pages/album-page/edit-album-page';
import AlbumReadPage from './pages/album-page/album-read-page';
import SharedAlbumPage from './pages/album-page/shared-album-page';
import MyClosetPage from './pages/shop-page/MyClosetPage';
import ShopPage from './pages/shop-page/ShopPage';
import GalleryPage from './pages/album-page/gallery-page';
import NewItemPage from './pages/shop-page/NewItemPage';
import EventPage from './pages/shop-page/EventPage';

const queryClient = new QueryClient();

/* ------------------ 공개 라우트 ------------------ */
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
      { path: 'share/:shareUuid', element: <SharedAlbumPage /> },
    ],
  },
];

/* ------------------ 보호 라우트 ------------------ */
const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'character', element: <CharacterPage /> },
      { path: 'album', element: <MyAlbumPage /> },

      { path: 'community', element: <CommunityPage /> },
      { path: 'community/detail/:id', element: <CommunityDetailPage /> },
      { path: 'community/write', element: <CommunityWritePage /> },
      { path: 'community/mypage', element: <CommunityMyPage /> },
      { path: 'community/search', element: <CommunitySearchPage /> },
      { path: 'community/user/:userId', element: <UserProfilePage /> },

      { path: 'settings', element: <SettingsHomePage /> },
      { path: 'settings/profile-edit', element: <ProfileEditPage /> },
      { path: 'settings/notifications', element: <NotificationSettingsPage /> },
      { path: 'settings/privacy-data', element: <PrivacyDataPage /> },
      { path: 'settings/terms-of-service', element: <ServicePage /> },
      { path: 'settings/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'settings/security', element: <SecurityPage /> },
      { path: 'settings/withdraw', element: <WithdrawPage /> },
      {
        path: 'settings/security/change-password',
        element: <ChangePasswordPage />,
      },

      { path: 'travel', element: <TravelPage /> },
      { path: 'myMap', element: <MyMapPage /> },
      { path: 'publicMap', element: <PublicMapPage /> },
      { path: 'roulette', element: <RoulettePage /> },
      { path: 'share', element: <SharePage /> },
      { path: 'all-my-photos', element: <RegionPhotosPage /> },
      { path: 'all-my-photos/viewer', element: <AllMyPhotosViewerPage /> },

      { path: 'upload', element: <PhotoUploadPage /> },
      { path: 'photo-edit', element: <PhotoEditPage /> },
      { path: 'photo-upload-progress', element: <PhotoUploadProgressPage /> },
      { path: 'photo-upload-success', element: <PhotoUploadSuccessPage /> },
      { path: 'photo-upload-complete', element: <PhotoUploadCompletePage /> },
      { path: 'stamp-acquisition', element: <StampAcquisitionPage /> },
      { path: 'question', element: <QuestionPage /> },
      { path: 'authentication', element: <AuthenticationPage /> },
      { path: 'auth-error-resolution', element: <AuthErrorResolutionPage /> },
      { path: 'recommended-places', element: <RecommendedPlacesPage /> },

      { path: 'create-album', element: <CreateAlbumPage /> },
      { path: 'album/:albumId', element: <AlbumDetailPage /> },
      { path: 'album/:albumId/read', element: <AlbumReadPage /> },
      { path: 'edit/:id', element: <EditAlbumPage /> },

      { path: 'shop', element: <ShopPage /> },
      { path: 'closet', element: <MyClosetPage /> },
      { path: 'shop/new', element: <NewItemPage /> },
      { path: 'shop/event', element: <EventPage /> },
      { path: 'gallery', element: <GalleryPage /> },

      { path: 'photo-edit', element: <PhotoEditPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  useEffect(() => {
    // Kakao SDK 로드 ?�인
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
