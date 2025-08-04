import React from 'react';
import TestRouting from '../components/TestRouting';

// Import des composants du dossier common
import Offre from '../pages/common/Offre';
import Bourse from '../pages/common/Bourse';
import Finacement from '../pages/common/Finacement';
import DetailBourse from '../pages/common/DetailBourse';
import DetailFinacement from '../pages/common/DetailFinacement';
import Postuler from '../pages/common/Postuler';

// Import des composants publics
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Blog from '../pages/public/Blog';
import DetailOffre from '../pages/public/DetailOffre';
import DetailConsultation from '../pages/public/DetailConsultation';
import BlogArticle from '../pages/public/BlogArticle';
import Consultations from '../pages/public/Consultations';
import PlanAbonnement from '../pages/public/PlanAbonnement';
import Paiement from '../pages/public/Paiement';



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
    element: <Offre />
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
    element: <Finacement />
  },
  {
    path: '/financements/:id',
    element: <DetailFinacement />
  },
  {
    path: '/consultation',
    element: <Consultations />
  },
  {
    path: '/bourses',
    element: <Bourse />
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
    element: <TestRouting />
  }
];

export default publicRoutes;
