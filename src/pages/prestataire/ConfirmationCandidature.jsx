import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';

const ConfirmationCandidature = () => {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultation();
  }, [id]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const consultationData = await dataService.getConsultationById(id);
      setConsultation(consultationData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-green-600 text-3xl"></i>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Proposition envoyée avec succès !
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Votre proposition pour la consultation <strong>{consultation?.titre}</strong> a été envoyée avec succès.
          </p>

          {/* Consultation Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Titre :</span>
                <p className="text-gray-900 font-medium">{consultation?.titre}</p>
              </div>
              <div>
                <span className="text-gray-500">Domaine :</span>
                <p className="text-gray-900">{consultation?.domaine}</p>
              </div>
              <div>
                <span className="text-gray-500">Durée :</span>
                <p className="text-gray-900">{consultation?.duree}</p>
              </div>
              <div>
                <span className="text-gray-500">Budget :</span>
                <p className="text-gray-900">{consultation?.budget?.toLocaleString()} FCFA</p>
              </div>
              <div>
                <span className="text-gray-500">Localisation :</span>
                <p className="text-gray-900">{consultation?.localisation}</p>
              </div>
              <div>
                <span className="text-gray-500">Date limite :</span>
                <p className="text-gray-900">{new Date(consultation?.dateLimite).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              Prochaines étapes
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p>Le client va examiner votre proposition dans les prochains jours.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p>Vous recevrez une notification par email pour toute mise à jour.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p>Vous pouvez suivre l'état de votre proposition dans votre espace personnel.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/prestataire/demandes"
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 text-center"
            >
              <i className="fas fa-list mr-2"></i>
              Voir mes demandes
            </Link>
            
            <Link
              to="/prestataire/consultations"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-center"
            >
              <i className="fas fa-search mr-2"></i>
              Découvrir d'autres consultations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCandidature; 