import React from 'react';
import PrestataireHome from '../pages/prestataire/Home';
import Consultations from '../pages/prestataire/Consultations';
import DetailConsultation from '../pages/prestataire/DetailConsultation';
import PrestataireProfile from '../pages/prestataire/Profile';
import CandidaturesRecentes from '../pages/prestataire/CandidaturesRecentes';
import PostulerConsultation from '../pages/prestataire/PostulerConsultation';
import MesCandidatures from '../pages/prestataire/MesCandidatures';
import ConfirmationCandidature from '../pages/prestataire/ConfirmationCandidature';
import Favoris from '../pages/prestataire/Favoris';
import Settings from '../pages/prestataire/Settings';
import Demandes from '../pages/prestataire/Demandes';
import Services from '../pages/prestataire/Services';
import Notifications from '../pages/prestataire/Notifications';
import OffresPrestation from '../pages/prestataire/OffresPrestation';

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
    path: 'consultation/:id',
    element: <DetailConsultation />
  },
  {
    path: 'consultations/:id',
    element: <DetailConsultation />
  },
  {
    path: 'profile',
    element: <PrestataireProfile />
  },
  {
    path: 'candidatures',
    element: <CandidaturesRecentes />
  },
  {
    path: 'consultation/:id/postuler',
    element: <PostulerConsultation />
  },
  {
    path: 'consultations/:id/postuler',
    element: <PostulerConsultation />
  },
  {
    path: 'mes-candidatures',
    element: <MesCandidatures />
  },
  {
    path: 'confirmation-candidature/:id',
    element: <ConfirmationCandidature />
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
    path: 'services',
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
