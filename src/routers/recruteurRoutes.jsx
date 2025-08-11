import React from 'react';

// Import des composants recruteur
import Dashboard from '../pages/recruteur/Dashboard';
import Profil from '../pages/recruteur/Profil';
import ProfilPublic from '../pages/recruteur/ProfilPublic';
import CreeOffre from '../pages/recruteur/CreeOffre';
import GestionOffre from '../pages/recruteur/GestionOffre';
import PostulationOffre from '../pages/recruteur/PostulationOffre';
import PostulationOffres from '../pages/recruteur/PostulationOffres';
import CreeFinacement from '../pages/recruteur/CreeFinacement';
import GestionFinancement from '../pages/recruteur/GestionFinancement';
import PostulationFinancement from '../pages/recruteur/PostulationFinancement';
import PostulationFinancements from '../pages/recruteur/PostulationFinancements';
import CreeBourse from '../pages/recruteur/CreeBourse';
import GestionBourse from '../pages/recruteur/GestionBourse';
import PostulationBourse from '../pages/recruteur/PostulationBourse';
import CreeConsultation from '../pages/recruteur/CreeConsultation';
import GestionConsultation from '../pages/recruteur/GestionConsultation';
import PostulationConsultation from '../pages/recruteur/PostulationConsultation';
import Candidature from '../pages/recruteur/Candidature';
import MessageCDD from '../pages/recruteur/MessageCDD';
import MessageManager from '../pages/recruteur/MessageManager';
import StatGeneral from '../pages/recruteur/StatGeneral';
import Settings from '../pages/recruteur/Settings';
import Notifications from '../pages/recruteur/Notifications';
import Messagerie from '../pages/recruteur/Messagerie';
import BlogPublier from '../pages/recruteur/BlogPublier';
import BlogGerer from '../pages/recruteur/BlogGerer';
import BlogCategories from '../pages/recruteur/BlogCategories';

const recruteurRoutes = [
  // Dashboard principal
  { path: '', element: <Dashboard /> },
  { path: 'dashboard', element: <Dashboard /> },
  
  // Profil et gestion
  { path: 'profil', element: <Profil /> },
  { path: 'profil-public', element: <ProfilPublic /> },
  { path: 'statistiques', element: <StatGeneral /> },
  
  // Gestion des offres d'emploi
  { path: 'creer-offre', element: <CreeOffre /> },
  { path: 'gestion-offres', element: <GestionOffre /> },
  { path: 'postulations-offres', element: <PostulationOffre /> },
  { path: 'postulations-offres/:offreId', element: <PostulationOffres /> },
  
  // Gestion des financements
  { path: 'creer-financement', element: <CreeFinacement /> },
  { path: 'gestion-financements', element: <GestionFinancement /> },
  { path: 'postulations-financements', element: <PostulationFinancement /> },
  { path: 'postulations-financements/:financementId', element: <PostulationFinancements /> },
  
  // Gestion des bourses
  { path: 'creer-bourse', element: <CreeBourse /> },
  { path: 'gestion-bourses', element: <GestionBourse /> },
  { path: 'postulations-bourses', element: <PostulationBourse /> },
  
  // Gestion des consultations
  { path: 'creer-consultation', element: <CreeConsultation /> },
  { path: 'gestion-consultations', element: <GestionConsultation /> },
  { path: 'postulations-consultations', element: <PostulationConsultation /> },
  { path: 'postulations-consultations/:consultationId', element: <PostulationConsultation /> },
  
  // Candidatures et messages
  { path: 'candidatures', element: <Candidature /> },
  { path: 'messages-cdd', element: <MessageCDD /> },
  { path: 'messages-manager', element: <MessageManager /> },
  
  // Paramètres
  { path: 'settings', element: <Settings /> },
  
  // Notifications
  { path: 'notifications', element: <Notifications /> },
  
  // Messagerie
  { path: 'messagerie', element: <Messagerie /> },
  
  // Gestion du blog
  { path: 'blog/publier', element: <BlogPublier /> },
  { path: 'blog/gerer', element: <BlogGerer /> },
  { path: 'blog/categories', element: <BlogCategories /> }
];

export default recruteurRoutes;
