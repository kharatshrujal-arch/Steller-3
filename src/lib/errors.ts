export type AppErrorKind = "wallet" | "network" | "transaction" | "contract";

export class AppError extends Error {
  constructor(public readonly kind: AppErrorKind, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
