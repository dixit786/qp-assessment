export interface CustomResponse {
  success: boolean;
  statusCode: number;
  statusMessage?: string;
  data?: any;
  isNext?: boolean;
}
