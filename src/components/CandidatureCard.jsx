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
    switch (statut?.toLowerCase()) {
      case 'new':
      case 'nouvelle':
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewing':
      case 'en_cours':
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted':
      case 'preselectionne':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'interview':
      case 'entretien':
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected':
      case 'refusee':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'approved':
      case 'acceptee':
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'new':
      case 'nouvelle':
      case 'pending':
        return 'En attente';
      case 'reviewing':
      case 'en_cours':
      case 'in_review':
        return 'En évaluation';
      case 'shortlisted':
      case 'preselectionne':
        return 'Présélectionnée';
      case 'interview':
      case 'entretien':
      case 'interview_scheduled':
        return 'Entretien';
      case 'rejected':
      case 'refusee':
        return 'Refusée';
      case 'approved':
      case 'acceptee':
      case 'accepted':
        return 'Acceptée';
      default:
        return statut || 'Inconnu';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
      case 'normale':
      case 'normal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      case 'basse':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'haute':
        return 'Haute';
      case 'medium':
      case 'normale':
      case 'normal':
        return 'Normale';
      case 'low':
      case 'basse':
        return 'Basse';
      default:
        return priority || 'Normale';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';
    try {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        // Format déjà français
        return dateString;
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getExperienceLevel = (years) => {
    if (years >= 10) return 'Expert';
    if (years >= 5) return 'Senior';
    if (years >= 2) return 'Intermédiaire';
    return 'Junior';
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'text-purple-600 bg-purple-100';
      case 'Senior':
        return 'text-blue-600 bg-blue-100';
      case 'Intermédiaire':
        return 'text-green-600 bg-green-100';
      case 'Junior':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Header avec photo de profil et informations principales */}
      <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
          {/* Photo de profil */}
          {candidature.imageProfil ? (
            <img 
              src={candidature.imageProfil} 
              alt={`Photo de ${candidature.nom}`}
              className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ${candidature.imageProfil ? 'hidden' : ''}`}>
                {candidature.avatar || candidature.nom?.substring(0, 2).toUpperCase()}
              </div>
          
          {/* Informations du candidat */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{candidature.nom}</h3>
            <p className="text-sm text-gray-600 mb-2">{candidature.titre || 'Titre non spécifié'}</p>
            
            {/* Contact */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <i className="fas fa-envelope mr-2 text-blue-500"></i>
                {candidature.email}
                  </span>
              {candidature.telephone && (
                <span className="flex items-center">
                  <i className="fas fa-phone mr-2 text-green-500"></i>
                  {candidature.telephone}
                    </span>
                  )}
                </div>
            
            {/* Localisation */}
            {candidature.localisation && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                {candidature.localisation}
              </div>
            )}
              </div>
            </div>
        
        {/* Statut et priorité */}
            <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(candidature.statut)}`}>
                {getStatusText(candidature.statut)}
              </span>
          {candidature.apiData?.priority && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(candidature.apiData.priority)}`}>
              {getPriorityText(candidature.apiData.priority)}
            </span>
          )}
              </div>
      </div>
      
      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Expérience */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">{candidature.experience}</div>
          <div className="text-xs text-gray-600 mb-2">Expérience</div>
          {candidature.niveauExperience && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(candidature.niveauExperience)}`}>
              {candidature.niveauExperience}
            </span>
          )}
        </div>
        
        {/* CV */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className={`text-2xl font-bold ${candidature.cv ? 'text-green-600' : 'text-red-600'} mb-1`}>
            {candidature.cv ? 'Oui' : 'Non'}
          </div>
          <div className="text-xs text-gray-600">CV</div>
        </div>
        
        {/* Lettre de motivation */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className={`text-2xl font-bold ${candidature.lettre ? 'text-green-600' : 'text-red-600'} mb-1`}>
            {candidature.lettre ? 'Oui' : 'Non'}
          </div>
          <div className="text-xs text-gray-600">Lettre</div>
        </div>
        
        {/* Technologies */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {(() => {
              const techCount = candidature.apiData?.applicant_profile?.technologies 
                ? candidature.apiData.applicant_profile.technologies.split(',').length 
                : 0;
              return techCount;
            })()}
          </div>
          <div className="text-xs text-gray-600">Technologies</div>
            </div>
          </div>
          
      {/* Compétences */}
          {candidature.competences && candidature.competences.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-star mr-2 text-yellow-500"></i>
            Compétences ({candidature.competences.length})
          </h4>
              <div className="flex flex-wrap gap-2">
                {candidature.competences.map((competence, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          )}

      {/* Technologies */}
      {candidature.apiData?.applicant_profile?.technologies && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-code mr-2 text-green-500"></i>
            Technologies ({candidature.apiData.applicant_profile.technologies.split(',').length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {candidature.apiData.applicant_profile.technologies.split(',').map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills depuis applicant_profile */}
      {candidature.apiData?.applicant_profile?.skills && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-tools mr-2 text-indigo-500"></i>
            Skills ({candidature.apiData.applicant_profile.skills.split(',').length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {candidature.apiData.applicant_profile.skills.split(',').map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* À propos du candidat */}
      {candidature.apiData?.applicant_profile?.about && candidature.apiData.applicant_profile.about !== 'je suis vivantuhjh' && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-user mr-2 text-teal-500"></i>
            À propos
          </h4>
          <p className="text-sm text-gray-700 bg-teal-50 p-3 rounded-lg">
            {candidature.apiData.applicant_profile.about}
          </p>
        </div>
      )}
      
      {/* Éducation */}
      {candidature.education && candidature.education !== 'euhhhh' && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-graduation-cap mr-2 text-purple-500"></i>
            Formation
          </h4>
          <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded-lg">
            {candidature.education}
          </p>
        </div>
      )}
      
      {/* Expérience professionnelle */}
      {candidature.experienceProfessionnelle && candidature.experienceProfessionnelle !== 'rien de bon' && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-briefcase mr-2 text-indigo-500"></i>
            Expérience Professionnelle
          </h4>
          <p className="text-sm text-gray-700 bg-indigo-50 p-3 rounded-lg">
            {candidature.experienceProfessionnelle}
          </p>
        </div>
      )}
      
      {/* Réalisations */}
      {candidature.achievements && candidature.achievements !== 'jhkkjh' && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-trophy mr-2 text-yellow-500"></i>
            Réalisations
          </h4>
          <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
            {candidature.achievements}
          </p>
        </div>
      )}
      
      {/* Informations sur la candidature */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Informations sur la candidature
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <span className="font-medium">Date de candidature:</span> {formatDate(candidature.dateCandidature)}
          </div>
          {candidature.apiData?.days_since_application && (
            <div>
              <span className="font-medium">Il y a:</span> {candidature.apiData.days_since_application} jour(s)
            </div>
          )}
          {candidature.apiData?.viewed_at && (
            <div>
              <span className="font-medium">Vue le:</span> {formatDate(candidature.apiData.viewed_at)}
            </div>
          )}
          {candidature.apiData?.status_changed_at && (
            <div>
              <span className="font-medium">Statut changé le:</span> {formatDate(candidature.apiData.status_changed_at)}
            </div>
          )}
          {candidature.apiData?.applicant_profile?.years_experience && (
            <div>
              <span className="font-medium">Années d'expérience:</span> {candidature.apiData.applicant_profile.years_experience} an(s)
            </div>
          )}
          {candidature.apiData?.applicant_profile?.country?.name && (
            <div>
              <span className="font-medium">Pays:</span> {candidature.apiData.applicant_profile.country.name}
              </div>
          )}
          {candidature.apiData?.applicant_profile?.region?.name && (
            <div>
              <span className="font-medium">Région:</span> {candidature.apiData.applicant_profile.region.name}
            </div>
          )}
            </div>
          </div>
          
      {/* Informations sur l'offre */}
      {candidature.offre && candidature.offre !== 'je suis vivantuhjh' && (
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center">
            <i className="fas fa-briefcase mr-2"></i>
            Offre de consultation
          </h4>
          <p className="text-sm text-orange-700">
            {candidature.offre}
          </p>
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onViewDetails?.(candidature)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="fas fa-eye mr-2"></i>Détails
        </button>
        
        <button 
          onClick={() => onViewCV?.(candidature)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="fas fa-file-pdf mr-2"></i>Document
        </button>
        
        {candidature.lettre && (
          <button 
            onClick={() => onViewLettre?.(candidature)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 text-sm font-medium flex items-center"
          >
            <i className="fas fa-envelope-open-text mr-2"></i>Lettre
          </button>
        )}
        
        <button 
          onClick={() => onViewCompatibility?.(candidature)}
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium flex items-center"
        >
          <i className="fas fa-chart-pie mr-2"></i>Compatibilité
        </button>
        
          <button 
          onClick={() => onContact?.(candidature)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm font-medium flex items-center"
          >
          <i className="fas fa-envelope mr-2"></i>Contacter
          </button>
        
        {candidature.statut === 'pending' || candidature.statut === 'new' ? (
          <>
            <button 
              onClick={() => onApprove?.(candidature.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium flex items-center"
            >
              <i className="fas fa-check mr-2"></i>Approuver
            </button>
            <button 
              onClick={() => onReject?.(candidature.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center"
            >
              <i className="fas fa-times mr-2"></i>Refuser
              </button>
            </>
          ) : null}
      </div>
    </div>
  );
};

export default CandidatureCard; 