import React, { useState, useEffect } from 'react';

const SearchAndSort = ({ onSearch, onSort, currentSortBy, currentSortOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(currentSortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(currentSortOrder || 'desc');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== '') {
        onSearch(searchQuery);
      } else {
        onSearch('');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, onSearch]);

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSort(newSortBy, newSortOrder);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="row mb-4">
      <div className="col-md-6 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search recipes by title, ingredients, or instructions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleSearchClear}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="col-md-6 mb-3">
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Date Updated</option>
            <option value="title">Title</option>
            <option value="cookingTime">Cooking Time</option>
          </select>
          
          <button
            className={`btn btn-outline-primary ${sortOrder === 'asc' ? 'active' : ''}`}
            onClick={() => handleSortChange(sortBy, 'asc')}
            title="Ascending"
          >
            <i className="fas fa-sort-amount-up"></i>
          </button>
          
          <button
            className={`btn btn-outline-primary ${sortOrder === 'desc' ? 'active' : ''}`}
            onClick={() => handleSortChange(sortBy, 'desc')}
            title="Descending"
          >
            <i className="fas fa-sort-amount-down"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort; 