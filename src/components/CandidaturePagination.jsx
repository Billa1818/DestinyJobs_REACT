import React from 'react';

const CandidaturePagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const pageSizeOptions = [5, 10, 20, 50];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange(newPageSize);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Informations de pagination */}
        <div className="text-sm text-gray-600">
          Affichage de <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> à{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalCount)}
          </span>{' '}
          sur <span className="font-medium">{totalCount}</span> candidatures
        </div>

        {/* Sélecteur de taille de page */}
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Par page :
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Navigation des pages */}
        <div className="flex items-center space-x-1">
          {/* Bouton précédent */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium border ${
                  currentPage === pageNum
                    ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Bouton suivant */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidaturePagination; 