export class ApiError extends Error {
  constructor(message: string, public originalError: any) {
    super(message);
    this.name = 'ApiError';

    console.error(`${message}: ${originalError?.message || 'Unknown error'}`, {
      stack: originalError?.stack,
      response: originalError?.response?.data
    });
  }
}
