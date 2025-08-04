import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Postuler = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    coverLetter: '',
    resume: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission de candidature
    console.log('Candidature soumise:', formData);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/candidat" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/candidat/offre" className="hover:text-fuchsia-600 transition duration-200">Offres d'emploi</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/candidat/detail-offre" className="hover:text-fuchsia-600 transition duration-200">Développeur Full Stack</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900">Candidature</span>
      </nav>

      {/* Job Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <i className="fas fa-code text-blue-600 text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidature - Développeur Full Stack</h1>
            <p className="text-blue-600 font-medium">TechCorp Solutions</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>Cotonou, Bénin</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-money-bill mr-2"></i>
            <span>800K - 1.2M FCFA</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-clock mr-2"></i>
            <span>Temps plein</span>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
          Formulaire de candidature
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expérience *</label>
                <select
                  required
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez votre expérience</option>
                  <option value="0-1">0-1 an</option>
                  <option value="1-3">1-3 ans</option>
                  <option value="3-5">3-5 ans</option>
                  <option value="5-10">5-10 ans</option>
                  <option value="10+">10+ ans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formation *</label>
                <select
                  required
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez votre formation</option>
                  <option value="bac">Bac</option>
                  <option value="bac+2">Bac+2</option>
                  <option value="bac+3">Bac+3</option>
                  <option value="bac+4">Bac+4</option>
                  <option value="bac+5">Bac+5</option>
                  <option value="doctorat">Doctorat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lettre de motivation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pourquoi souhaitez-vous ce poste ? *
              </label>
              <textarea
                required
                rows={6}
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Décrivez votre motivation, vos compétences pertinentes et pourquoi vous êtes le candidat idéal pour ce poste..."
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 100 caractères</p>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">CV</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Télécharger votre CV *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 mb-2">
                    Cliquez pour sélectionner un fichier ou glissez-déposez
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX (max 5MB)
                  </p>
                </label>
              </div>
              {formData.resume && (
                <div className="mt-2 flex items-center space-x-2">
                  <i className="fas fa-file text-green-600"></i>
                  <span className="text-sm text-gray-600">{formData.resume.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border-t pt-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
              />
              <div className="text-sm text-gray-600">
                <p>
                  J'accepte que mes données personnelles soient traitées conformément à la 
                  <Link to="#" className="text-fuchsia-600 hover:text-fuchsia-700"> politique de confidentialité</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/candidat/detail-offre"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Soumettre ma candidature
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
          Conseils pour une candidature réussie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-check-circle text-green-600 mt-1"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">CV à jour</h4>
              <p className="text-xs text-gray-600">Assurez-vous que votre CV est récent et complet</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <i className="fas fa-check-circle text-green-600 mt-1"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Lettre personnalisée</h4>
              <p className="text-xs text-gray-600">Adaptez votre lettre au poste et à l'entreprise</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <i className="fas fa-check-circle text-green-600 mt-1"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Vérifiez vos informations</h4>
              <p className="text-xs text-gray-600">Relisez attentivement avant de soumettre</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <i className="fas fa-check-circle text-green-600 mt-1"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Soyez patient</h4>
              <p className="text-xs text-gray-600">Le processus de recrutement peut prendre du temps</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Postuler;