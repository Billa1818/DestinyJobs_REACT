import React, { useState } from 'react';

const CertificationsSection = () => {
  const [certifications] = useState([
    {
      id: 1,
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      expiry: "2026",
      credentialId: "AWS-123456789",
      image: "https://via.placeholder.com/60x60/ff9900/ffffff?text=AWS",
      status: "active"
    },
    {
      id: 2,
      name: "Microsoft Certified: Azure Developer Associate",
      issuer: "Microsoft",
      date: "2022",
      expiry: "2025",
      credentialId: "MS-987654321",
      image: "https://via.placeholder.com/60x60/0078d4/ffffff?text=Azure",
      status: "active"
    },
    {
      id: 3,
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2021",
      expiry: "2024",
      credentialId: "GC-456789123",
      image: "https://via.placeholder.com/60x60/4285f4/ffffff?text=GCP",
      status: "expired"
    },
    {
      id: 4,
      name: "Certified Scrum Master (CSM)",
      issuer: "Scrum Alliance",
      date: "2020",
      expiry: "2022",
      credentialId: "CSM-789123456",
      image: "https://via.placeholder.com/60x60/00a3bf/ffffff?text=CSM",
      status: "expired"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expirée';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-certificate mr-2 text-fuchsia-600"></i>
          Certifications
        </h3>
        <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={cert.image} 
                  alt={cert.issuer}
                  className="w-15 h-15 rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{cert.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        <i className="fas fa-calendar-alt mr-1"></i>
                        Obtenue: {cert.date}
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        Expire: {cert.expiry}
                      </span>
                      <span>
                        <i className="fas fa-id-card mr-1"></i>
                        ID: {cert.credentialId}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                      {getStatusText(cert.status)}
                    </span>
                    <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded text-sm hover:bg-fuchsia-200 transition duration-200">
                    <i className="fas fa-eye mr-1"></i>Voir
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition duration-200">
                    <i className="fas fa-download mr-1"></i>Télécharger
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition duration-200">
                    <i className="fas fa-share mr-1"></i>Partager
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-transparent border border-fuchsia-600 text-fuchsia-600 px-6 py-2 rounded-lg hover:bg-fuchsia-600 hover:text-white transition duration-200">
          <i className="fas fa-plus mr-2"></i>Ajouter une certification
        </button>
      </div>
    </div>
  );
};

export default CertificationsSection; 