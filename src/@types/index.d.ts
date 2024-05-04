import { User as PrismaUser } from "@prisma/client";

declare global {
    namespace Express {
      interface Request {
        user?: PrismaUser; // ideally we would type this as optional here and then the auth middleware would update the type to be non-optional
      }
    }
  }