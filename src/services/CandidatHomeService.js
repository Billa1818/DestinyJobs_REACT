import api from './api';

class CandidatHomeService {
  // Récupérer les statistiques des candidatures du candidat
  async getMyApplicationStats() {
    try {
      console.log('📊 API Call - CandidatHomeService.getMyApplicationStats');
      
      const response = await api.get('/api/applications/my-stats/');
      
      console.log('✅ API Response - CandidatHomeService.getMyApplicationStats:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatHomeService.getMyApplicationStats:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Vous n\'êtes pas autorisé à accéder à ces statistiques.');
          case 404:
            throw new Error('Statistiques non trouvées.');
          default:
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.detail || 'Erreur lors de la récupération des statistiques'}`);
        }
      } else if (error.request) {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }

  // Récupérer toutes mes candidatures
  async getMyApplications() {
    try {
      console.log('📋 API Call - CandidatHomeService.getMyApplications');
      
      const response = await api.get('/api/applications/my/');
      
      console.log('✅ API Response - CandidatHomeService.getMyApplications:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatHomeService.getMyApplications:', error);
      throw error;
    }
  }

  // Récupérer mes candidatures par type
  async getMyApplicationsByType(type) {
    try {
      console.log(`📋 API Call - CandidatHomeService.getMyApplicationsByType: ${type}`);
      
      let endpoint;
      switch (type) {
        case 'job':
          endpoint = '/api/applications/job/';
          break;
        case 'consultation':
          endpoint = '/api/applications/consultation/';
          break;
        case 'funding':
          endpoint = '/api/applications/funding/';
          break;
        default:
          throw new Error('Type de candidature non reconnu');
      }
      
      const response = await api.get(endpoint);
      
      console.log(`✅ API Response - CandidatHomeService.getMyApplicationsByType (${type}):`, response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Erreur CandidatHomeService.getMyApplicationsByType (${type}):`, error);
      throw error;
    }
  }

  // Formater les statistiques pour l'affichage
  formatStatsForDisplay(stats) {
    if (!stats) return null;

    return {
      // Statistiques générales
      total: stats.total_applications || 0,
      pending: stats.pending_applications || 0,
      viewed: stats.viewed_applications || 0,
      shortlisted: stats.shortlisted_applications || 0,
      rejected: stats.rejected_applications || 0,
      interview: stats.interview_applications || 0,
      
      // Par type
      job: stats.job_applications || 0,
      consultation: stats.consultation_applications || 0,
      funding: stats.funding_applications || 0,
      
      // Par priorité
      highPriority: stats.high_priority || 0,
      normalPriority: stats.normal_priority || 0,
      lowPriority: stats.low_priority || 0,
      
      // Métriques avancées
      successRate: stats.success_rate || 0,
      userId: stats.user_id,
      generatedAt: stats.generated_at
    };
  }

  // Calculer le pourcentage de progression
  calculateProgressPercentage(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }

  // Obtenir la couleur du statut
  getStatusColor(status) {
    const colors = {
      pending: 'bg-yellow-500',
      viewed: 'bg-blue-500',
      shortlisted: 'bg-green-500',
      rejected: 'bg-red-500',
      interview: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  }

  // Obtenir l'icône du statut
  getStatusIcon(status) {
    const icons = {
      pending: 'fas fa-clock',
      viewed: 'fas fa-eye',
      shortlisted: 'fas fa-star',
      rejected: 'fas fa-times-circle',
      interview: 'fas fa-handshake'
    };
    return icons[status] || 'fas fa-question';
  }
}

export default new CandidatHomeService(); 