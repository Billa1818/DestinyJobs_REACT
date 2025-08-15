import React from 'react';


// Import des composants du dossier common
import Offre from '../pages/common/Offre';
import Bourse from '../pages/common/Bourse';
import Finacement from '../pages/common/Finacement';
import DetailBourse from '../pages/public/DetailBourse';
import DetailFinancement from '../pages/public/DetailFinancement';
import Postuler from '../pages/common/Postuler';

// Import des composants publics
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Blog from '../pages/public/Blog';
import BlogDetail from '../pages/public/BlogDetail';
import DetailOffre from '../pages/public/DetailOffre';
import DetailConsultation from '../pages/public/DetailConsultation';
import BlogArticle from '../pages/public/BlogArticle';
import Consultations from '../pages/public/Consultations';
import Jobs from '../pages/public/Jobs';
import Financements from '../pages/public/Financements';
import Bourses from '../pages/public/Bourses';
import PlanAbonnement from '../pages/public/PlanAbonnement';
import Paiement from '../pages/public/Paiement';
import IACompatibilityCheck from '../pages/public/IACompatibilityCheck';
import NotFound from '../pages/public/NotFound';
import ProfilPublic from '../pages/recruteur/ProfilPublic';


const Formations = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Formations</h1>
    <p className="text-gray-600">Améliorez vos compétences avec nos formations professionnelles.</p>
  </div>
);







const publicRoutes = [
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/jobs/:id',
    element: <DetailOffre />
  },
  {
    path: '/consultations',
    element: <Consultations />
  },
  {
    path: '/consultations/:id',
    element: <DetailConsultation />
  },
  {
    path: '/jobs/:id/postuler',
    element: <Postuler />
  },
  {
    path: '/formations',
    element: <Formations />
  },
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/blog/:slug',
    element: <BlogDetail />
  },
  {
    path: '/blog/article/:id',
    element: <BlogArticle />
  },
  {
    path: '/abonnements',
    element: <PlanAbonnement />
  },
  {
    path: '/paiement/:plan',
    element: <Paiement />
  },
  {
    path: '/a-propos',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/utilisateurs',
    element: <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nos utilisateurs</h1>
      <p className="text-gray-600">Découvrez notre communauté d'utilisateurs.</p>
    </div>
  },
  {
    path: '/financements',
    element: <Financements />
  },
  {
    path: '/financements/:id',
    element: <DetailFinancement />
  },
  {
    path: '/consultation',
    element: <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Consultation</h1>
      <p className="text-gray-600">Bénéficiez de nos services de consultation.</p>
    </div>
  },
  {
    path: '/bourses',
    element: <Bourses />
  },
  {
    path: '/bourses/:id',
    element: <DetailBourse />
  },
  {
    path: '/support',
    element: <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Support</h1>
      <p className="text-gray-600">Besoin d'aide ? Notre équipe est là pour vous.</p>
    </div>
  },
  {
    path: '/test-routing',
    
  },
  {
    path: '/ia-compatibility/:offerId/:offerType',
    element: <IACompatibilityCheck />
  },
  {
    path: '/entreprise/:id',
    element: <ProfilPublic />
  },
  {
    path: '/recruteur/profil-public/:id',
    element: <ProfilPublic />
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '*',
    element: <NotFound />
  },

];

export default publicRoutes;
