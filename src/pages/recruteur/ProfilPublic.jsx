import React from 'react';

const ProfilPublic = () => {
    return (
        <>
            {/* Main Content Area */}
            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                    
                    {/* Company Header Section */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        {/* Cover Image */}
                        <div className="h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 relative">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            <div className="absolute bottom-4 left-4 sm:left-6">
                                <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">TechCorp Solutions</h1>
                                <p className="text-white text-sm sm:text-base opacity-90">Innovation • Excellence • Avenir</p>
                            </div>
                        </div>
                        
                        {/* Company Basic Info */}
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg shadow-md border-4 border-white -mt-8 relative z-10 flex items-center justify-center">
                                        <img src="https://via.placeholder.com/80x80/6366f1/ffffff?text=TC" alt="TechCorp Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
                                    </div>
                                    <div className="pt-2">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">TechCorp Solutions SARL</h2>
                                        <p className="text-gray-600 text-sm sm:text-base">Développement logiciel & Services IT</p>
                                        <div className="flex items-center mt-2">
                                            <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                                            <span className="text-gray-600 text-sm">Cotonou, Littoral, Bénin</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                                        <i className="fas fa-plus mr-2"></i>Suivre
                                    </button>
                                    <button className="border border-gray-300 hover:border-fuchsia-600 text-gray-700 hover:text-fuchsia-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                                        <i className="fas fa-share-alt mr-2"></i>Partager
                                    </button>
                                </div>
                            </div>
                            
                            {/* Company Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-fuchsia-600">150+</div>
                                    <div className="text-sm text-gray-600">Employés</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-fuchsia-600">12</div>
                                    <div className="text-sm text-gray-600">Offres actives</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-fuchsia-600">8</div>
                                    <div className="text-sm text-gray-600">Années d'expérience</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-fuchsia-600">4.8/5</div>
                                    <div className="text-sm text-gray-600">Note moyenne</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* About Section */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">À propos de nous</h3>
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <p className="mb-4">
                                        TechCorp Solutions est une entreprise leader dans le développement de solutions logicielles innovantes en Afrique de l'Ouest. Fondée en 2016, nous nous spécialisons dans la création d'applications web et mobiles, l'intégration de systèmes et la transformation digitale des entreprises.
                                    </p>
                                    <p className="mb-4">
                                        Notre mission est d'accompagner les entreprises africaines dans leur transition numérique en proposant des solutions technologiques adaptées aux réalités locales. Nous croyons fermement que la technologie peut être un levier de développement économique et social pour notre continent.
                                    </p>
                                    <p>
                                        Avec une équipe de plus de 150 professionnels passionnés, nous avons accompagné plus de 200 entreprises dans leur transformation digitale, de la startup locale aux grandes corporations internationales.
                                    </p>
                                </div>
                            </div>

                            {/* Services Section */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Nos Services</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-code text-fuchsia-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Développement Web</h4>
                                            <p className="text-sm text-gray-600">Applications web modernes et responsives</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-mobile-alt text-fuchsia-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Applications Mobile</h4>
                                            <p className="text-sm text-gray-600">Apps iOS et Android natives</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-cloud text-fuchsia-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Solutions Cloud</h4>
                                            <p className="text-sm text-gray-600">Infrastructure et migration cloud</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-shield-alt text-fuchsia-600"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Cybersécurité</h4>
                                            <p className="text-sm text-gray-600">Protection et audit de sécurité</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Job Offers */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Offres d'emploi actuelles</h3>
                                    <a href="#" className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium">Voir tout</a>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Job Offer 1 */}
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-fuchsia-300 transition duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Développeur Full Stack Senior</h4>
                                                <p className="text-sm text-gray-600">CDI • Remote/Hybride • 3-5 ans d'expérience</p>
                                            </div>
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Nouveau</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-3">Rejoignez notre équipe pour développer des solutions web innovantes avec React, Node.js et MongoDB.</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span><i className="fas fa-map-marker-alt mr-1"></i>Cotonou</span>
                                                <span><i className="fas fa-clock mr-1"></i>Il y a 2 jours</span>
                                            </div>
                                            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                                                Voir l'offre
                                            </button>
                                        </div>
                                    </div>

                                    {/* Job Offer 2 */}
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-fuchsia-300 transition duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Chef de Projet Digital</h4>
                                                <p className="text-sm text-gray-600">CDI • Sur site • 5+ ans d'expérience</p>
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Urgent</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-3">Pilotez nos projets de transformation digitale et managez une équipe de développeurs talentueux.</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span><i className="fas fa-map-marker-alt mr-1"></i>Cotonou</span>
                                                <span><i className="fas fa-clock mr-1"></i>Il y a 1 semaine</span>
                                            </div>
                                            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                                                Voir l'offre
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team & Culture */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Notre équipe et culture</h3>
                                
                                {/* Team Photos Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    <div className="aspect-square rounded-lg overflow-hidden">
                                        <img src="https://via.placeholder.com/200x200/f59e0b/ffffff?text=Team" alt="Équipe" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-lg overflow-hidden">
                                        <img src="https://via.placeholder.com/200x200/10b981/ffffff?text=Office" alt="Bureau" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-lg overflow-hidden">
                                        <img src="https://via.placeholder.com/200x200/3b82f6/ffffff?text=Event" alt="Événement" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-lg overflow-hidden">
                                        <img src="https://via.placeholder.com/200x200/ef4444/ffffff?text=Work" alt="Travail" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                
                                {/* Culture Values */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-users text-fuchsia-600 text-sm"></i>
                                        </div>
                                        <span className="text-gray-700">Esprit d'équipe et collaboration</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-lightbulb text-fuchsia-600 text-sm"></i>
                                        </div>
                                        <span className="text-gray-700">Innovation et créativité</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-balance-scale text-fuchsia-600 text-sm"></i>
                                        </div>
                                        <span className="text-gray-700">Équilibre vie professionnelle/personnelle</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-chart-line text-fuchsia-600 text-sm"></i>
                                        </div>
                                        <span className="text-gray-700">Développement professionnel continu</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            
                            {/* Company Details */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de l'entreprise</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-industry text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Secteur</div>
                                            <div className="text-sm text-gray-600">Technologies de l'information</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-building text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Taille</div>
                                            <div className="text-sm text-gray-600">100-200 employés</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-calendar text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Fondée en</div>
                                            <div className="text-sm text-gray-600">2016</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-globe text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Site web</div>
                                            <div className="text-sm text-fuchsia-600">
                                                <a href="#" className="hover:underline">www.techcorp-solutions.com</a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-phone text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Téléphone</div>
                                            <div className="text-sm text-gray-600">+229 21 30 45 67</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <i className="fas fa-envelope text-gray-400 mt-1"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Email</div>
                                            <div className="text-sm text-gray-600">contact@techcorp-solutions.com</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Localisation</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 mb-2">Siège social</div>
                                        <div className="text-sm text-gray-600">
                                            <i className="fas fa-map-marker-alt text-fuchsia-600 mr-2"></i>
                                            Zone Industrielle de Godomey<br />
                                            BP 1234, Cotonou, Bénin
                                        </div>
                                    </div>
                                    
                                    {/* Simple map placeholder */}
                                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <i className="fas fa-map-marked-alt text-2xl mb-2"></i>
                                            <div className="text-sm">Carte interactive</div>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200">
                                        <i className="fas fa-directions mr-2"></i>Obtenir l'itinéraire
                                    </button>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Suivez-nous</h3>
                                <div className="space-y-3">
                                    <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-fuchsia-600 transition duration-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <i className="fab fa-linkedin text-blue-600"></i>
                                        </div>
                                        <span className="text-sm font-medium">LinkedIn</span>
                                    </a>
                                    
                                    <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-fuchsia-600 transition duration-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <i className="fab fa-facebook text-blue-600"></i>
                                        </div>
                                        <span className="text-sm font-medium">Facebook</span>
                                    </a>
                                    
                                    <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-fuchsia-600 transition duration-200">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <i className="fab fa-twitter text-blue-400"></i>
                                        </div>
                                        <span className="text-sm font-medium">Twitter</span>
                                    </a>
                                    
                                    <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-fuchsia-600 transition duration-200">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <i className="fab fa-instagram text-pink-600"></i>
                                        </div>
                                        <span className="text-sm font-medium">Instagram</span>
                                    </a>
                                </div>
                            </div>

                            {/* Reviews/Ratings */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Avis employés</h3>
                                
                                {/* Overall Rating */}
                                <div className="flex items-center mb-4">
                                    <div className="text-3xl font-bold text-fuchsia-600 mr-3">4.8</div>
                                    <div>
                                        <div className="flex text-yellow-400 mb-1">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <div className="text-sm text-gray-600">Basé sur 45 avis</div>
                                    </div>
                                </div>
                                
                                {/* Rating Categories */}
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">Environnement de travail</span>
                                            <span className="text-gray-900 font-medium">4.9</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-fuchsia-600 h-2 rounded-full" style={{width: '98%'}}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">Évolution de carrière</span>
                                            <span className="text-gray-900 font-medium">4.7</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-fuchsia-600 h-2 rounded-full" style={{width: '94%'}}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">Rémunération</span>
                                            <span className="text-gray-900 font-medium">4.6</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-fuchsia-600 h-2 rounded-full" style={{width: '92%'}}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">Management</span>
                                            <span className="text-gray-900 font-medium">4.8</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-fuchsia-600 h-2 rounded-full" style={{width: '96%'}}></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <a href="#" className="block text-center text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium mt-4">
                                    Voir tous les avis
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProfilPublic;
