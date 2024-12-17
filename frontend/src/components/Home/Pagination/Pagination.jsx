import { Pagination } from '@mantine/core';

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <Pagination
      total={totalPages}
      value={currentPage}
      onChange={onPageChange}
      withEdges
    />
  );
}
