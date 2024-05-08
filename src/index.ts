import express, { Request as ExpressRequest, Response } from "express";
import { prisma } from "./utils/db";
import { authenticateToken } from "./auth";
import morgan from "morgan";

const app = express();
interface Request extends ExpressRequest {
  user?: {
    id: string;
  };
}

app.use(express.json());
app.use(morgan('dev'));

// Endpoint to create a new store
app.post(
  "/stores",
  [authenticateToken],
  async (req: Request, res: Response) => {
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
);

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

// Endpoint to create a new product
app.post("/products", async (req: Request, res: Response) => {
  const { name, type, meta, storeId, location, price, quantity, unit } =
    req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        type,
        meta,
        location,
        price,
        storeId,
        quantity,
        unit,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to create product" });
  }
});

// Endpoint to fetch all products
app.get("/products", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Endpoint to update a product
app.patch("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, meta, storeId, location, price, quantity, unit } =
    req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { name, type, meta, storeId, location, price, quantity, unit },
  });
  res.json(product);
});

// Endpoint to delete a product by id
app.delete("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: { id },
  });
  res.json(product);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
