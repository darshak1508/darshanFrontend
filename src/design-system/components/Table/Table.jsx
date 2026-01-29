/**
 * Table Component
 * 
 * Modern data table with sorting, pagination, and filtering.
 * Designed for large datasets and enterprise use.
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Table.css';

// Sort icon component
const SortIcon = ({ direction }) => (
  <svg className="table__sort-icon" viewBox="0 0 20 20" fill="currentColor">
    {direction === 'asc' ? (
      <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" />
    ) : direction === 'desc' ? (
      <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" />
    ) : (
      <path d="M5.293 7.707a1 1 0 011.414 0L10 11l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" opacity="0.4" />
    )}
  </svg>
);

// Main Table component
const Table = ({
  columns,
  data,
  sortable = true,
  pagination = true,
  pageSize: initialPageSize = 10,
  emptyMessage = 'No data available',
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  stickyHeader = false,
  className = '',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate pagination info
  const totalPages = Math.ceil(data.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, data.length);

  // Handle row selection
  const handleSelectAll = (e) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      onSelectionChange(data.map((_, index) => index));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (index) => {
    if (!onSelectionChange) return;
    if (selectedRows.includes(index)) {
      onSelectionChange(selectedRows.filter(i => i !== index));
    } else {
      onSelectionChange([...selectedRows, index]);
    }
  };

  const isAllSelected = selectedRows.length === data.length && data.length > 0;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const tableClasses = [
    'table-container',
    stickyHeader && 'table-container--sticky',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={tableClasses}>
      <div className="table-wrapper">
        <table className="table">
          <thead className="table__head">
            <tr className="table__row">
              {onSelectionChange && (
                <th className="table__cell table__cell--checkbox">
                  <input
                    type="checkbox"
                    className="table__checkbox"
                    checked={isAllSelected}
                    ref={el => el && (el.indeterminate = isSomeSelected)}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table__cell table__cell--head ${
                    sortable && column.sortable !== false ? 'table__cell--sortable' : ''
                  } ${column.align ? `table__cell--${column.align}` : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="table__cell-content">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <SortIcon 
                        direction={sortConfig.key === column.key ? sortConfig.direction : null} 
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table__body">
            {paginatedData.length === 0 ? (
              <tr className="table__row table__row--empty">
                <td 
                  className="table__cell table__cell--empty" 
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                >
                  <div className="table__empty">
                    <svg className="table__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const actualIndex = (currentPage - 1) * pageSize + rowIndex;
                const isSelected = selectedRows.includes(actualIndex);
                
                return (
                  <tr
                    key={row.id || rowIndex}
                    className={`table__row ${
                      onRowClick ? 'table__row--clickable' : ''
                    } ${isSelected ? 'table__row--selected' : ''}`}
                    onClick={() => onRowClick?.(row, actualIndex)}
                  >
                    {onSelectionChange && (
                      <td 
                        className="table__cell table__cell--checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="table__checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(actualIndex)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`table__cell ${column.align ? `table__cell--${column.align}` : ''}`}
                      >
                        {column.render 
                          ? column.render(row[column.key], row, actualIndex)
                          : row[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && data.length > 0 && (
        <div className="table__pagination">
          <div className="table__pagination-info">
            <span className="table__pagination-text">
              Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
              <strong>{data.length}</strong> results
            </span>
          </div>
          
          <div className="table__pagination-controls">
            <select
              className="table__page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            
            <div className="table__pagination-buttons">
              <button
                className="table__pagination-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="table__pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <span className="table__pagination-page">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                className="table__pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="table__pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      width: PropTypes.string,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  sortable: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  selectedRows: PropTypes.array,
  onSelectionChange: PropTypes.func,
  stickyHeader: PropTypes.bool,
  className: PropTypes.string,
};

export default Table;
