import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicHeader from '../components/headers/PublicHeader';
import CandidatHeader from '../components/headers/CandidatHeader';
import RecruteurHeader from '../components/headers/RecruteurHeader';
import PrestataireHeader from '../components/headers/PrestataireHeader';

const DynamicLayout = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('=== DynamicLayout Debug ===');
  console.log('user:', user);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user?.role:', user?.role);
  console.log('localStorage user:', localStorage.getItem('user'));
  console.log('localStorage token:', localStorage.getItem('token'));
  console.log('========================');

  const renderHeader = () => {
    if (!isAuthenticated || !user) {
      console.log('Rendering PublicHeader - User not authenticated');
      return <PublicHeader />;
    }

    console.log('User role:', user.role);
    switch (user.role) {
      case 'candidat':
        console.log('Rendering CandidatHeader');
        return <CandidatHeader />;
      case 'recruteur':
        console.log('Rendering RecruteurHeader');
        return <RecruteurHeader />;
      case 'prestataire':
        console.log('Rendering PrestataireHeader');
        return <PrestataireHeader />;
      default:
        console.log('Rendering PublicHeader (default) - Role:', user.role);
        return <PublicHeader />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DynamicLayout; 