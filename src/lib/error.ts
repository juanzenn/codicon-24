import { toast } from "@/components/ui/use-toast";
import { ZodError } from "zod";

export function handleReactQueryError(error: Error) {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  toast({
    variant: "destructive",
    title: "Server Error",
    description: "There was an unexpected error. Please try again.",
  });
}

export function handleZodError(error: ZodError) {
  const { errors } = error;

  for (let i = 0; i < errors.length; i++) {
    const { path, message } = errors[i];
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: message,
    });
  }
}
