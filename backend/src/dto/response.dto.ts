export interface ApiResponseFormat<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string; message: string }> | null;
  timestamp: string;
}

export function createSuccessResponse<T>(data: T, message = 'Success'): ApiResponseFormat<T> {
  return {
    success: true,
    message,
    data,
    errors: null,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(message = 'An error occurred', errors: Array<{ field?: string; message: string }> | null = null): ApiResponseFormat<null> {
  return {
    success: false,
    message,
    data: null,
    errors,
    timestamp: new Date().toISOString(),
  };
}
