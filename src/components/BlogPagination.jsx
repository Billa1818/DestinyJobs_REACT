import React from 'react';

const BlogPagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  // Calculer les pages à afficher
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange(newPageSize);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      {/* Informations de pagination */}
      <div className="text-sm text-gray-700">
        Affichage de <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> à{' '}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, totalCount)}
        </span> sur{' '}
        <span className="font-medium">{totalCount}</span> articles
      </div>

      {/* Sélection de la taille de page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Articles par page :</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Navigation des pages */}
      <div className="flex items-center space-x-1">
        {/* Bouton précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
        >
          <i className="fas fa-chevron-left mr-1"></i>
          Précédent
        </button>

        {/* Numéros de page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md border focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 ${
              currentPage === page
                ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Bouton suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
        >
          Suivant
          <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  );
};

export default BlogPagination; 