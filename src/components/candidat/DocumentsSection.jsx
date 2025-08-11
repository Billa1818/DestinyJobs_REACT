import React, { useState } from 'react';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'CV_Jean_Dupont_2024.pdf',
      type: 'CV',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      isPublic: true,
      isDefault: true,
      downloads: 12,
      lastViewed: '2024-01-20'
    },
    {
      id: 2,
      name: 'Lettre_Motivation_Startup.pdf',
      type: 'Lettre de motivation',
      size: '1.1 MB',
      uploadedAt: '2024-01-10',
      isPublic: true,
      isDefault: false,
      downloads: 5,
      lastViewed: '2024-01-18'
    },
    {
      id: 3,
      name: 'Diplome_Master_Informatique.pdf',
      type: 'Diplôme',
      size: '3.2 MB',
      uploadedAt: '2024-01-05',
      isPublic: false,
      isDefault: false,
      downloads: 0,
      lastViewed: null
    },
    {
      id: 4,
      name: 'Certification_AWS_Developer.pdf',
      type: 'Certification',
      size: '1.8 MB',
      uploadedAt: '2024-01-08',
      isPublic: true,
      isDefault: false,
      downloads: 3,
      lastViewed: '2024-01-16'
    },
    {
      id: 5,
      name: 'Portfolio_Projets_2024.pdf',
      type: 'Portfolio',
      size: '5.6 MB',
      uploadedAt: '2024-01-12',
      isPublic: true,
      isDefault: false,
      downloads: 8,
      lastViewed: '2024-01-19'
    }
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes = [
    'CV', 'Lettre de motivation', 'Diplôme', 'Certification', 'Portfolio', 'Référence', 'Autre'
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFile(file);
      // Simuler un upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Ajouter le nouveau document
          const newDocument = {
            id: Date.now(),
            name: file.name,
            type: 'CV', // Par défaut
            size: formatFileSize(file.size),
            uploadedAt: new Date().toISOString().split('T')[0],
            isPublic: true,
            isDefault: false,
            downloads: 0,
            lastViewed: null
          };
          
          setDocuments(prev => [...prev, newDocument]);
          setUploadingFile(null);
          setUploadProgress(0);
          setShowUploadForm(false);
        }
        setUploadProgress(progress);
      }, 200);
    }
  };

  const toggleDocumentVisibility = (id) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc
      )
    );
  };

  const setDefaultDocument = (id) => {
    setDocuments(prev => 
      prev.map(doc => ({
        ...doc,
        isDefault: doc.id === id
      }))
    );
  };

  const deleteDocument = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const downloadDocument = (document) => {
    // Simuler le téléchargement
    console.log(`Téléchargement de ${document.name}`);
    // Ici vous pouvez ajouter la logique de téléchargement réelle
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'CV':
        return 'fas fa-file-alt text-blue-600';
      case 'Lettre de motivation':
        return 'fas fa-envelope text-green-600';
      case 'Diplôme':
        return 'fas fa-graduation-cap text-purple-600';
      case 'Certification':
        return 'fas fa-certificate text-yellow-600';
      case 'Portfolio':
        return 'fas fa-briefcase text-orange-600';
      default:
        return 'fas fa-file text-gray-600';
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'CV':
        return 'bg-blue-100 text-blue-800';
      case 'Lettre de motivation':
        return 'bg-green-100 text-green-800';
      case 'Diplôme':
        return 'bg-purple-100 text-purple-800';
      case 'Certification':
        return 'bg-yellow-100 text-yellow-800';
      case 'Portfolio':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
          Documents & CV
        </h3>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200"
        >
          <i className="fas fa-upload mr-2"></i>Ajouter un document
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Ajouter un nouveau document</h4>
          
          {uploadingFile ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-file text-fuchsia-600"></i>
                <span className="text-sm text-gray-700">{uploadingFile.name}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-fuchsia-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                {Math.round(uploadProgress)}% terminé
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-fuchsia-400 transition duration-200">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                  <div className="text-sm text-gray-600">
                    <span className="text-fuchsia-600 hover:text-fuchsia-700 font-medium">
                      Cliquez pour sélectionner un fichier
                    </span> ou glissez-déposez
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX jusqu'à 10 MB
                  </div>
                </label>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className={`${getDocumentIcon(document.type)} text-xl`}></i>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{document.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(document.type)}`}>
                        {document.type}
                      </span>
                      <span>{document.size}</span>
                      <span>Ajouté le {new Date(document.uploadedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {document.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Par défaut
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      document.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {document.isPublic ? 'Public' : 'Privé'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span>
                    <i className="fas fa-download mr-1"></i>
                    {document.downloads} téléchargements
                  </span>
                  {document.lastViewed && (
                    <span>
                      <i className="fas fa-eye mr-1"></i>
                      Vu le {new Date(document.lastViewed).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadDocument(document)}
                    className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded text-sm hover:bg-fuchsia-200 transition duration-200"
                  >
                    <i className="fas fa-download mr-1"></i>Télécharger
                  </button>
                  
                  {!document.isDefault && (
                    <button 
                      onClick={() => setDefaultDocument(document.id)}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition duration-200"
                    >
                      <i className="fas fa-star mr-1"></i>Définir par défaut
                    </button>
                  )}
                  
                  <button 
                    onClick={() => toggleDocumentVisibility(document.id)}
                    className={`px-3 py-1 rounded text-sm transition duration-200 ${
                      document.isPublic 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <i className={`fas ${document.isPublic ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                    {document.isPublic ? 'Rendre privé' : 'Rendre public'}
                  </button>
                  
                  <button 
                    onClick={() => deleteDocument(document.id)}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition duration-200"
                  >
                    <i className="fas fa-trash mr-1"></i>Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-fuchsia-600">{documents.length}</div>
            <div className="text-sm text-gray-500">Documents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(doc => doc.isPublic).length}
            </div>
            <div className="text-sm text-gray-500">Publics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
            </div>
            <div className="text-sm text-gray-500">Téléchargements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {documents.filter(doc => doc.type === 'CV').length}
            </div>
            <div className="text-sm text-gray-500">CV</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Conseils pour vos documents</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gardez votre CV à jour avec vos dernières expériences</li>
              <li>• Personnalisez vos lettres de motivation selon les postes</li>
              <li>• Rendez publics les documents qui peuvent impressionner les recruteurs</li>
              <li>• Organisez vos documents par type pour une meilleure gestion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection; 