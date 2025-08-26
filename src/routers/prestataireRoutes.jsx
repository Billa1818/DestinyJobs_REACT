import React from 'react';
import PrestataireHome from '../pages/prestataire/Home';
import Consultations from '../pages/prestataire/Consultations';
import PrestataireProfile from '../pages/prestataire/Profile';
import CandidaturesRecentes from '../pages/prestataire/CandidaturesRecentes';
import Favoris from '../pages/prestataire/Favoris';
import Settings from '../pages/prestataire/Settings';
import Demandes from '../pages/prestataire/Demandes';
import Services from '../pages/prestataire/Services';
import Notifications from '../pages/prestataire/Notifications';
import OffresPrestation from '../pages/prestataire/OffresPrestation';
import TestProfile from '../pages/prestataire/TestProfile';
import DebugProfile from '../pages/prestataire/DebugProfile';
import FilePreviewDemo from '../pages/prestataire/FilePreviewDemo';

const prestataireRoutes = [
  {
    path: '',
    element: <PrestataireHome />
  },
  {
    path: 'dashboard',
    element: <PrestataireHome />
  },
  {
    path: 'consultation',
    element: <Consultations />
  },
  {
    path: 'consultations',
    element: <Consultations />
  },
  {
    path: 'profile',
    element: <PrestataireProfile />
  },
  {
    path: 'test-profile',
    element: <TestProfile />
  },
  {
    path: 'debug-profile',
    element: <DebugProfile />
  },
  {
    path: 'file-preview-demo',
    element: <FilePreviewDemo />
  },
  {
    path: 'candidatures',
    element: <CandidaturesRecentes />
  },
  {
    path: 'favoris',
    element: <Favoris />
  },
  {
    path: 'settings',
    element: <Settings />
  },
  {
    path: 'demandes',
    element: <Demandes />
  },
  {
    path: 'services/:providerId?',
    element: <Services />
  },
  {
    path: 'notifications',
    element: <Notifications />
  },
  {
    path: 'offres-prestation',
    element: <OffresPrestation />
  }
];

export default prestataireRoutes;
