export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  error: boolean;
  result: T;
}
