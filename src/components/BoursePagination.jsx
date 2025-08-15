import React from 'react';

const BoursePagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
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
        <span className="font-medium">{totalCount}</span> bourses
      </div>

      {/* Sélecteur de taille de page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Afficher :</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-700">par page</span>
      </div>

      {/* Navigation des pages */}
      <div className="flex items-center space-x-1">
        {/* Bouton précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {/* Numéros de page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium border rounded-md ${
              page === currentPage
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
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Bouton suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default BoursePagination; 