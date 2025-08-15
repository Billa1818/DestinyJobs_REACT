import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import PublicLayout from '../layouts/PublicLayout';
import CandidatLayout from '../layouts/CandidatLayout';
import PrestataireLayout from '../layouts/PrestataireLayout';
import RecruteurLayout from '../layouts/RecruteurLayout';
import ProtectedCandidatRoute from '../components/auth/ProtectedCandidatRoute';
import ProtectedRecruteurRoute from '../components/auth/ProtectedRecruteurRoute';
import ProtectedPrestataireRoute from '../components/auth/ProtectedPrestataireRoute';

// Import des routes décentralisées
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import candidatRoutes from './candidatRoutes';
import recruteurRoutes from './recruteurRoutes';
import prestataireRoutes from './prestataireRoutes';
import publicRoutes from './publicRoutes';
import publicProfileRoutes from './publicProfileRoutes';

// Composants
import NotFound from '../pages/public/NotFound';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Route par défaut */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Routes publiques avec PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path === '/home' ? 'home' : route.path.substring(1)}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Routes des profils publics avec PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          {publicProfileRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.substring(1)}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Routes d'authentification avec BaseLayout */}
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <BaseLayout>
                {route.element}
              </BaseLayout>
            }
          />
        ))}
        
        {/* Routes utilisateur avec BaseLayout */}
        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <BaseLayout>
                {route.element}
              </BaseLayout>
            }
          />
        ))}
        
        {/* Route catch-all pour les routes d'authentification et utilisateur inexistantes */}
        <Route path="/login/*" element={<NotFound />} />
        <Route path="/signup/*" element={<NotFound />} />
        <Route path="/reset-password/*" element={<NotFound />} />
        <Route path="/verify-email/*" element={<NotFound />} />
        <Route path="/settings/*" element={<NotFound />} />
        
        {/* Routes candidat avec CandidatLayout - PROTÉGÉES */}
        <Route 
          path="/candidat/*" 
          element={
            <ProtectedCandidatRoute>
              <CandidatLayout />
            </ProtectedCandidatRoute>
          }
        >
          {candidatRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/candidat/', '')}
              element={route.element}
            />
          ))}
          {/* Route catch-all pour les sous-routes candidat inexistantes */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Routes recruteur avec RecruteurLayout - PROTÉGÉES */}
        <Route 
          path="/recruteur/*" 
          element={
            <ProtectedRecruteurRoute>
              <RecruteurLayout />
            </ProtectedRecruteurRoute>
          }
        >
          {recruteurRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/recruteur/', '')}
              element={route.element}
            />
          ))}
          {/* Route catch-all pour les sous-routes recruteur inexistantes */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Routes prestataire avec PrestataireLayout - PROTÉGÉES */}
        <Route 
          path="/prestataire/*" 
          element={
            <ProtectedPrestataireRoute>
              <PrestataireLayout />
            </ProtectedPrestataireRoute>
          }
        >
          {prestataireRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/prestataire/', '')}
              element={route.element}
            />
          ))}
          {/* Route catch-all pour les sous-routes prestataire inexistantes */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
