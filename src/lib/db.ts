import { PrismaClient } from "@prisma/client";

function prismaSingleton() {
  return new PrismaClient();
}

declare global {
  var db: ReturnType<typeof prismaSingleton>;
}

export const db = globalThis.db ?? prismaSingleton();

if (process.env.NODE_ENV === "development") {
  globalThis.db = db;
}
