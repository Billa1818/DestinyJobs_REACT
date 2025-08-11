import React, { useState } from 'react';

const SocialNetworksSection = () => {
  const [socialLinks, setSocialLinks] = useState([
    {
      id: 1,
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/jeandupont',
      username: 'jeandupont',
      icon: 'fab fa-linkedin',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      isPublic: true,
      followers: 1250
    },
    {
      id: 2,
      platform: 'GitHub',
      url: 'https://github.com/jeandupont',
      username: 'jeandupont',
      icon: 'fab fa-github',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
      isPublic: true,
      followers: 890
    },
    {
      id: 3,
      platform: 'Twitter',
      url: 'https://twitter.com/jeandupont',
      username: '@jeandupont',
      icon: 'fab fa-twitter',
      color: 'text-blue-400',
      bgColor: 'bg-blue-100',
      isPublic: false,
      followers: 450
    },
    {
      id: 4,
      platform: 'Portfolio',
      url: 'https://jeandupont.dev',
      username: 'jeandupont.dev',
      icon: 'fas fa-globe',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isPublic: true,
      followers: null
    },
    {
      id: 5,
      platform: 'Medium',
      url: 'https://medium.com/@jeandupont',
      username: '@jeandupont',
      icon: 'fab fa-medium',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      isPublic: true,
      followers: 320
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: '',
    url: '',
    username: '',
    isPublic: true
  });

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin', color: 'text-blue-600' },
    { value: 'github', label: 'GitHub', icon: 'fab fa-github', color: 'text-gray-800' },
    { value: 'twitter', label: 'Twitter', icon: 'fab fa-twitter', color: 'text-blue-400' },
    { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook', color: 'text-blue-600' },
    { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-600' },
    { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', color: 'text-red-600' },
    { value: 'medium', label: 'Medium', icon: 'fab fa-medium', color: 'text-green-600' },
    { value: 'portfolio', label: 'Portfolio', icon: 'fas fa-globe', color: 'text-purple-600' },
    { value: 'blog', label: 'Blog', icon: 'fas fa-blog', color: 'text-orange-600' },
    { value: 'other', label: 'Autre', icon: 'fas fa-link', color: 'text-gray-600' }
  ];

  const getPlatformIcon = (platform) => {
    const found = platforms.find(p => p.value === platform);
    return found ? found.icon : 'fas fa-link';
  };

  const getPlatformColor = (platform) => {
    const found = platforms.find(p => p.value === platform);
    return found ? found.color : 'text-gray-600';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLink(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLink.platform && newLink.url) {
      const platform = platforms.find(p => p.value === newLink.platform);
      const link = {
        id: Date.now(),
        platform: newLink.platform,
        url: newLink.url,
        username: newLink.username || newLink.url.split('/').pop(),
        icon: platform ? platform.icon : 'fas fa-link',
        color: platform ? platform.color : 'text-gray-600',
        bgColor: 'bg-gray-100',
        isPublic: newLink.isPublic,
        followers: null
      };
      
      setSocialLinks(prev => [...prev, link]);
      setNewLink({ platform: '', url: '', username: '', isPublic: true });
      setShowAddForm(false);
    }
  };

  const toggleVisibility = (id) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, isPublic: !link.isPublic } : link
      )
    );
  };

  const deleteLink = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // Ici vous pouvez ajouter une notification de succès
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-share-alt mr-2 text-fuchsia-600"></i>
          Réseaux sociaux & Liens
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Add New Link Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Ajouter un lien</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select 
                name="platform"
                value={newLink.platform}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une plateforme</option>
                {platforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
              
              <input 
                type="url" 
                name="url"
                placeholder="URL du profil"
                value={newLink.url}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
            </div>
            
            <input 
              type="text" 
              name="username"
              placeholder="Nom d'utilisateur (optionnel)"
              value={newLink.username}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="isPublic"
                checked={newLink.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Rendre ce lien public sur mon profil
              </label>
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

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.bgColor}`}>
                  <i className={`${link.icon} ${link.color} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{link.platform}</h4>
                  <p className="text-sm text-gray-600">{link.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleVisibility(link.id)}
                  className={`p-1 rounded ${link.isPublic ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                  title={link.isPublic ? 'Rendre privé' : 'Rendre public'}
                >
                  <i className={`fas ${link.isPublic ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
                <button
                  onClick={() => copyToClipboard(link.url)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Copier le lien"
                >
                  <i className="fas fa-copy"></i>
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-1 text-red-400 hover:text-red-600 rounded"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-sm text-fuchsia-600 hover:text-fuchsia-800 truncate"
              >
                {link.url}
              </a>
              
              {link.followers && (
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-users mr-1"></i>
                  {link.followers.toLocaleString()} abonnés
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  link.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {link.isPublic ? 'Public' : 'Privé'}
                </span>
                
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium"
                >
                  Visiter <i className="fas fa-external-link-alt ml-1"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Conseils pour vos réseaux sociaux</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gardez vos profils LinkedIn et GitHub à jour</li>
              <li>• Partagez régulièrement vos projets et réalisations</li>
              <li>• Interagissez avec votre réseau professionnel</li>
              <li>• Utilisez des hashtags pertinents pour augmenter votre visibilité</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialNetworksSection; 