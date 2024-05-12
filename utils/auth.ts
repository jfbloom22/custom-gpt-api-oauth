import { User } from '@prisma/client';
import { ClerkUser } from '../../types/types';
import { prisma } from './db';
import NodeCache from 'node-cache'
import { NextFunction, Request as ExpressRequest, Response } from 'express';

interface Request extends ExpressRequest {
  user?: {
    id: string;
  }
}

const tokenCache = new NodeCache({ stdTTL: 3600 })

// middleware to verify token
// since we are using Clerk REST API to verify the token and retrieve the user info, lets cache the API calls
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const bearerToken = authHeader.split(' ')[1];
  const cachedUser = tokenCache.get<User>(bearerToken);
  if (cachedUser) {
    req.user = cachedUser;
    next();
  }
  const clerkUser = await fetchClerkUser(bearerToken);
  const user = await getOrCreateUser(clerkUser);
  tokenCache.set(bearerToken, user);
  req.user = user;
  next();
}

async function fetchClerkUser(bearerToken: string): Promise<ClerkUser> {
  const clerkBaseUrl = process.env.CLERK_BASE_URL;
  const response = await fetch(`${clerkBaseUrl}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!response.ok) {
    throw new Error("Authentication failed with status: " + response.status);
  }

  const userData = await response.json() as ClerkUser;
  if (!userData.user_id) {
    throw new Error("Failed getting Clerk user data");
  }

  return userData;
}

const getUserByClerkIdBearer = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: id,
    },
  })

  return user
}

async function getOrCreateUser(clerkUser: ClerkUser): Promise<User> {
  const prismaUser = await getUserByClerkIdBearer(clerkUser.user_id);
  if (!prismaUser) {
    return await prisma.user.create({
      data: {
        clerkId: clerkUser.user_id,
        email: clerkUser.email,
      },
    });
  }
  return prismaUser;
}

