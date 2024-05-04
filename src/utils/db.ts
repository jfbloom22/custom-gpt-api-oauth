import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({log: ['query']});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;