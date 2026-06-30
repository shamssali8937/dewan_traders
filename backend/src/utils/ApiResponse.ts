export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static created<T>(message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static fail(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null);
  }
}
