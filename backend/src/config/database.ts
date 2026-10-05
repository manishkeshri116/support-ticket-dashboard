import type { PrismaClient } from "@prisma/client";

export type Database = Pick<PrismaClient, "ticket">;
