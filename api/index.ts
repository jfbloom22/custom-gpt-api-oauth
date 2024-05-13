import express, { Request as ExpressRequest, Response } from "express";
import { prisma } from "../utils/db";
import { authenticateToken } from "../utils/auth";
import morgan from "morgan";

const app = express();
interface Request extends ExpressRequest {
  user?: {
    id: string;
  };
}

app.use(express.json());
app.use(morgan("dev"));

// Endpoint to create a new store
app.post(
  "/stores",
  [authenticateToken],
  async (req: Request, res: Response) => {
    const { name, address } = req.body;
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
          address
        },
      });
      res.json(store);
    } catch (error) {
      res.status(400).json({ error: "Failed to create store" });
    }
  }
);

// Endpoint to fetch all stores beloging to the user
app.get("/stores", [authenticateToken], async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const stores = await prisma.store.findMany({ where: { userId } });
  res.json(stores);
});

// Endpoint to fetch a store by id and all it's inventory and sales
app.get(
  "/stores/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id, userId: req.user.id },
      include: { 
        inventory: { 
          include: { product: true } 
        },
        sales: {
          include: { product: true }
        }
      },
    });
    res.json(store);
  }
);

// Endpoint to delete a store by id
app.delete(
  "/stores/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const store = await prisma.store.delete({
      where: { id, userId: req.user.id },
    });
    res.json(store);
  }
);

// Endpoint to update a store
app.patch(
  "/stores/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const { name, address } = req.body;
    const store = await prisma.store.update({
      where: { id, userId: req.user.id },
      data: { name, address },
    });
    res.json(store);
  }
);

// Endpoint to create a new product
app.post(
  "/products",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, type, meta, price, unit } =
      req.body;
    try {
      const product = await prisma.product.create({
        data: {
          name,
          type,
          meta,
          price,
          unit,
        },
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to create product" });
    }
  }
);

// Endpoint to update a product
app.patch(
  "/products/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const { name, type, meta, price, unit } =
      req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, type, meta, price, unit },
    });
    res.json(product);
  }
);

// Endpoint to delete a product by id
app.delete(
  "/products/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.json(product);
  }
);

// Endpoint to create a new sale
app.post("/sales", [authenticateToken], async (req: Request, res: Response) => {
  const { productId, quantitySold, storeId, totalPrice } = req.body;
  const sale = await prisma.sale.create({
    data: { 
      productId,
      storeId,
      quantitySold,
      totalPrice,
      store: { connect: { id: storeId } },
      product: { connect: { id: productId } } // Assuming product id is provided
    },
  });
  res.json(sale);
});

// Endpoint to update a new sale
app.patch("/sales/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantitySold, totalPrice, storeId, productId } = req.body;
  const sale = await prisma.sale.update({
    where: { id },
    data: { quantitySold, totalPrice, storeId, productId },
  });
  res.json(sale);
});

// Endpoint to delete a sale by id
app.delete("/sales/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const sale = await prisma.sale.delete({
    where: { id },
  });
  res.json(sale);
});

const port = process.env.PORT || 3000;

// Vercel calls app.listen(), so in order to avoid calling it twice, check if we are running in production
// In Vercel, we don’t need to call the listen() of express to listen for incoming requests, everything will be internally run by Vercel
// ref: https://www.geeksforgeeks.org/how-to-deploy-an-express-application-to-vercel/
// if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`
      🚀 Server ready at: http://localhost:${port}
      ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
  });
// }

module.exports = app;
