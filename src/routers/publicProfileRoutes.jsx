import React from 'react';
import CandidatePublicProfile from '../pages/public/CandidatePublicProfile';
import PublicProfilesIndex from '../pages/public/PublicProfilesIndex';
import TestPublicProfile from '../pages/public/TestPublicProfile';
import ApiTest from '../pages/public/ApiTest';

const publicProfileRoutes = [
  {
    path: '/profiles',
    element: <PublicProfilesIndex />
  },
  {
    path: '/profile/candidat/:userId',
    element: <CandidatePublicProfile />
  },
  {
    path: '/test-public-profile',
    element: <TestPublicProfile />
  },
  {
    path: '/api-test',
    element: <ApiTest />
  },
  // Routes futures pour les recruteurs et prestataires
  // {
  //   path: '/profile/recruteur/:userId',
  //   element: <RecruiterPublicProfile />
  // },
  // {
  //   path: '/profile/prestataire/:userId',
  //   element: <ProviderPublicProfile />
  // }
];

export default publicProfileRoutes; 