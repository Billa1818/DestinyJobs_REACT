import React from 'react';
import CandidatePublicProfile from '../pages/public/CandidatePublicProfile';
import PublicProfilesIndex from '../pages/public/PublicProfilesIndex';

const publicProfileRoutes = [
  {
    path: '/profiles',
    element: <PublicProfilesIndex />
  },
  {
    path: '/profile/candidat/:userId',
    element: <CandidatePublicProfile />
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