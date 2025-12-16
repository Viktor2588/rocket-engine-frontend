import { useMemo, useState } from 'react';
import {
  Pagination as MuiPagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

/**
 * Reusable pagination component with page size selector
 */
export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  className = '',
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    onPageSizeChange(newSize);
    // Reset to page 1 when changing page size
    onPageChange(1);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
      sx={{ py: 2 }}
    >
      {/* Item count */}
      {showItemCount && (
        <Typography
          variant="body2"
          className="text-gray-600 dark:text-gray-400"
        >
          Showing {startItem}-{endItem} of {totalItems} items
        </Typography>
      )}

      <Box className="flex items-center gap-4">
        {/* Page size selector */}
        {showPageSizeSelector && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="page-size-label" sx={{ fontSize: '0.875rem' }}>
              Per page
            </InputLabel>
            <Select
              labelId="page-size-label"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Per page"
              sx={{
                fontSize: '0.875rem',
                '& .MuiSelect-select': { py: 1 },
              }}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Pagination controls */}
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'inherit',
            },
            '& .Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Hook for pagination state management
 */
export function usePagination(defaultPageSize = 25) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const paginateData = useMemo(() => {
    return (data) => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return data.slice(startIndex, endIndex);
    };
  }, [currentPage, pageSize]);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginateData,
    resetPage,
  };
}
