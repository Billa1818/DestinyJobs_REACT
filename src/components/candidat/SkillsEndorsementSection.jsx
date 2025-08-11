import React, { useState } from 'react';

const SkillsEndorsementSection = () => {
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      level: 'Expert',
      years: 4,
      endorsements: 12,
      endorsedBy: ['Marie K.', 'Pierre A.', 'Sarah M.'],
      color: 'bg-blue-100 text-blue-800',
      icon: 'fab fa-react'
    },
    {
      id: 2,
      name: 'Node.js',
      category: 'Backend',
      level: 'Avancé',
      years: 3,
      endorsements: 8,
      endorsedBy: ['Marie K.', 'Pierre A.'],
      color: 'bg-green-100 text-green-800',
      icon: 'fab fa-node-js'
    },
    {
      id: 3,
      name: 'Python',
      category: 'Backend',
      level: 'Intermédiaire',
      years: 2,
      endorsements: 5,
      endorsedBy: ['Pierre A.'],
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'fab fa-python'
    },
    {
      id: 4,
      name: 'MongoDB',
      category: 'Database',
      level: 'Avancé',
      years: 3,
      endorsements: 7,
      endorsedBy: ['Marie K.', 'Sarah M.'],
      color: 'bg-green-100 text-green-800',
      icon: 'fas fa-database'
    },
    {
      id: 5,
      name: 'Docker',
      category: 'DevOps',
      level: 'Intermédiaire',
      years: 1,
      endorsements: 3,
      endorsedBy: ['Marie K.'],
      color: 'bg-blue-100 text-blue-800',
      icon: 'fab fa-docker'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'Intermédiaire',
    years: 1
  });

  const categories = [
    'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Design', 'Autre'
  ];

  const levels = [
    { value: 'Débutant', color: 'bg-gray-100 text-gray-800' },
    { value: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Avancé', color: 'bg-green-100 text-green-800' },
    { value: 'Expert', color: 'bg-blue-100 text-blue-800' }
  ];

  const getLevelColor = (level) => {
    const found = levels.find(l => l.value === level);
    return found ? found.color : 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSkill.name && newSkill.category) {
      const skill = {
        id: Date.now(),
        name: newSkill.name,
        category: newSkill.category,
        level: newSkill.level,
        years: parseInt(newSkill.years),
        endorsements: 0,
        endorsedBy: [],
        color: getLevelColor(newSkill.level),
        icon: 'fas fa-code'
      };
      
      setSkills(prev => [...prev, skill]);
      setNewSkill({ name: '', category: '', level: 'Intermédiaire', years: 1 });
      setShowAddForm(false);
    }
  };

  const endorseSkill = (skillId) => {
    setSkills(prev => 
      prev.map(skill => 
        skill.id === skillId 
          ? { ...skill, endorsements: skill.endorsements + 1 }
          : skill
      )
    );
  };

  const removeSkill = (skillId) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-code mr-2 text-fuchsia-600"></i>
          Compétences & Endossements
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Add New Skill Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Ajouter une compétence</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="text" 
                name="name"
                placeholder="Nom de la compétence"
                value={newSkill.name}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
              
              <select 
                name="category"
                value={newSkill.category}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                name="level"
                value={newSkill.level}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.value}</option>
                ))}
              </select>
              
              <input 
                type="number" 
                name="years"
                placeholder="Années d'expérience"
                value={newSkill.years}
                onChange={handleInputChange}
                min="0"
                max="20"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200"
              >
                Ajouter
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <i className="fas fa-folder mr-2 text-fuchsia-600"></i>
              {category}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${skill.color}`}>
                        <i className={`${skill.icon} text-sm`}></i>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{skill.name}</h5>
                        <p className="text-xs text-gray-500">{skill.years} an(s)</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Supprimer"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                    
                    <button
                      onClick={() => endorseSkill(skill.id)}
                      className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium"
                      title="Endosser cette compétence"
                    >
                      <i className="fas fa-thumbs-up mr-1"></i>
                      {skill.endorsements}
                    </button>
                  </div>
                  
                  {skill.endorsedBy.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Endossée par: {skill.endorsedBy.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-fuchsia-600">{skills.length}</div>
            <div className="text-sm text-gray-500">Compétences</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {skills.reduce((sum, skill) => sum + skill.endorsements, 0)}
            </div>
            <div className="text-sm text-gray-500">Endossements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {skills.filter(skill => skill.level === 'Expert').length}
            </div>
            <div className="text-sm text-gray-500">Expert</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(skills.map(skill => skill.category)).size}
            </div>
            <div className="text-sm text-gray-500">Catégories</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Conseils pour vos compétences</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ajoutez des compétences pertinentes pour votre secteur d'activité</li>
              <li>• Demandez des endossements à vos collègues et managers</li>
              <li>• Mettez à jour régulièrement votre niveau d'expertise</li>
              <li>• Organisez vos compétences par catégorie pour plus de clarté</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsEndorsementSection; 