import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import DynamicLayout from '../layouts/DynamicLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';

// Import des routes décentralisées
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import candidatRoutes from './candidatRoutes';
import recruteurRoutes from './recruteurRoutes';
import prestataireRoutes from './prestataireRoutes';
import publicRoutes from './publicRoutes';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Route par défaut */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Routes publiques avec DynamicLayout */}
        <Route path="/" element={<DynamicLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path === '/home' ? 'home' : route.path.substring(1)}
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
              <PublicOnlyRoute>
                <BaseLayout>
                  {route.element}
                </BaseLayout>
              </PublicOnlyRoute>
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
        
        {/* Routes candidat avec DynamicLayout */}
        <Route path="/candidat/*" element={
          <ProtectedRoute requiredRole="candidat">
            <DynamicLayout />
          </ProtectedRoute>
        }>
          {candidatRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/candidat/', '')}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Routes recruteur avec DynamicLayout */}
        <Route path="/recruteur/*" element={
          <ProtectedRoute requiredRole="recruteur">
            <DynamicLayout />
          </ProtectedRoute>
        }>
          {recruteurRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/recruteur/', '')}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Routes prestataire avec DynamicLayout */}
        <Route path="/prestataire/*" element={
          <ProtectedRoute requiredRole="prestataire">
            <DynamicLayout />
          </ProtectedRoute>
        }>
          {prestataireRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path.replace('/prestataire/', '')}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Route 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-fuchsia-600 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a 
                href="/home" 
                className="bg-fuchsia-600 text-white px-6 py-3 rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
