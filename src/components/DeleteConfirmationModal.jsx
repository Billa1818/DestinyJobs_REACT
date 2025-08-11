import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "cette offre" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500">
              Cette action est irréversible
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer {itemType} <strong>"{itemName}"</strong> ?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cette action ne peut pas être annulée et toutes les données associées seront définitivement supprimées.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
          >
            <i className="fas fa-trash mr-2"></i>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 