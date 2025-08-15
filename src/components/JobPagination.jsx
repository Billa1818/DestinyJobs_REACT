import React from 'react';

const JobPagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si moins de 5 pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sinon, afficher une sélection intelligente
      if (currentPage <= 3) {
        // Début : 1, 2, 3, 4, 5, ..., dernière
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Fin : 1, ..., avant-dernière, dernière-2, dernière-1, dernière
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu : 1, ..., page-1, page, page+1, ..., dernière
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

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Informations sur la pagination */}
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> à{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalCount)}
          </span> sur{' '}
          <span className="font-medium">{totalCount}</span> offres
        </div>

        {/* Sélecteur de taille de page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Par page :</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Navigation des pages */}
      <div className="flex items-center justify-center mt-6">
        <nav className="flex items-center space-x-1">
          {/* Bouton précédent */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
            }`}
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Précédent
          </button>

          {/* Numéros de page */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    page === currentPage
                      ? 'bg-fuchsia-600 text-white'
                      : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Bouton suivant */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
            }`}
          >
            Suivant
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default JobPagination; 