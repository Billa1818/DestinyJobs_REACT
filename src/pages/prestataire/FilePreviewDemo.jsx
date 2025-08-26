import React, { useState } from 'react';

const FilePreviewDemo = () => {
  const [files, setFiles] = useState({
    image: null,
    cv: null,
    portfolio: null,
    organization_logo: null
  });

  // Gérer les changements de fichiers
  const handleFileChange = (field, file) => {
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  // Supprimer un fichier
  const handleFileRemove = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    // Réinitialiser l'input file
    const fileInput = document.querySelector(`input[type="file"][data-field="${field}"]`);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Obtenir l'aperçu d'un fichier
  const getFilePreview = (field) => {
    const file = files[field];
    if (!file) return null;

    if (file instanceof File) {
      // Nouveau fichier sélectionné
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        isNew: true,
        url: URL.createObjectURL(file)
      };
    } else if (typeof file === 'string' && file.startsWith('http')) {
      // Fichier existant depuis l'API
      return {
        name: file.split('/').pop() || 'Document',
        size: null,
        type: 'existing',
        isNew: false,
        url: file
      };
    }
    return null;
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Obtenir l'icône du type de fichier
  const getFileIcon = (fileName, fileType) => {
    if (fileType && fileType.startsWith('image/')) {
      return 'fas fa-image text-blue-500';
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-image text-green-500';
      default:
        return 'fas fa-file text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Démonstration - Aperçu et Suppression des Fichiers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo de profil */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">📸 Photo de profil</h3>
          
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('image', e.target.files[0])}
            data-field="image"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          
          {/* Aperçu de la photo */}
          {getFilePreview('image') && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-orange-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFilePreview('image').name}
                    </p>
                    {getFilePreview('image').size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(getFilePreview('image').size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleFileRemove('image')}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              {/* Prévisualisation de l'image */}
              {getFilePreview('image').type.startsWith('image/') && (
                <div className="mt-3">
                  <img
                    src={getFilePreview('image').url}
                    alt="Aperçu"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* CV */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">📄 CV</h3>
          
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange('cv', e.target.files[0])}
            data-field="cv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          
          {/* Aperçu du CV */}
          {getFilePreview('cv') && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={getFileIcon(getFilePreview('cv').name, getFilePreview('cv').type)}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFilePreview('cv').name}
                    </p>
                    {getFilePreview('cv').size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(getFilePreview('cv').size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleFileRemove('cv')}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">📁 Portfolio</h3>
          
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange('portfolio', e.target.files[0])}
            data-field="portfolio"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          
          {/* Aperçu du portfolio */}
          {getFilePreview('portfolio') && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className={getFileIcon(getFilePreview('portfolio').name, getFilePreview('portfolio').type)}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFilePreview('portfolio').name}
                    </p>
                    {getFilePreview('portfolio').size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(getFilePreview('portfolio').size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleFileRemove('portfolio')}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logo de l'organisation */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">🏢 Logo de l'organisation</h3>
          
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('organization_logo', e.target.files[0])}
            data-field="organization_logo"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          
          {/* Aperçu du logo */}
          {getFilePreview('organization_logo') && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getFilePreview('organization_logo').name}
                    </p>
                    {getFilePreview('organization_logo').size && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(getFilePreview('organization_logo').size)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleFileRemove('organization_logo')}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              {/* Prévisualisation du logo */}
              {getFilePreview('organization_logo').type.startsWith('image/') && (
                <div className="mt-3">
                  <img
                    src={getFilePreview('organization_logo').url}
                    alt="Aperçu du logo"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Instructions:</strong> Sélectionnez des fichiers pour voir l'aperçu et tester la suppression.
              Les images affichent une prévisualisation, et tous les fichiers montrent leur nom et taille.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewDemo; 