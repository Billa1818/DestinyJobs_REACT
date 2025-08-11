import React, { useState } from 'react';
import profileService from '../../services/profileService';

const FileUpload = ({ 
  type, // 'cv' ou 'image'
  currentFile, 
  onFileUpdate, 
  onFileDelete, // Nouveau callback pour la suppression
  accept, 
  maxSize = 5 // Taille max en MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validation de la taille
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximum : ${maxSize}MB`);
      return;
    }

    // Validation du type
    const validTypes = {
      cv: ['.pdf', '.doc', '.docx'],
      image: ['.jpg', '.jpeg', '.png', '.gif']
    };

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!validTypes[type].includes(fileExtension)) {
      setError(`Type de fichier non supporté. Types acceptés : ${validTypes[type].join(', ')}`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      
      // Utiliser les bons noms de champs selon l'API
      if (type === 'cv') {
        formData.append('cv', file);
      } else if (type === 'image') {
        formData.append('image', file);
      }

      // Mettre à jour le profil candidat avec le nouveau fichier
      console.log('Envoi du fichier:', file.name, 'Type:', type);
      const response = await profileService.updateCandidateProfile(formData);
      console.log('Réponse de l\'API:', response);
      
      // Appeler le callback pour mettre à jour l'interface avec l'URL du fichier
      // L'API retourne généralement l'URL du fichier uploadé
      if (response.cv) {
        console.log('CV uploadé avec succès:', response.cv);
        onFileUpdate(response.cv);
      } else if (response.image) {
        console.log('Image uploadée avec succès:', response.image);
        onFileUpdate(response.image);
      } else {
        // Fallback : utiliser le nom du fichier si l'URL n'est pas disponible
        console.log('Fallback: utilisation du nom du fichier');
        onFileUpdate(file.name);
      }
      
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      
      // Gestion d'erreur plus détaillée
      if (err.response?.status === 400) {
        setError('Format de fichier non supporté ou données invalides');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (err.response?.status === 413) {
        setError('Fichier trop volumineux');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de l\'upload du fichier. Veuillez réessayer.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async () => {
    if (!currentFile) return;

    try {
      setUploading(true);
      setError(null);

      console.log('Suppression du fichier:', type);
      
      let response;
      if (type === 'cv') {
        response = await profileService.deleteCandidateCV();
      } else if (type === 'image') {
        response = await profileService.deleteCandidateImage();
      }
      
      console.log('Réponse de suppression:', response);
      
      // Appeler le callback pour mettre à jour l'interface
      onFileDelete();
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      
      // Gestion d'erreur plus détaillée
      if (err.response?.status === 404) {
        setError('Fichier non trouvé');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la suppression du fichier. Veuillez réessayer.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = () => {
    if (type === 'cv') {
      return 'fas fa-file-pdf text-red-500';
    }
    return 'fas fa-image text-blue-500';
  };

  const getFileTypeLabel = () => {
    return type === 'cv' ? 'CV' : 'Photo de profil';
  };

  const getAcceptTypes = () => {
    return type === 'cv' ? '.pdf,.doc,.docx' : '.jpg,.jpeg,.png,.gif';
  };

  return (
    <div className="space-y-4">
      {/* Fichier actuel */}
      {currentFile && (
        <div className="p-3 bg-gray-50 rounded-lg">
          {type === 'image' && currentFile ? (
            // Prévisualisation de l'image
            <div className="text-center">
              <img 
                src={currentFile} 
                alt="Image actuelle" 
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 mx-auto mb-3"
              />
              <p className="text-sm font-medium text-gray-900">Photo de profil actuelle</p>
              <p className="text-xs text-gray-500 mb-3">Cliquez sur "Remplacer" pour changer</p>
              
              {/* Bouton de suppression */}
              <button
                onClick={handleFileDelete}
                disabled={uploading}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-200 disabled:opacity-50"
              >
                <i className="fas fa-trash mr-2"></i>
                {uploading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          ) : type === 'cv' && currentFile ? (
            // Affichage spécial pour le CV avec bouton de visualisation
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className={`${getFileIcon()} text-xl mr-3`}></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">CV actuel</p>
                  <p className="text-xs text-gray-500">Fichier actuel</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {/* Bouton de visualisation du CV */}
                <button
                  onClick={() => window.open(currentFile, '_blank')}
                  className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
                >
                  <i className="fas fa-eye mr-2"></i>
                  Visualiser
                </button>
                
                {/* Bouton de suppression */}
                <button
                  onClick={handleFileDelete}
                  disabled={uploading}
                  className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-trash mr-2"></i>
                  {uploading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ) : (
            // Affichage standard pour autres fichiers
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className={`${getFileIcon()} text-xl mr-3`}></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {type === 'cv' ? 'CV actuel' : 'Photo de profil actuelle'}
                  </p>
                  <p className="text-xs text-gray-500">Fichier actuel</p>
                </div>
              </div>
              
              {/* Bouton de suppression */}
              <button
                onClick={handleFileDelete}
                disabled={uploading}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-200 disabled:opacity-50"
              >
                <i className="fas fa-trash mr-2"></i>
                {uploading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Zone d'upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-fuchsia-400 bg-fuchsia-50' 
            : 'border-gray-300 hover:border-fuchsia-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <i className={`${getFileIcon()} text-3xl mb-3`}></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {currentFile ? 'Remplacer le' : 'Ajouter un'} {getFileTypeLabel()}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Glissez-déposez votre fichier ici ou cliquez pour sélectionner
        </p>
        
        <input
          type="file"
          accept={getAcceptTypes()}
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
          id={`file-upload-${type}`}
        />
        
        <label
          htmlFor={`file-upload-${type}`}
          className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 cursor-pointer"
        >
          <i className="fas fa-upload mr-2"></i>
          {uploading ? 'Upload en cours...' : 'Sélectionner un fichier'}
        </label>
        
        <p className="text-xs text-gray-400 mt-2">
          Taille maximum : {maxSize}MB
        </p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Indicateur de chargement */}
      {uploading && (
        <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fuchsia-600 mr-2"></div>
          <span className="text-sm text-blue-700">Upload en cours...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 