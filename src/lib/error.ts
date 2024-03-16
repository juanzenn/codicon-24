import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export function handleApiError(error: unknown) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) return "Internal Server Error";

  console.log("API Error\n\n");
  console.log(error);

  if (error instanceof PrismaClientInitializationError) {
    return "Prisma - Initialization Error";
  } else if (error instanceof PrismaClientKnownRequestError) {
    return "Prisma - Known Request Error: " + error.message;
  } else if (error instanceof PrismaClientValidationError) {
    return "Prisma - Validation Error: " + error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "Internal Server Error";
  }
}
