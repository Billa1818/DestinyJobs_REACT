import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TermePolitiqueConfidentialite = () => {
  const [activeTab, setActiveTab] = useState('mentions');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            Mentions Légales & Politique de Confidentialité
          </h1>
          <p className="text-gray-600 text-sm">Dernière mise à jour : Janvier 2026 - Version 1.0</p>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6 text-sm">
          <button
            onClick={() => setActiveTab('mentions')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'mentions'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Mentions Légales
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Politique de Confidentialité
          </button>
          <button
            onClick={() => setActiveTab('conditions')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'conditions'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Conditions d'Utilisation
          </button>
          <button
            onClick={() => setActiveTab('exclusion')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'exclusion'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Exclusion de Responsabilité
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'copyright'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Droit d'Auteur
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Mentions Légales Section */}
        {activeTab === 'mentions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Mentions Légales
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Informations sur l'Entreprise
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>DestinyJobs</strong> est une plateforme de recrutement et de mise en relation entre candidats, recruteurs et prestataires de services.
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li><strong>Responsable de la publication :</strong> DestinyJobs</li>
                  <li><strong>Adresse :</strong> Parakou, Bénin</li>
                  <li><strong>Email :</strong> contact@destinyjobs.net</li>
                  <li><strong>Téléphone :</strong> 229 01 56 56 61 86</li>
                  <li><strong>Numéro RCCM :</strong> RB/PKO/23 B 1016</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Hébergement du Site
                </h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li><strong>Hébergeur :</strong> LWS</li>
                  <li><strong>Contact :</strong> contact@lws.fr</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Propriété Intellectuelle
                </h3>
                <p className="text-gray-700">
                  Le contenu du site (textes, images, logos, code source) est la propriété exclusive de DestinyJobs ou de ses partenaires. Toute reproduction, modification ou exploitation sans autorisation est strictement interdite.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Section */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Politique de Confidentialité
            </h2>
            
            <div className="space-y-4">
              {/* Section 1 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('collecte')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    1. Collecte et Traitement des Données
                  </h3>
                  {expandedSections['collecte'] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {expandedSections['collecte'] && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Pour les Candidats :</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                        <li>Identité complète (nom, prénom, email)</li>
                        <li>Numéro de téléphone et adresse postale</li>
                        <li>Informations professionnelles (CV, expériences, compétences)</li>
                        <li>Éducation et diplômes</li>
                        <li>Préférences de salaire et géographiques</li>
                        <li>Documents d'application (portfolio, certifications)</li>
                        <li>Historique de candidatures et statistiques</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Pour les Recruteurs :</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                        <li>Identité et informations d'entreprise</li>
                        <li>Données professionnelles (secteur, taille)</li>
                        <li>Informations de paiement et facturation</li>
                        <li>Offres d'emploi publiées</li>
                        <li>Historique des candidatures reçues</li>
                        <li>Communications avec les candidats</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Pour tous les utilisateurs :</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                        <li>Adresse IP et géolocalisation</li>
                        <li>Données de session et cookies</li>
                        <li>Historique de navigation</li>
                        <li>Données d'appareil (navigateur, OS)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('utilisation')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    2. Utilisation des Données
                  </h3>
                  {expandedSections['utilisation'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections['utilisation'] && (
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-700">Les données sont utilisées pour :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Fourniture des services de matchmaking candidat/offre</li>
                      <li>Analyse de compatibilité et calcul de scores IA</li>
                      <li>Sécurité et détection de fraude</li>
                      <li>Conformité légale</li>
                      <li>Statistiques et analytics (anonymisées)</li>
                      <li>Traçabilité pour audit et support</li>
                    </ul>
                    <p className="text-gray-700 mt-2"><strong>Les données ne sont jamais vendues à des tiers commerciaux.</strong></p>
                  </div>
                )}
              </div>

              {/* Section 3 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('retention')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    3. Durée de Rétention
                  </h3>
                  {expandedSections['retention'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections['retention'] && (
                  <div className="mt-3">
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Comptes actifs : tant que le compte est actif</li>
                      <li>Données de candidature : 5 ans après fin du processus</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Section 4 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('droits')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    4. Vos Droits (RGPD/CNIL)
                  </h3>
                  {expandedSections['droits'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections['droits'] && (
                  <div className="mt-3">
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Droit d'accès : accéder à vos données personnelles</li>
                      <li>Droit de rectification : corriger des données inexactes</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                      Pour exercer ces droits, contactez : <span className="text-gray-600 font-medium">support@destinyjobs.net</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Section 5 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('securite')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    5. Sécurité des Données
                  </h3>
                  {expandedSections['securite'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections['securite'] && (
                  <div className="mt-3">
                    <p className="text-gray-700 mb-2">Mesures de sécurité implémentées :</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Chiffrement HTTPS</li>
                      <li>JWT Tokens pour authentification</li>
                      <li>Validation des données côté serveur</li>
                      <li>Gestion des accès par rôle</li>
                      <li>Logs de sécurité et audit trail</li>
                      <li>Protection CSRF et sécurité HTTP</li>
                    </ul>
                    <p className="text-gray-700 mt-2 font-medium">
                      Aucune transmission sur internet n'est 100% sécurisée. DestinyJobs ne peut garantir une sécurité absolue.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 6 */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleSection('cookies')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-600">
                    6. Cookies et Technologies
                  </h3>
                  {expandedSections['cookies'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections['cookies'] && (
                  <div className="mt-3">
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>Cookies de session : gestion d'authentification</li>
                      <li>Cookies d'authentification : maintien de connexion</li>
                      <li>Cookies d'analyse : amélioration des services</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Conditions d'Utilisation Section */}
        {activeTab === 'conditions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Conditions d'Utilisation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  1. Acceptation des Conditions
                </h3>
                <p className="text-gray-700">
                  En accédant et en utilisant DestinyJobs, vous acceptez ces conditions d'utilisation intégralement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  2. Utilisation Autorisée
                </h3>
                <p className="text-gray-700 mb-2">Vous vous engagez à :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Fournir des informations exactes et complètes</li>
                  <li>Respecter toutes les lois applicables</li>
                  <li>Ne pas violer les droits d'autrui</li>
                  <li>Ne pas utiliser le site à des fins frauduleuses</li>
                  <li>Ne pas harceler, menacer ou discriminer</li>
                  <li>Ne pas publier du contenu offensant ou illégal</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  3. Interdictions Strictes
                </h3>
                <p className="text-gray-700 mb-2">Sont strictement interdits :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Toute forme de discrimination</li>
                  <li>Le harcèlement ou les menaces</li>
                  <li>La fraude ou la tromperie</li>
                  <li>L'utilisation abusive de la plateforme</li>
                  <li>La violation de droits d'auteur</li>
                  <li>Le spam ou envois massifs</li>
                  <li>L'injection de code malveillant</li>
                  <li>Le scraping ou extraction de données</li>
                  <li>Le piratage de compte</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  4. Modération
                </h3>
                <p className="text-gray-700 mb-2">DestinyJobs se réserve le droit de :</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Modérer les contenus</li>
                  <li>Supprimer les messages inappropriés</li>
                  <li>Suspendre ou fermer les comptes violant ces conditions</li>
                  <li>Signaler aux autorités en cas d'activité criminelle</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Exclusion de Responsabilité Section */}
        {activeTab === 'exclusion' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Exclusion de Responsabilité
            </h2>
            
            <div className="bg-gray-50 border-l-4 border-gray-600 p-3 mb-4">
              <p className="font-bold text-gray-800 mb-1">⚠️ AVIS IMPORTANT</p>
              <p className="text-gray-700">
                DestinyJobs et ses dirigeants, employés, prestataires n'acceptent <strong>AUCUNE RESPONSABILITÉ</strong> concernant :
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  1. Contenu des Utilisateurs
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Les informations fournies par les utilisateurs</li>
                  <li>L'exactitude des offres d'emploi</li>
                  <li>Les CV et documents téléchargés</li>
                  <li>Les comportements entre utilisateurs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  2. Matchmaking et Recommandations IA
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>La pertinence des scores de compatibilité</li>
                  <li>Les recommandations d'offres ou candidats</li>
                  <li>Les erreurs des algorithmes IA</li>
                  <li>L'indisponibilité du service d'IA</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  3. Recrutement et Contrats
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Les décisions de recrutement</li>
                  <li>Les conditions de travail</li>
                  <li>Les litiges entre parties</li>
                  <li>La validation des qualifications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  4. Paiements et Sécurité
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Les transactions (responsabilité Stripe/FedaPay)</li>
                  <li>Les fraudes ou usurpations</li>
                  <li>Les violations de sécurité externes</li>
                  <li>La perte de données</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <p className="font-bold text-red-800 mb-2">Limitation de Responsabilité</p>
                <p className="text-gray-700">
                  <strong>LA RESPONSABILITÉ TOTALE DE DESTINYJOBS EST LIMITÉE À ZÉRO (0).</strong>
                </p>
                <p className="text-gray-700 mt-2">
                  Le service est fourni "EN L'ÉTAT" sans aucune garantie d'exactitude, de disponibilité, de qualité ou de sécurité absolue.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Droit d'Auteur Section */}
        {activeTab === 'copyright' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Droit d'Auteur et Propriété Intellectuelle
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Propriété Intellectuelle
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Le code source, design et logos sont protégés par le droit d'auteur</li>
                  <li>Les modèles IA conservent leurs licences respectives</li>
                  <li>Les contenus utilisateurs restent leur propriété</li>
                  <li>L'utilisation sur le site est autorisée à titre de licence révocable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Licences Logicielles
                </h3>
                <ul className="text-gray-700 space-y-1 ml-2">
                  <li><strong>Django :</strong> BSD 3-Clause</li>
                  <li><strong>Django REST Framework :</strong> BSD 2-Clause</li>
                  <li><strong>Sentence Transformers :</strong> Apache 2.0</li>
                  <li><strong>PyTorch :</strong> BSD</li>
                  <li><strong>Celery :</strong> BSD</li>
                  <li><strong>Redis :</strong> SSPL</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Attribution
                </h3>
                <p className="text-gray-700">
                  Toute utilisation commerciale de la plateforme requiert une attribution claire.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Contact
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Pour toute question ou réclamation
                </h3>
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <p className="text-gray-700">
                    <strong>Email général :</strong> <span className="text-gray-600">contact@destinyjobs.net</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Support :</strong> <span className="text-gray-600">support@destinyjobs.net</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Téléphone :</strong> <span className="text-gray-600">229 01 56 56 61 86</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Adresse :</strong> Parakou, Bénin
                  </p>
                </div>
                <p className="text-gray-600 mt-3">
                  Les demandes seront traitées sous 30 jours.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  ⚠️ Points Clés à Retenir
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>DestinyJobs n'est responsable de rien</li>
                  <li>Vous devez vérifier vous-même les informations</li>
                  <li>Vos données sont collectées pour améliorer le service</li>
                  <li>Aucune garantie sur la qualité ou sécurité absolue</li>
                  <li>Les paiements sont traités par des tiers</li>
                  <li>Vous avez des droits : accès, suppression, rectification</li>
                  <li>La discrimination est strictement interdite</li>
                  <li>Signalez les abus à support@destinyjobs.net</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-700 font-medium">
                  En utilisant DestinyJobs, vous acceptez l'intégralité de ces conditions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermePolitiqueConfidentialite;