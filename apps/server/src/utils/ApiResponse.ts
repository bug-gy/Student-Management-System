interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(data: T, message = "Success") {
    return { success: true, data, message };
  }

  static paginated<T>(data: T[], pagination: PaginationInfo, message = "Success") {
    return { success: true, data, message, pagination };
  }

  static created<T>(data: T, message = "Created successfully") {
    return { success: true, data, message };
  }

  static noContent(message = "Deleted successfully") {
    return { success: true, data: null, message };
  }
}
