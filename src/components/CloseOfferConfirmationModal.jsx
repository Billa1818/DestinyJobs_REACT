import React from 'react';

const CloseOfferConfirmationModal = ({ isOpen, onClose, onConfirm, offerName, offerType = "cette offre" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-circle text-orange-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmer la fermeture
            </h3>
            <p className="text-sm text-gray-500">
              Cette action est définitive
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir fermer {offerType} <strong>"{offerName}"</strong> ?
          </p>
          <div className="text-sm text-gray-600 mt-3 bg-orange-50 p-3 rounded-md border border-orange-200">
            <p className="font-medium mb-1">⚠️ Conséquences :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cette offre sera fermée définitivement</li>
              <li>Un message sera envoyé aux différents candidats sélectionnés</li>
            </ul>
          </div>
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
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200"
          >
            <i className="fas fa-check mr-2"></i>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseOfferConfirmationModal;
