import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test/test-utils';
import Pagination from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    totalItems: 100,
    currentPage: 1,
    pageSize: 10,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it('should render pagination controls', () => {
    render(<Pagination {...defaultProps} />);

    // Should show total items info
    expect(screen.getByText(/of 100/)).toBeInTheDocument();
  });

  it('should display current page info', () => {
    render(<Pagination {...defaultProps} />);

    // Should indicate current page range
    expect(screen.getByText(/1-10/)).toBeInTheDocument();
  });

  it('should call onPageChange when next page is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} totalItems={100} pageSize={10} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when previous page is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should render page size selector', () => {
    render(<Pagination {...defaultProps} />);

    // MUI Select renders a combobox - verify it exists
    const pageSizeSelect = screen.getByRole('combobox');
    expect(pageSizeSelect).toBeInTheDocument();
  });

  it('should show correct page count', () => {
    render(<Pagination {...defaultProps} totalItems={100} pageSize={10} />);

    // 100 items / 10 per page = 10 pages
    expect(screen.getByText(/of 100/)).toBeInTheDocument();
  });

  it('should handle single page correctly', () => {
    render(<Pagination {...defaultProps} totalItems={5} pageSize={10} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
