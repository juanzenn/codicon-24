import { Prisma } from "@prisma/client";

export type MemoryWithFamilyMembersNames = Prisma.MemoryGetPayload<{
  include: { familyMembers: { select: { name: true } } };
}>;
