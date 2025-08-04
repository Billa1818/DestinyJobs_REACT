import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const ModifierFinancement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [financement, setFinancement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    sector: '',
    minAmount: '',
    maxAmount: '',
    interestRate: '',
    repaymentPeriod: '',
    targetAudience: '',
    minAge: '',
    geographicZone: '',
    description: '',
    eligibilityRequirements: '',
    applicationProcess: '',
    applicationDeadline: '',
    maxApplications: '',
    contactInfo: '',
    noCollateral: false,
    gracePeriod: false,
    businessPlanRequired: false,
    financialStatementsRequired: false,
    urgentFunding: false,
    isActive: true
  });

  useEffect(() => {
    fetchFinancement();
  }, [id]);

  const fetchFinancement = async () => {
    try {
      setLoading(true);
      const financementData = await dataService.getFinancementById(id);
      
      // Vérifier que le financement appartient au recruteur connecté
      if (financementData.recruiterId !== user.id) {
        setError('Vous n\'êtes pas autorisé à modifier ce financement');
        return;
      }
      
      setFinancement(financementData);
      setFormData({
        title: financementData.title || '',
        type: financementData.type || '',
        sector: financementData.sector || '',
        minAmount: financementData.minAmount || '',
        maxAmount: financementData.maxAmount || '',
        interestRate: financementData.interestRate || '',
        repaymentPeriod: financementData.repaymentPeriod || '',
        targetAudience: financementData.targetAudience || '',
        minAge: financementData.minAge || '',
        geographicZone: financementData.geographicZone || '',
        description: financementData.description || '',
        eligibilityRequirements: financementData.eligibilityRequirements || '',
        applicationProcess: financementData.applicationProcess || '',
        applicationDeadline: financementData.applicationDeadline || '',
        maxApplications: financementData.maxApplications || '',
        contactInfo: financementData.contactInfo || '',
        noCollateral: financementData.noCollateral || false,
        gracePeriod: financementData.gracePeriod || false,
        businessPlanRequired: financementData.businessPlanRequired || false,
        financialStatementsRequired: financementData.financialStatementsRequired || false,
        urgentFunding: financementData.urgentFunding || false,
        isActive: financementData.isActive !== undefined ? financementData.isActive : true
      });
    } catch (error) {
      console.error('Erreur lors du chargement du financement:', error);
      setError('Erreur lors du chargement du financement');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre du financement est requis');
      return false;
    }
    if (!formData.type) {
      setError('Le type de financement est requis');
      return false;
    }
    if (!formData.minAmount || !formData.maxAmount) {
      setError('Les montants minimum et maximum sont requis');
      return false;
    }
    if (!formData.targetAudience) {
      setError('Le public cible est requis');
      return false;
    }
    if (!formData.geographicZone.trim()) {
      setError('La zone géographique est requise');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description du financement est requise');
      return false;
    }
    if (!formData.eligibilityRequirements.trim()) {
      setError('Les conditions d\'éligibilité sont requises');
      return false;
    }
    if (!formData.contactInfo.trim()) {
      setError('Les informations de contact sont requises');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updatedFinancementData = {
        ...formData,
        minAmount: parseInt(formData.minAmount),
        maxAmount: parseInt(formData.maxAmount),
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : null,
        repaymentPeriod: formData.repaymentPeriod ? parseInt(formData.repaymentPeriod) : null,
        minAge: formData.minAge ? parseInt(formData.minAge) : null,
        maxApplications: formData.maxApplications ? parseInt(formData.maxApplications) : null
      };

      await dataService.updateFinancement(id, updatedFinancementData);
      navigate('/recruteur/gestion-financements');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour du financement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce financement ? Cette action est irréversible.')) {
      try {
        setSaving(true);
        await dataService.deleteFinancement(id);
        navigate('/recruteur/gestion-financements');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression du financement');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    );
  }

  if (error && !financement) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/recruteur/gestion-financements')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Retour à la gestion des financements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Modifier le financement</h1>
            <p className="text-gray-600">Modifiez les informations de votre offre de financement</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
            >
              <i className="fas fa-trash mr-2"></i>Supprimer le financement
            </button>
            <Link
              to="/recruteur/gestion-financements"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-center"
            >
              Annuler
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-edit mr-2 text-fuchsia-600"></i>
            Informations du financement
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Titre du financement */}
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du financement *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Microcrédit pour entrepreneurs femmes"
              />
            </div>

            {/* Type de financement */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de financement *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                <option value="microcredit">Microcrédit</option>
                <option value="pret_bancaire">Prêt bancaire</option>
                <option value="subvention">Subvention</option>
                <option value="capital_risque">Capital risque</option>
                <option value="crowdfunding">Financement participatif</option>
                <option value="bourse">Bourse d'étude/recherche</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Secteur */}
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                Secteur ciblé
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Tous secteurs</option>
                <option value="agriculture">Agriculture</option>
                <option value="technologie">Technologie</option>
                <option value="sante">Santé</option>
                <option value="education">Éducation</option>
                <option value="commerce">Commerce</option>
                <option value="industrie">Industrie</option>
                <option value="services">Services</option>
                <option value="artisanat">Artisanat</option>
              </select>
            </div>

            {/* Montant minimum */}
            <div>
              <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant minimum (FCFA) *
              </label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                required
                min="0"
                value={formData.minAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 500000"
              />
            </div>

            {/* Montant maximum */}
            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant maximum (FCFA) *
              </label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                required
                min="0"
                value={formData.maxAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 10000000"
              />
            </div>

            {/* Taux d'intérêt */}
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                Taux d'intérêt (% annuel)
              </label>
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                min="0"
                max="100"
                step="0.1"
                value={formData.interestRate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 8.5"
              />
            </div>

            {/* Durée de remboursement */}
            <div>
              <label htmlFor="repaymentPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                Durée de remboursement (mois)
              </label>
              <input
                type="number"
                id="repaymentPeriod"
                name="repaymentPeriod"
                min="1"
                value={formData.repaymentPeriod}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 36"
              />
            </div>

            {/* Public cible */}
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                Public cible *
              </label>
              <select
                id="targetAudience"
                name="targetAudience"
                required
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="jeunes">Jeunes entrepreneurs (18-35 ans)</option>
                <option value="femmes">Femmes entrepreneures</option>
                <option value="pme">PME/PMI</option>
                <option value="startups">Startups</option>
                <option value="agriculteurs">Agriculteurs</option>
                <option value="artisans">Artisans</option>
                <option value="tous">Tous publics</option>
              </select>
            </div>

            {/* Âge minimum */}
            <div>
              <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-2">
                Âge minimum
              </label>
              <input
                type="number"
                id="minAge"
                name="minAge"
                min="18"
                max="100"
                value={formData.minAge}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 21"
              />
            </div>

            {/* Zone géographique */}
            <div className="lg:col-span-2">
              <label htmlFor="geographicZone" className="block text-sm font-medium text-gray-700 mb-2">
                Zone géographique *
              </label>
              <input
                type="text"
                id="geographicZone"
                name="geographicZone"
                required
                value={formData.geographicZone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Cotonou, Littoral, Bénin ou National"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Décrivez en détail votre offre de financement, ses avantages et spécificités..."
              />
            </div>

            {/* Conditions d'éligibilité */}
            <div className="lg:col-span-2">
              <label htmlFor="eligibilityRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                Conditions d'éligibilité *
              </label>
              <textarea
                id="eligibilityRequirements"
                name="eligibilityRequirements"
                required
                rows={4}
                value={formData.eligibilityRequirements}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Listez les conditions requises, documents à fournir, critères de sélection..."
              />
            </div>

            {/* Processus de candidature */}
            <div className="lg:col-span-2">
              <label htmlFor="applicationProcess" className="block text-sm font-medium text-gray-700 mb-2">
                Processus de candidature
              </label>
              <textarea
                id="applicationProcess"
                name="applicationProcess"
                rows={3}
                value={formData.applicationProcess}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Expliquez les étapes de candidature, délais de traitement, modalités de sélection..."
              />
            </div>

            {/* Date limite */}
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                Date limite de candidature
              </label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>

            {/* Nombre maximum de candidatures */}
            <div>
              <label htmlFor="maxApplications" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre maximum de candidatures
              </label>
              <input
                type="number"
                id="maxApplications"
                name="maxApplications"
                min="1"
                value={formData.maxApplications}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 100"
              />
            </div>

            {/* Informations de contact */}
            <div className="lg:col-span-2">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Informations de contact *
              </label>
              <textarea
                id="contactInfo"
                name="contactInfo"
                required
                rows={2}
                value={formData.contactInfo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Email, téléphone, adresse physique pour les candidatures..."
              />
            </div>

            {/* Options spéciales */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="noCollateral"
                      name="noCollateral"
                      checked={formData.noCollateral}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sans garantie/caution</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="gracePeriod"
                      name="gracePeriod"
                      checked={formData.gracePeriod}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Période de grâce disponible</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgentFunding"
                      name="urgentFunding"
                      checked={formData.urgentFunding}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Financement urgent</span>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="businessPlanRequired"
                      name="businessPlanRequired"
                      checked={formData.businessPlanRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Plan d'affaires requis</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="financialStatementsRequired"
                      name="financialStatementsRequired"
                      checked={formData.financialStatementsRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">États financiers requis</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Financement actif (visible par les candidats)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/recruteur/gestion-financements')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierFinancement; 