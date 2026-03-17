export type PaginationOptions<T> = {
  page: number;
  limit: number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
