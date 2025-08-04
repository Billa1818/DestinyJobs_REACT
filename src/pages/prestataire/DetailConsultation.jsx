import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const DetailConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    fetchConsultationAndCheckApplication();
  }, [id, user]);

  const fetchConsultationAndCheckApplication = async () => {
    try {
      setLoading(true);
      
      // Récupérer la consultation
      const consultationData = await dataService.getConsultationById(id);
      setConsultation(consultationData);

      // Vérifier si l'utilisateur a déjà postulé
      if (user) {
        const existingApplication = await dataService.checkUserApplication(user.id, id, 'consultation');
        setAlreadyApplied(existingApplication);
      }
    } catch (error) {
      setError('Erreur lors du chargement de la consultation');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    navigate(`/prestataire/consultation/${id}/postuler`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultation non trouvée</h2>
        <p className="text-gray-600 mb-4">La consultation que vous recherchez n'existe pas.</p>
        <Link 
          to="/prestataire/consultations"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Retour aux consultations
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 py-4">
            <Link to="/prestataire" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link to="/prestataire/consultations" className="hover:text-fuchsia-600 transition duration-200">Consultations</Link>
            <i className="fas fa-chevron-right text-xs"></i>
                         <span className="text-gray-900">{consultation.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Consultation Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-handshake text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{consultation.title}</h1>
                      <p className="text-blue-600 font-medium">Consultation</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>{consultation.client}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-clock mr-2"></i>
                      <span>{consultation.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>Publié le {new Date(consultation.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    consultation.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {consultation.isActive ? 'Actif' : 'Inactif'}
                  </span>
                  <button className="text-gray-400 hover:text-fuchsia-600">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>

              {/* Consultation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                                     <div className="text-2xl font-bold text-blue-600 mb-1">
                     {consultation.budget}
                   </div>
                  <div className="text-sm text-gray-600">Budget</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                                     <div className="text-2xl font-bold text-green-600 mb-1">
                     {consultation.client}
                   </div>
                  <div className="text-sm text-gray-600">Domaine</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                                     <div className="text-2xl font-bold text-purple-600 mb-1">
                     {consultation.duration}
                   </div>
                  <div className="text-sm text-gray-600">Durée</div>
                </div>
              </div>
            </div>

            {/* Consultation Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
                Description de la mission
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {consultation.description}
                </p>
                
                                 {consultation.requirements && (
                   <>
                     <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Compétences requises :</h3>
                     <p className="text-gray-700 leading-relaxed">
                       {consultation.requirements}
                     </p>
                   </>
                 )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-tasks mr-2 text-fuchsia-600"></i>
                Détails du projet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Domaine</span>
                      <p className="text-gray-900">{consultation.domaine}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Durée</span>
                      <p className="text-gray-900">{consultation.duree}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Localisation</span>
                      <p className="text-gray-900">{consultation.localisation}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date limite</span>
                      <p className="text-gray-900">{new Date(consultation.dateLimite).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Budget et conditions</h3>
                  <div className="space-y-3">
                                         <div>
                       <span className="text-sm font-medium text-gray-500">Budget</span>
                       <p className="text-gray-900 font-semibold">{consultation.budget}</p>
                     </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type de projet</span>
                      <p className="text-gray-900">Consultation</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Mode de travail</span>
                      <p className="text-gray-900">À définir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Apply Button */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Postuler à cette consultation</h3>
              
              {alreadyApplied ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-green-600 text-2xl"></i>
                  </div>
                  <p className="text-green-600 font-medium mb-2">Proposition envoyée</p>
                  <p className="text-sm text-gray-600 mb-4">Vous avez déjà postulé à cette consultation.</p>
                  <Link 
                    to="/prestataire/demandes"
                    className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
                  >
                    Voir mes demandes
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleApply}
                    className="w-full px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Postuler maintenant
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <i className="fas fa-clock mr-2"></i>
                      Temps estimé : 10-15 minutes
                    </p>
                    <p>
                      <i className="fas fa-shield-alt mr-2"></i>
                      Vos données sont protégées
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du projet</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type de mission</span>
                  <p className="text-gray-900">Consultation</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Domaine</span>
                  <p className="text-gray-900">{consultation.domaine}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Localisation</span>
                  <p className="text-gray-900">{consultation.localisation}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Durée</span>
                  <p className="text-gray-900">{consultation.duree}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date limite</span>
                  <p className="text-gray-900">{new Date(consultation.dateLimite).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Similar Consultations */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations similaires</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-fuchsia-500 pl-4">
                  <h4 className="font-medium text-gray-900">Consultant Marketing Digital</h4>
                  <p className="text-sm text-gray-600">Marketing</p>
                  <p className="text-xs text-gray-500">Cotonou, Bénin</p>
                </div>
                <div className="border-l-4 border-fuchsia-500 pl-4">
                  <h4 className="font-medium text-gray-900">Expert en Stratégie</h4>
                  <p className="text-sm text-gray-600">Stratégie</p>
                  <p className="text-xs text-gray-500">Lomé, Togo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailConsultation; 