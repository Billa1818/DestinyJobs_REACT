import React, { useState } from 'react';

const RecommendationsSection = () => {
  const [recommendations] = useState([
    {
      id: 1,
      name: "Marie Konan",
      position: "Directrice Technique",
      company: "TechCorp",
      avatar: "https://via.placeholder.com/50x50/fuchsia-100/fuchsia-800?text=MK",
      text: "Jean est un développeur exceptionnel avec une excellente capacité d'apprentissage. Il a contribué significativement à nos projets et a toujours fait preuve de professionnalisme.",
      rating: 5,
      date: "2023",
      status: "verified"
    },
    {
      id: 2,
      name: "Pierre Agbeko",
      position: "Lead Developer",
      company: "StartupBJ",
      avatar: "https://via.placeholder.com/50x50/green-100/green-800?text=PA",
      text: "Collaborer avec Jean a été une expérience enrichissante. Sa maîtrise technique et sa capacité à résoudre des problèmes complexes en font un atout précieux pour toute équipe.",
      rating: 5,
      date: "2022",
      status: "verified"
    },
    {
      id: 3,
      name: "Sarah Mensah",
      position: "Product Manager",
      company: "Digital Solutions",
      avatar: "https://via.placeholder.com/50x50/blue-100/blue-800?text=SM",
      text: "Jean a une excellente compréhension des besoins utilisateurs et sait traduire les exigences en solutions techniques efficaces. Un partenaire de développement fiable.",
      rating: 4,
      date: "2021",
      status: "pending"
    }
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    message: ''
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      ></i>
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Vérifiée</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">En attente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inconnu</span>;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer la demande
    console.log('Nouvelle demande de recommandation:', newRequest);
    setShowRequestForm(false);
    setNewRequest({
      name: '',
      position: '',
      company: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-thumbs-up mr-2 text-fuchsia-600"></i>
          Recommandations
        </h3>
        <button 
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Demander une recommandation</h4>
          <form onSubmit={handleSubmitRequest} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="text" 
                name="name"
                placeholder="Nom complet"
                value={newRequest.name}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
              <input 
                type="text" 
                name="position"
                placeholder="Poste"
                value={newRequest.position}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
              <input 
                type="text" 
                name="company"
                placeholder="Entreprise"
                value={newRequest.company}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email"
                value={newRequest.email}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
            </div>
            <textarea 
              name="message"
              placeholder="Message personnalisé (optionnel)..."
              value={newRequest.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200"
              >
                Envoyer la demande
              </button>
              <button 
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={rec.avatar} 
                  alt={rec.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                    <p className="text-sm text-gray-600">{rec.position} chez {rec.company}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(rec.status)}
                    <div className="flex">
                      {renderStars(rec.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{rec.date}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{rec.text}</p>
                
                <div className="flex space-x-2">
                  <button className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded text-sm hover:bg-fuchsia-200 transition duration-200">
                    <i className="fas fa-eye mr-1"></i>Voir profil
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition duration-200">
                    <i className="fas fa-share mr-1"></i>Partager
                  </button>
                  {rec.status === 'pending' && (
                    <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition duration-200">
                      <i className="fas fa-clock mr-1"></i>Rappeler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">
          Les recommandations de vos collègues et managers renforcent votre crédibilité auprès des recruteurs
        </p>
        <button 
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-transparent border border-fuchsia-600 text-fuchsia-600 px-6 py-2 rounded-lg hover:bg-fuchsia-600 hover:text-white transition duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          {showRequestForm ? 'Fermer' : 'Demander une recommandation'}
        </button>
      </div>
    </div>
  );
};

export default RecommendationsSection; 