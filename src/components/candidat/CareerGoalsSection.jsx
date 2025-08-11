import React, { useState } from 'react';

const CareerGoalsSection = () => {
  const [careerGoals, setCareerGoals] = useState({
    shortTerm: {
      targetPosition: 'Développeur Full-Stack Senior',
      targetCompany: 'Startup innovante ou entreprise tech',
      targetSalary: 800000,
      timeline: '6-12 mois',
      skillsToDevelop: ['React Native', 'Node.js avancé', 'DevOps'],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional']
    },
    mediumTerm: {
      targetPosition: 'Lead Developer / Tech Lead',
      targetCompany: 'Entreprise tech de taille moyenne',
      targetSalary: 1200000,
      timeline: '2-3 ans',
      skillsToDevelop: ['Gestion d\'équipe', 'Architecture système', 'Agile/Scrum'],
      certifications: ['PMP', 'Scrum Master']
    },
    longTerm: {
      targetPosition: 'CTO / Directeur Technique',
      targetCompany: 'Startup ou entreprise en croissance',
      targetSalary: 2000000,
      timeline: '5-7 ans',
      skillsToDevelop: ['Stratégie business', 'Gestion de portefeuille', 'Innovation'],
      certifications: ['MBA', 'Certification en innovation']
    }
  });

  const [workPreferences, setWorkPreferences] = useState({
    workEnvironment: ['startup', 'remote-first'],
    companySize: ['10-50', '50-200'],
    industry: ['tech', 'fintech', 'healthtech'],
    workStyle: ['collaborative', 'autonomous'],
    growthOpportunities: ['technical', 'leadership', 'entrepreneurial'],
    workLifeBalance: 'important',
    relocation: 'open',
    travel: 'occasional'
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const workEnvironmentOptions = [
    { value: 'startup', label: 'Startup', description: 'Environnement dynamique et innovant' },
    { value: 'scaleup', label: 'Scale-up', description: 'Entreprise en croissance rapide' },
    { value: 'enterprise', label: 'Grande entreprise', description: 'Stabilité et ressources' },
    { value: 'agency', label: 'Agence', description: 'Variété de projets' },
    { value: 'remote-first', label: 'Remote-first', description: 'Travail à distance prioritaire' }
  ];

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employés', description: 'Très petite équipe' },
    { value: '10-50', label: '10-50 employés', description: 'Petite équipe' },
    { value: '50-200', label: '50-200 employés', description: 'Équipe moyenne' },
    { value: '200-1000', label: '200-1000 employés', description: 'Grande équipe' },
    { value: '1000+', label: '1000+ employés', description: 'Très grande entreprise' }
  ];

  const industryOptions = [
    { value: 'tech', label: 'Technologie', description: 'SaaS, plateformes, outils' },
    { value: 'fintech', label: 'Fintech', description: 'Services financiers innovants' },
    { value: 'healthtech', label: 'Healthtech', description: 'Technologies de santé' },
    { value: 'edtech', label: 'Edtech', description: 'Technologies éducatives' },
    { value: 'ecommerce', label: 'E-commerce', description: 'Commerce en ligne' },
    { value: 'ai-ml', label: 'IA/ML', description: 'Intelligence artificielle' }
  ];

  const workStyleOptions = [
    { value: 'collaborative', label: 'Collaboratif', description: 'Travail en équipe' },
    { value: 'autonomous', label: 'Autonome', description: 'Travail indépendant' },
    { value: 'mentoring', label: 'Mentorat', description: 'Encadrement d\'équipe' },
    { value: 'research', label: 'Recherche', description: 'Innovation et R&D' }
  ];

  const handleCareerGoalChange = (period, field, value) => {
    setCareerGoals(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: value
      }
    }));
  };

  const handleWorkPreferenceChange = (field, value) => {
    if (Array.isArray(workPreferences[field])) {
      // Gérer les sélections multiples
      const currentValues = workPreferences[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setWorkPreferences(prev => ({ ...prev, [field]: newValues }));
    } else {
      setWorkPreferences(prev => ({ ...prev, [field]: value }));
    }
  };

  const getTimelineColor = (timeline) => {
    if (timeline.includes('6-12') || timeline.includes('1-2')) return 'text-green-600 bg-green-100';
    if (timeline.includes('2-3') || timeline.includes('3-5')) return 'text-yellow-600 bg-yellow-100';
    if (timeline.includes('5-7') || timeline.includes('7+')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSalaryRange = (salary) => {
    if (salary < 500000) return 'Débutant';
    if (salary < 800000) return 'Intermédiaire';
    if (salary < 1200000) return 'Senior';
    if (salary < 2000000) return 'Expert';
    return 'Leader';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-bullseye mr-2 text-fuchsia-600"></i>
          Objectifs de carrière & Préférences
        </h3>
        <button 
          onClick={() => setShowEditForm(!showEditForm)}
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200"
        >
          <i className="fas fa-edit mr-2"></i>Modifier
        </button>
      </div>

      {/* Career Goals */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Objectifs de carrière</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Short Term Goals */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-green-800">Court terme (6-12 mois)</h5>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {careerGoals.shortTerm.timeline}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-green-700 uppercase">Poste cible</label>
                <p className="text-sm text-green-900 font-medium">{careerGoals.shortTerm.targetPosition}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-green-700 uppercase">Type d'entreprise</label>
                <p className="text-sm text-green-900">{careerGoals.shortTerm.targetCompany}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-green-700 uppercase">Salaire cible</label>
                <p className="text-sm text-green-900 font-medium">
                  {careerGoals.shortTerm.targetSalary.toLocaleString()} XOF
                </p>
                <p className="text-xs text-green-600">{getSalaryRange(careerGoals.shortTerm.targetSalary)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-green-700 uppercase">Compétences à développer</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerGoals.shortTerm.skillsToDevelop.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medium Term Goals */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-yellow-800">Moyen terme (2-3 ans)</h5>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {careerGoals.mediumTerm.timeline}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-yellow-700 uppercase">Poste cible</label>
                <p className="text-sm text-yellow-900 font-medium">{careerGoals.mediumTerm.targetPosition}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-yellow-700 uppercase">Type d'entreprise</label>
                <p className="text-sm text-yellow-900">{careerGoals.mediumTerm.targetCompany}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-yellow-700 uppercase">Salaire cible</label>
                <p className="text-sm text-yellow-900 font-medium">
                  {careerGoals.mediumTerm.targetSalary.toLocaleString()} XOF
                </p>
                <p className="text-xs text-yellow-600">{getSalaryRange(careerGoals.mediumTerm.targetSalary)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-yellow-700 uppercase">Compétences à développer</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerGoals.mediumTerm.skillsToDevelop.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Long Term Goals */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-blue-800">Long terme (5-7 ans)</h5>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {careerGoals.longTerm.timeline}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-blue-700 uppercase">Poste cible</label>
                <p className="text-sm text-blue-900 font-medium">{careerGoals.longTerm.targetPosition}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-blue-700 uppercase">Type d'entreprise</label>
                <p className="text-sm text-blue-900">{careerGoals.longTerm.targetCompany}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-blue-700 uppercase">Salaire cible</label>
                <p className="text-sm text-blue-900 font-medium">
                  {careerGoals.longTerm.targetSalary.toLocaleString()} XOF
                </p>
                <p className="text-xs text-blue-600">{getSalaryRange(careerGoals.longTerm.targetSalary)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-blue-700 uppercase">Compétences à développer</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerGoals.longTerm.skillsToDevelop.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Preferences */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Préférences de travail</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment & Company */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Environnement de travail
              </label>
              <div className="space-y-2">
                {workEnvironmentOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={workPreferences.workEnvironment.includes(option.value)}
                      onChange={() => handleWorkPreferenceChange('workEnvironment', option.value)}
                      className="mt-1 text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille de l'entreprise
              </label>
              <div className="space-y-2">
                {companySizeOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={workPreferences.companySize.includes(option.value)}
                      onChange={() => handleWorkPreferenceChange('companySize', option.value)}
                      className="mt-1 text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Industry & Work Style */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteurs d'activité
              </label>
              <div className="space-y-2">
                {industryOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={workPreferences.industry.includes(option.value)}
                      onChange={() => handleWorkPreferenceChange('industry', option.value)}
                      className="mt-1 text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style de travail
              </label>
              <div className="space-y-2">
                {workStyleOptions.map((option) => (
                  <label key={option.value} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={workPreferences.workStyle.includes(option.value)}
                      onChange={() => handleWorkPreferenceChange('workStyle', option.value)}
                      className="mt-1 text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Other Preferences */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opportunités de croissance
            </label>
            <div className="space-y-2">
              {['technical', 'leadership', 'entrepreneurial'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={workPreferences.growthOpportunities.includes(option)}
                    onChange={() => handleWorkPreferenceChange('growthOpportunities', option)}
                    className="text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                  />
                  <span className="text-sm text-gray-900 capitalize">
                    {option === 'technical' ? 'Technique' : option === 'leadership' ? 'Leadership' : 'Entrepreneuriat'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équilibre vie-travail
            </label>
            <select
              value={workPreferences.workLifeBalance}
              onChange={(e) => handleWorkPreferenceChange('workLifeBalance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="very-important">Très important</option>
              <option value="important">Important</option>
              <option value="moderate">Modéré</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobilité géographique
            </label>
            <select
              value={workPreferences.relocation}
              onChange={(e) => handleWorkPreferenceChange('relocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="open">Ouvert</option>
              <option value="prefer-local">Préfère local</option>
              <option value="specific-cities">Villes spécifiques</option>
              <option value="not-interested">Pas intéressé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Progress */}
      <div className="mt-8 p-4 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg border border-fuchsia-200">
        <h4 className="font-medium text-fuchsia-900 mb-3">Progression de carrière</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-fuchsia-600">75%</div>
            <div className="text-sm text-fuchsia-700">Objectifs court terme</div>
            <div className="w-full bg-fuchsia-200 rounded-full h-2 mt-2">
              <div className="bg-fuchsia-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">45%</div>
            <div className="text-sm text-purple-700">Objectifs moyen terme</div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">25%</div>
            <div className="text-sm text-indigo-700">Objectifs long terme</div>
            <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Conseils pour vos objectifs de carrière</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Définissez des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels)</li>
              <li>• Mettez à jour régulièrement vos objectifs selon votre évolution</li>
              <li>• Identifiez les compétences clés nécessaires pour atteindre vos objectifs</li>
              <li>• Créez un plan d'action concret avec des étapes intermédiaires</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGoalsSection; 