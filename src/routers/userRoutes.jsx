import React from 'react';
import Settings from '../pages/user/Settings';
import CandidatsSettings from '../pages/user/settings/Candidats';
import RecruteurSettings from '../pages/user/settings/Recruteur';
import PrestataireSettings from '../pages/user/settings/Prestataire';
import PlanManager from '../pages/user/PlanManager';

const userRoutes = [
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/settings/candidats',
    element: <CandidatsSettings />
  },
  {
    path: '/settings/recruteur',
    element: <RecruteurSettings />
  },
  {
    path: '/settings/prestataire',
    element: <PrestataireSettings />
  },
  {
    path: '/plan-manager',
    element: <PlanManager />
  }
];

export default userRoutes; 