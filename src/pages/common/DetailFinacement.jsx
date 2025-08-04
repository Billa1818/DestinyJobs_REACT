import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dataService } from '../../services/dataService';

const DetailFinacement = () => {
  const { id } = useParams();
  const [financement, setFinancement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFinancement();
  }, [id]);

  const fetchFinancement = async () => {
    try {
      setLoading(true);
      const financementData = await dataService.getFinancementById(id);
      setFinancement(financementData);
    } catch (error) {
      setError('Erreur lors du chargement du financement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </main>
    );
  }

  if (error || !financement) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Financement non trouvé'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/financements" className="hover:text-fuchsia-600 transition duration-200">Financements</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900">{financement.title}</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="xl:w-2/3">
          {/* Funding Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-money-bill-wave text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{financement.title}</h1>
                    <p className="text-green-600 font-medium">{financement.contactInfo.split('@')[0]}@{financement.contactInfo.split('@')[1]?.split('.')[0]}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>{financement.geographicZone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Date limite : {new Date(financement.applicationDeadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-users mr-2"></i>
                    <span>{financement.targetAudience}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  financement.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {financement.isActive ? 'Actif' : 'Inactif'}
                </span>
                <button className="text-gray-400 hover:text-fuchsia-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Funding Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{parseInt(financement.maxAmount).toLocaleString()} FCFA</div>
                <div className="text-sm text-gray-600">Montant maximum</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{financement.repaymentPeriod} mois</div>
                <div className="text-sm text-gray-600">Durée de remboursement</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{financement.interestRate}%</div>
                <div className="text-sm text-gray-600">Taux d'intérêt annuel</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Description
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {financement.description}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Conditions d'éligibilité :</h3>
              <div className="text-gray-700 leading-relaxed mb-4">
                {financement.eligibilityRequirements}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-clipboard-list mr-2 text-fuchsia-600"></i>
              Conditions et exigences
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <i className={`fas ${financement.noCollateral ? 'fa-check text-green-600' : 'fa-times text-red-600'} mr-3`}></i>
                  <span className="text-sm text-gray-700">Sans garantie</span>
                </div>
                <div className="flex items-center">
                  <i className={`fas ${financement.gracePeriod ? 'fa-check text-green-600' : 'fa-times text-red-600'} mr-3`}></i>
                  <span className="text-sm text-gray-700">Période de grâce</span>
                </div>
                <div className="flex items-center">
                  <i className={`fas ${financement.businessPlanRequired ? 'fa-check text-green-600' : 'fa-times text-red-600'} mr-3`}></i>
                  <span className="text-sm text-gray-700">Business plan requis</span>
                </div>
                <div className="flex items-center">
                  <i className={`fas ${financement.financialStatementsRequired ? 'fa-check text-green-600' : 'fa-times text-red-600'} mr-3`}></i>
                  <span className="text-sm text-gray-700">États financiers requis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-route mr-2 text-fuchsia-600"></i>
              Processus de candidature
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {financement.applicationProcess}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations clés</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Montant minimum :</span>
                <span className="text-sm font-medium">{parseInt(financement.minAmount).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Âge minimum :</span>
                <span className="text-sm font-medium">{financement.minAge} ans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Secteur :</span>
                <span className="text-sm font-medium">{financement.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type :</span>
                <span className="text-sm font-medium">{financement.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Candidatures :</span>
                <span className="text-sm font-medium">{financement.applications || 0}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-envelope mr-2 text-fuchsia-600"></i>
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3 text-gray-400"></i>
                <span className="text-sm text-gray-700">{financement.contactInfo}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
                <i className="fas fa-paper-plane mr-2"></i>
                Postuler maintenant
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 font-medium">
                <i className="fas fa-download mr-2"></i>
                Télécharger le guide
              </button>
              <button className="w-full bg-white text-fuchsia-600 border border-fuchsia-600 py-3 px-4 rounded-lg hover:bg-fuchsia-50 transition duration-200 font-medium">
                <i className="fas fa-share mr-2"></i>
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Financements */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financements similaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Similar financement cards would go here */}
        </div>
      </div>
    </main>
  );
};

export default DetailFinacement;