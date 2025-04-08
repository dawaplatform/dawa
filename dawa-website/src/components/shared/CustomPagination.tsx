import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'flex flex-row items-center gap-2 flex-wrap justify-center',
      className,
    )}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'default' : 'ghost',
        size,
      }),
      isActive
        ? 'bg-primary_1 text-white hover:bg-gray-700'
        : 'bg-[#FFEFE7] text-primary_1 hover:bg-orange-100',
      'rounded-xl w-10 h-10 flex items-center justify-center',
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex h-10 w-10 items-center justify-center text-primary_1',
      className,
    )}
    {...props}
  >
    ...
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

interface CustomPaginationProps {
  currentPage?: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      if (currentPage > 3) {
        // Show ellipsis if current page is beyond the first 3 pages
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        // Show ellipsis if current page is before the last 3 pages
        pages.push('ellipsis');
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number): void => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Pagination className="flex justify-end">
      <PaginationContent>
        {getPageNumbers().map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <PaginationEllipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => handlePageClick(pageNum)}
                isActive={pageNum === currentPage}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
