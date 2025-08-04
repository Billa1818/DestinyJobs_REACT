import React from 'react';
import Home from '../pages/candidat/Home';
import Profil from '../pages/candidat/Profil';
import Offre from '../pages/candidat/Offre';
import DetailOffre from '../pages/candidat/DetailOffre';
import CandidatureRecente from '../pages/candidat/CandidatureRecente';
import EditerProfil from '../pages/candidat/EditerProfil';
import Postuler from '../pages/candidat/Postuler';
import PostulerOffre from '../pages/candidat/PostulerOffre';
import PostulerFinancement from '../pages/candidat/PostulerFinancement';
import MesCandidatures from '../pages/candidat/MesCandidatures';
import ConfirmationCandidature from '../pages/candidat/ConfirmationCandidature';
import Parametre from '../pages/candidat/Parametre';
import Notification from '../pages/candidat/Notification';
import Finacement from '../pages/candidat/Finacement';
import DetailFinacement from '../pages/candidat/DetailFinacement';
import Bourse from '../pages/candidat/Bourse';
import DetailBourse from '../pages/candidat/DetailBourse';

const candidatRoutes = [
  {
    path: '',
    element: <Home />
  },
  {
    path: 'dashboard',
    element: <Home />
  },
  {
    path: 'profil',
    element: <Profil />
  },
  {
    path: 'offres',
    element: <Offre />
  },
  {
    path: 'offres/:id',
    element: <DetailOffre />
  },
  {
    path: 'candidature-recente',
    element: <CandidatureRecente />
  },
  {
    path: 'editer-profil',
    element: <EditerProfil />
  },
  {
    path: 'postuler',
    element: <Postuler />
  },
  {
    path: 'offres/:id/postuler',
    element: <PostulerOffre />
  },
  {
    path: 'financements/:id/postuler',
    element: <PostulerFinancement />
  },
  {
    path: 'postuler-financement',
    element: <PostulerFinancement />
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
    path: 'parametre',
    element: <Parametre />
  },
  {
    path: 'notification',
    element: <Notification />
  },
  {
    path: 'finacement',
    element: <Finacement />
  },
  {
    path: 'financements/:id',
    element: <DetailFinacement />
  },
  {
    path: 'detail-finacement',
    element: <DetailFinacement />
  },
  {
    path: 'bourse',
    element: <Bourse />
  },
  {
    path: 'detail-bourse',
    element: <DetailBourse />
  }
];

export default candidatRoutes;
