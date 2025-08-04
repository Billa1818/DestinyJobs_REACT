import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    company: '',
    message: '',
    newsletter: false,
    privacy: false
  });

  const [faqOpen, setFaqOpen] = useState({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
    faq5: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    // Ici, vous pouvez ajouter la logique pour envoyer le formulaire
  };

  const toggleFAQ = (faqId) => {
    setFaqOpen(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
      {/* Scrollable Content Column */}
      <div className="flex-1 lg:w-2/3">
        <div className="bg-white rounded-lg shadow-sm min-h-screen custom-scrollbar overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6">
            {/* Breadcrumb */}
            <nav className="flex mb-4 sm:mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-home mr-1 sm:mr-2"></i>
                    <span className="hidden xs:inline">Accueil</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="fas fa-chevron-right text-gray-400 mx-1 sm:mx-2 text-xs"></i>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Contact</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                <i className="fas fa-envelope mr-2 sm:mr-3 text-fuchsia-600"></i>
                Contactez-nous
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question ou suggestion.</p>
            </div>

            {/* Contact Form Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      required 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      required 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="votre.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Sujet *</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    required 
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="job">Offre d'emploi</option>
                    <option value="recruitment">Recrutement</option>
                    <option value="training">Formation</option>
                    <option value="scholarship">Bourse</option>
                    <option value="technical">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Entreprise/Organisation</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Nom de votre entreprise (optionnel)"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    required 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="newsletter" 
                      name="newsletter" 
                      type="checkbox" 
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="focus:ring-fuchsia-500 h-4 w-4 text-fuchsia-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletter" className="text-gray-700">
                      Je souhaite recevoir la newsletter avec les dernières offres d'emploi et actualités
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="privacy" 
                      name="privacy" 
                      type="checkbox" 
                      required 
                      checked={formData.privacy}
                      onChange={handleInputChange}
                      className="focus:ring-fuchsia-500 h-4 w-4 text-fuchsia-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacy" className="text-gray-700">
                      J'accepte la <a href="#" className="text-fuchsia-600 hover:text-fuchsia-800">politique de confidentialité</a> *
                    </label>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto bg-fuchsia-600 text-white px-4 sm:px-6 py-3 rounded-md hover:bg-fuchsia-700 transition duration-200 font-medium text-sm sm:text-base"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>Envoyer le message
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Phone Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition duration-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-phone text-fuchsia-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Appelez-nous</h3>
                <p className="text-sm text-gray-600 mb-2 sm:mb-3">Du lundi au vendredi, 8h à 18h</p>
                <p className="text-fuchsia-600 font-medium text-sm sm:text-base">+229 XX XX XX XX</p>
              </div>

              {/* Email Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition duration-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-envelope text-green-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Écrivez-nous</h3>
                <p className="text-sm text-gray-600 mb-2 sm:mb-3">Réponse sous 24h en moyenne</p>
                <p className="text-green-600 font-medium text-sm sm:text-base break-all">contact@destinyjobs.careers</p>
              </div>

              {/* Location */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition duration-200 sm:col-span-2 xl:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-map-marker-alt text-purple-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Visitez-nous</h3>
                <p className="text-sm text-gray-600 mb-2 sm:mb-3">Notre siège social</p>
                <p className="text-purple-600 font-medium text-sm sm:text-base">Cotonou, Bénin</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                <i className="fas fa-question-circle mr-2 text-orange-600"></i>
                Questions fréquemment posées
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <button 
                    onClick={() => toggleFAQ('faq1')} 
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">Comment publier une offre d'emploi ?</h3>
                    <i className={`fas fa-chevron-down transform transition-transform flex-shrink-0 ${faqOpen.faq1 ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mt-3 ${faqOpen.faq1 ? 'block' : 'hidden'}`}>
                    <p className="text-sm sm:text-base text-gray-600">Pour publier une offre d'emploi, inscrivez-vous en tant que recruteur, puis accédez à votre tableau de bord pour créer et publier vos annonces. Nos équipes valident chaque offre avant publication.</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <button 
                    onClick={() => toggleFAQ('faq2')} 
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">Comment postuler à une offre ?</h3>
                    <i className={`fas fa-chevron-down transform transition-transform flex-shrink-0 ${faqOpen.faq2 ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mt-3 ${faqOpen.faq2 ? 'block' : 'hidden'}`}>
                    <p className="text-sm sm:text-base text-gray-600">Créez votre profil candidat, complétez votre CV en ligne, puis cliquez sur "Postuler" sur les offres qui vous intéressent. Vous pouvez suivre le statut de vos candidatures depuis votre espace personnel.</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <button 
                    onClick={() => toggleFAQ('faq3')} 
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">Vos services sont-ils gratuits ?</h3>
                    <i className={`fas fa-chevron-down transform transition-transform flex-shrink-0 ${faqOpen.faq3 ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mt-3 ${faqOpen.faq3 ? 'block' : 'hidden'}`}>
                    <p className="text-sm sm:text-base text-gray-600">L'inscription et la recherche d'emploi sont entièrement gratuites pour les candidats. Pour les recruteurs, nous proposons des formules adaptées à tous les budgets, avec une période d'essai gratuite.</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <button 
                    onClick={() => toggleFAQ('faq4')} 
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">Proposez-vous des formations ?</h3>
                    <i className={`fas fa-chevron-down transform transition-transform flex-shrink-0 ${faqOpen.faq4 ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mt-3 ${faqOpen.faq4 ? 'block' : 'hidden'}`}>
                    <p className="text-sm sm:text-base text-gray-600">Oui, nous proposons des formations professionnelles dans différents domaines : informatique, marketing digital, comptabilité, etc. Consultez notre section "Formations" pour voir tous les programmes disponibles.</p>
                  </div>
                </div>

                <div className="pb-3 sm:pb-4">
                  <button 
                    onClick={() => toggleFAQ('faq5')} 
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">Comment obtenir de l'aide technique ?</h3>
                    <i className={`fas fa-chevron-down transform transition-transform flex-shrink-0 ${faqOpen.faq5 ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mt-3 ${faqOpen.faq5 ? 'block' : 'hidden'}`}>
                    <p className="text-sm sm:text-base text-gray-600">Pour toute assistance technique, utilisez le formulaire de contact ci-dessus en sélectionnant "Support technique" ou appelez-nous directement. Notre équipe support est disponible du lundi au vendredi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Sidebar Column */}
      <div className="lg:w-1/3 mt-6 lg:mt-0">
        <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
          {/* Contact Hours */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
              Heures d'ouverture
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Lundi - Vendredi</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base">8h00 - 18h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Samedi</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base">9h00 - 13h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Dimanche</span>
                <span className="font-medium text-red-600 text-sm sm:text-base">Fermé</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              <i className="fas fa-link mr-2 text-green-600"></i>
              Liens utiles
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <Link to="/signup" className="flex items-center text-sm sm:text-base text-gray-600 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-user-plus mr-2 sm:mr-3 text-fuchsia-600 flex-shrink-0"></i>
                <span>Créer un compte candidat</span>
              </Link>

              <Link to="/formations" className="flex items-center text-sm sm:text-base text-gray-600 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-graduation-cap mr-2 sm:mr-3 text-purple-600 flex-shrink-0"></i>
                <span>Nos formations</span>
              </Link>
              <Link to="/blog" className="flex items-center text-sm sm:text-base text-gray-600 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-blog mr-2 sm:mr-3 text-orange-600 flex-shrink-0"></i>
                <span>Blog emploi</span>
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg shadow-sm p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              <i className="fas fa-share-alt mr-2"></i>
              Suivez-nous
            </h3>
            <p className="text-fuchsia-100 mb-3 sm:mb-4 text-sm sm:text-base">Restez connecté pour ne manquer aucune opportunité</p>
            <div className="grid grid-cols-4 gap-2 sm:flex sm:space-x-3">
              <a href="#" className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg hover:bg-opacity-30 transition duration-200 text-center">
                <i className="fab fa-facebook text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg hover:bg-opacity-30 transition duration-200 text-center">
                <i className="fab fa-linkedin text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg hover:bg-opacity-30 transition duration-200 text-center">
                <i className="fab fa-twitter text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg hover:bg-opacity-30 transition duration-200 text-center">
                <i className="fab fa-instagram text-lg sm:text-xl"></i>
              </a>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2 sm:mb-3">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Contact urgent
            </h3>
            <p className="text-red-700 text-xs sm:text-sm mb-2 sm:mb-3">Pour les demandes urgentes en dehors des heures d'ouverture</p>
            <p className="text-red-800 font-medium text-sm sm:text-base">
              <i className="fas fa-phone mr-2"></i>
              +229 XX XX XX XX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
