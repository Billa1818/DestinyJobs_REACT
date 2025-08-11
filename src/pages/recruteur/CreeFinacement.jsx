import React from 'react';

const CreeFinacement = () => {
    return (
        <>
            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
                <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
                    {/* Main Content Column */}
                    <div className="xl:w-full">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        <i className="fas fa-hand-holding-usd mr-2 text-destiny-gold"></i>
                                        Créer une offre de financement
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                        Proposez vos solutions de financement aux entrepreneurs et porteurs de projets
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="bg-destiny-gold bg-opacity-10 p-3 rounded-lg">
                                        <i className="fas fa-coins text-2xl text-destiny-gold"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Funding Creation Form */}
                        <form id="fundingForm" className="space-y-4 sm:space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                                    Informations générales
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="fundingTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre du financement <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" id="fundingTitle" name="fundingTitle" required 
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: Microcrédit pour entrepreneurs femmes" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="fundingType" className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de financement <span className="text-red-500">*</span>
                                        </label>
                                        <select id="fundingType" name="fundingType" required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
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
                                    
                                    <div>
                                        <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                                            Secteur ciblé
                                        </label>
                                        <select id="sector" name="sector"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
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
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-calculator mr-2 text-green-600"></i>
                                    Détails financiers
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant minimum (FCFA) <span className="text-red-500">*</span>
                                        </label>
                                        <input type="number" id="minAmount" name="minAmount" required min="0"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 500000" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant maximum (FCFA) <span className="text-red-500">*</span>
                                        </label>
                                        <input type="number" id="maxAmount" name="maxAmount" required min="0"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 10000000" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Taux d'intérêt (% annuel)
                                        </label>
                                        <input type="number" id="interestRate" name="interestRate" min="0" max="100" step="0.1"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 8.5" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="repaymentPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                                            Durée de remboursement (mois)
                                        </label>
                                        <input type="number" id="repaymentPeriod" name="repaymentPeriod" min="1"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 36" />
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    <label className="flex items-center">
                                        <input type="checkbox" id="noCollateral" name="noCollateral"
                                               className="h-4 w-4 text-destiny-gold focus:ring-destiny-gold border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Sans garantie/caution</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input type="checkbox" id="gracePeriod" name="gracePeriod"
                                               className="h-4 w-4 text-destiny-gold focus:ring-destiny-gold border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Période de grâce disponible</span>
                                    </label>
                                </div>
                            </div>

                            {/* Eligibility Criteria */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-user-check mr-2 text-purple-600"></i>
                                    Critères d'éligibilité
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                                            Public cible <span className="text-red-500">*</span>
                                        </label>
                                        <select id="targetAudience" name="targetAudience" required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
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
                                    
                                    <div>
                                        <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-2">
                                            Âge minimum
                                        </label>
                                        <input type="number" id="minAge" name="minAge" min="18" max="100"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 21" />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label htmlFor="geographicZone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Zone géographique <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" id="geographicZone" name="geographicZone" required
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: Cotonou, Littoral, Bénin ou National" />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-file-alt mr-2 text-indigo-600"></i>
                                    Description du financement
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="fundingDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description détaillée <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id="fundingDescription" name="fundingDescription" rows="6" required
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                                  placeholder="Décrivez en détail votre offre de financement, ses avantages et spécificités..."></textarea>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="eligibilityRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                                            Conditions d'éligibilité <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id="eligibilityRequirements" name="eligibilityRequirements" rows="4" required
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                                  placeholder="Listez les conditions requises, documents à fournir, critères de sélection..."></textarea>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="applicationProcess" className="block text-sm font-medium text-gray-700 mb-2">
                                            Processus de candidature
                                        </label>
                                        <textarea id="applicationProcess" name="applicationProcess" rows="3"
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                                  placeholder="Expliquez les étapes de candidature, délais de traitement, modalités de sélection..."></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Application Settings */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-cog mr-2 text-orange-600"></i>
                                    Paramètres de candidature
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                                            Date limite de candidature
                                        </label>
                                        <input type="date" id="applicationDeadline" name="applicationDeadline"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="maxApplications" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre maximum de candidatures
                                        </label>
                                        <input type="number" id="maxApplications" name="maxApplications" min="1"
                                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                               placeholder="Ex: 100" />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                            Informations de contact <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id="contactInfo" name="contactInfo" rows="2" required
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                                                  placeholder="Email, téléphone, adresse physique pour les candidatures..."></textarea>
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    <label className="flex items-center">
                                        <input type="checkbox" id="businessPlanRequired" name="businessPlanRequired"
                                               className="h-4 w-4 text-destiny-gold focus:ring-destiny-gold border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Plan d'affaires requis</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input type="checkbox" id="financialStatementsRequired" name="financialStatementsRequired"
                                               className="h-4 w-4 text-destiny-gold focus:ring-destiny-gold border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">États financiers requis</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                                        <input type="checkbox" id="urgentFunding" name="urgentFunding"
                                               className="h-4 w-4 text-destiny-gold focus:ring-destiny-gold border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Financement urgent</span>
                                    </label>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button type="button" id="saveDraftBtn" 
                                            className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center justify-center">
                                        <i className="fas fa-save mr-2"></i>
                                        Sauvegarder en brouillon
                                    </button>
                                    
                                    <button type="button" id="previewBtn"
                                            className="flex-1 sm:flex-initial px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 flex items-center justify-center">
                                        <i className="fas fa-eye mr-2"></i>
                                        Aperçu
                                    </button>
                                    
                                    <button type="submit" id="publishBtn"
                                            className="flex-1 sm:flex-initial px-6 py-3 bg-destiny-gold text-white rounded-md hover:bg-yellow-600 transition duration-200 flex items-center justify-center">
                                        <i className="fas fa-paper-plane mr-2"></i>
                                        Publier le financement
                                    </button>
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Votre offre de financement sera examinée par notre équipe avant publication (24-48h)
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CreeFinacement;
