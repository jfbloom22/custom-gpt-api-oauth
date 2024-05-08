import {  Response } from "express";
import { Request } from "../types/types";
import { prisma } from "../utils/db";
// Endpoint to create a new store

export const createStore = async (req: Request, res: Response) => {
      const { name } = req.body;
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const userId = req.user.id;
      try {
        const store = await prisma.store.create({
          data: {
            name,
            userId,
          },
        });
        res.json(store);
      } catch (error) {
        res.status(400).json({ error: "Failed to create store" });
      }
    }
  
  
  // Endpoint to fetch all stores
  app.get("/stores", async (req: Request, res: Response) => {
    const stores = await prisma.store.findMany();
    res.json(stores);
  });
  
  // Endpoint to fetch a store by id and all it's products
  app.get("/stores/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: { products: true },
    });
    res.json(store);
  });
  
  // Endpoint to delete a store by id
  app.delete("/stores/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await prisma.store.delete({
      where: { id },
    });
    res.json(store);
  });