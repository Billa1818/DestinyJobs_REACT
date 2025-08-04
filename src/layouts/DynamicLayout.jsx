import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BaseHeader from '../components/headers/BaseHeader';
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
      console.log('Rendering BaseHeader - User not authenticated');
      return <BaseHeader />;
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
        console.log('Rendering BaseHeader (default) - Role:', user.role);
        return <BaseHeader />;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {renderHeader()}
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Scrollable Content Column */}
          <div className="xl:w-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="xs:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
                <div className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 bg-fuchsia-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-briefcase text-white text-xs sm:text-sm"></i>
                </div>
                <span className="ml-1.5 sm:ml-2 text-base xs:text-lg sm:text-xl font-bold">Destiny Jobs</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">Un emploi. Un impact. Une Afrique transformée.</p>
              <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-facebook text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-linkedin text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-twitter text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-instagram text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Liens rapides</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/jobs" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Emplois</Link></li>
                <li><Link to="/formations" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Formations</Link></li>
                <li><Link to="/bourses" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Bourses</Link></li>
                <li><Link to="/financements" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Financements</Link></li>
                <li><Link to="/consultation" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Consultation</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Services</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/candidat" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Pour candidats</Link></li>
                <li><Link to="/prestataire" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Pour prestataires</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Blog</Link></li>
                <li><Link to="/support" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Contact</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">Cotonou, Bénin</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">+229 XX XX XX XX</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">contact@destinyjobs.careers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <div className="flex flex-col xs:flex-row justify-between items-center space-y-2 xs:space-y-0">
              <p className="text-gray-400 text-xs xs:text-sm sm:text-base text-center xs:text-left">
                © 2024 Destiny Jobs. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center xs:justify-end items-center space-x-3 sm:space-x-4 lg:space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Politique de confidentialité</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Conditions d'utilisation</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DynamicLayout; 