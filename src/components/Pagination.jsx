import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage,
  showItemsInfo = true 
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        {/* Informations sur les éléments */}
        {showItemsInfo && (
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Affichage de <span className="font-medium">{startItem}</span> à{' '}
            <span className="font-medium">{endItem}</span> sur{' '}
            <span className="font-medium">{totalItems}</span> résultats
          </div>
        )}

        {/* Navigation des pages */}
        <div className="flex items-center space-x-1">
          {/* Bouton précédent */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Précédent
          </button>

          {/* Numéros de pages */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      page === currentPage
                        ? 'bg-fuchsia-600 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Suivant
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>

      {/* Sélecteur de page */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600">Aller à la page:</span>
          <select
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">sur {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 