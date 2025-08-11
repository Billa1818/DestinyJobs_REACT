import React from 'react';
import { Link } from 'react-router-dom';

const CandidatureCard = ({ 
  candidature, 
  type = 'offre', // 'offre', 'financement', 'bourse', 'consultation'
  onViewDetails,
  onViewCV,
  onViewLettre,
  onViewBusinessPlan,
  onViewCompatibility,
  onContact,
  onAddNote,
  onApprove,
  onReject,
  showViewPostulations = false,
  postulationsLink = ''
}) => {
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'new':
      case 'nouvelle':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
      case 'preselectionne':
        return 'bg-green-100 text-green-800';
      case 'interview':
      case 'entretien':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
      case 'refusee':
        return 'bg-red-100 text-red-800';
      case 'approved':
      case 'acceptee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'new':
      case 'nouvelle':
        return 'Nouvelle';
      case 'reviewing':
      case 'en_cours':
        return 'En évaluation';
      case 'shortlisted':
      case 'preselectionne':
        return 'Présélectionnée';
      case 'interview':
      case 'entretien':
        return 'Entretien';
      case 'rejected':
      case 'refusee':
        return 'Refusée';
      case 'approved':
      case 'acceptee':
        return 'Acceptée';
      default:
        return statut;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-semibold">
                {candidature.avatar || candidature.nom?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{candidature.nom}</h3>
                <p className="text-sm text-gray-600">{candidature.email}</p>
                <p className="text-sm text-gray-600">{candidature.telephone}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {candidature.localisation}
                  </span>
                  <span className="text-sm text-gray-500">
                    <i className="fas fa-briefcase mr-1"></i>
                    {candidature.experience}
                  </span>
                  {candidature.formation && (
                    <span className="text-sm text-gray-500">
                      <i className="fas fa-graduation-cap mr-1"></i>
                      {candidature.formation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidature.statut)}`}>
                {getStatusText(candidature.statut)}
              </span>
              <div className="text-center">
                {candidature.scoreCompatibilite ? (
                  <>
                    <div className={`text-lg font-bold ${getScoreColor(candidature.scoreCompatibilite)}`}>
                      {candidature.scoreCompatibilite}%
                    </div>
                    <div className="text-xs text-gray-500">Compatibilité</div>
                  </>
                ) : candidature.note ? (
                  <>
                    <div className="text-lg font-bold text-fuchsia-600">{candidature.note}/5</div>
                    <div className="text-xs text-gray-500">Note</div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          
          {candidature.competences && candidature.competences.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences</h4>
              <div className="flex flex-wrap gap-2">
                {candidature.competences.map((competence, index) => (
                  <span key={index} className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-xs">
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidature.projet && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Projet</h4>
              <p className="text-sm text-gray-700">{candidature.projet}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{candidature.experience}</div>
              <div className="text-xs text-gray-500">Expérience</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-blue-600">{candidature.cv ? 'Oui' : 'Non'}</div>
              <div className="text-xs text-gray-500">CV</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-600">{candidature.lettre ? 'Oui' : 'Non'}</div>
              <div className="text-xs text-gray-500">Lettre</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-purple-600">
                {candidature.competences ? candidature.competences.length : '-'}
              </div>
              <div className="text-xs text-gray-500">Compétences</div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Candidature soumise le {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
          {showViewPostulations && postulationsLink && (
            <Link to={postulationsLink} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
              <i className="fas fa-eye mr-1"></i>Voir postulations
            </Link>
          )}
          <button 
            onClick={() => onViewDetails?.(candidature.id)}
            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm"
          >
            <i className="fas fa-eye mr-1"></i>Voir détails
          </button>
          <button 
            onClick={() => onViewCV?.(candidature.id)}
            className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm"
          >
            <i className="fas fa-file-pdf mr-1"></i>CV
          </button>
          {type === 'financement' && (
            <button 
              onClick={() => onViewBusinessPlan?.(candidature.id)}
              className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm"
            >
              <i className="fas fa-chart-line mr-1"></i>Business Plan
            </button>
          )}
          {candidature.scoreCompatibilite && (
            <button 
              onClick={() => onViewCompatibility?.(candidature.id)}
              className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm"
            >
              <i className="fas fa-chart-pie mr-1"></i>Compatibilité ({candidature.scoreCompatibilite}%)
            </button>
          )}
          <button 
            onClick={() => onContact?.(candidature.id)}
            className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm"
          >
            <i className="fas fa-envelope mr-1"></i>Contacter
          </button>
          <button 
            onClick={() => onAddNote?.(candidature.id)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 text-sm"
          >
            <i className="fas fa-sticky-note mr-1"></i>Note
          </button>
          {candidature.statut === 'new' || candidature.statut === 'nouvelle' ? (
            <>
              <button 
                onClick={() => onApprove?.(candidature.id)}
                className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm"
              >
                <i className="fas fa-check mr-1"></i>Approuver
              </button>
              <button 
                onClick={() => onReject?.(candidature.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm"
              >
                <i className="fas fa-times mr-1"></i>Refuser
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CandidatureCard; 