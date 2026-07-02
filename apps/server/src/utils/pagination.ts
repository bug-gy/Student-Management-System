import { PAGINATION_DEFAULTS } from "@sms/shared";

interface PaginationQuery {
  page?: string;
  limit?: string;
}

interface PaginationResult {
  skip: number;
  page: number;
  limit: number;
}

export const parsePagination = (query: PaginationQuery): PaginationResult => {
  const page = Math.max(1, parseInt(query.page ?? "") || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, parseInt(query.limit ?? "") || PAGINATION_DEFAULTS.LIMIT),
  );
  const skip = (page - 1) * limit;
  return { skip, page, limit };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
