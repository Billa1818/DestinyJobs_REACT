import React from 'react';
import Home from '../pages/candidat/Home';
import Profil from '../pages/candidat/Profil';
import Jobs from '../pages/public/Jobs';
import DetailOffre from '../pages/candidat/DetailOffre';
import EmploiCandidature from '../pages/candidat/EmploiCandidature';
import EditerProfil from '../pages/candidat/EditerProfil';
import Postuler from '../pages/candidat/Postuler';
import Parametre from '../pages/candidat/Parametre';
import Notification from '../pages/candidat/Notification';
import Finacement from '../pages/candidat/Finacement';
import DetailFinacement from '../pages/candidat/DetailFinacement';
import Bourse from '../pages/candidat/Bourse';
import DetailBourse from '../pages/candidat/DetailBourse';
import IACompatibilityCheck from '../pages/candidat/IACompatibilityCheck';
import FinancementCandidature from '../pages/candidat/FinancementCandidature';

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
    path: 'offre',
    element: <Jobs />
  },
  {
    path: 'detail-offre',
    element: <DetailOffre />
  },
  {
    path: 'emploi-candidature',
    element: <EmploiCandidature />
  },
  {
    path: 'financement-candidature',
    element: <FinancementCandidature />
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
  },
  {
    path: 'ia-compatibility/:offerId/:offerType',
    element: <IACompatibilityCheck />
  }
];

export default candidatRoutes;
