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

/**
 * Endpoint to create a new store
 * @param {string} name - The name of the store
 * @param {string} address - The address of the store
 * @returns {Store} - The newly created store
 */
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

/**
 * Endpoint to fetch all stores beloging to the user
 * @param {string} userId - The id of the user
 * @returns {Store[]} - The stores beloging to the user
 */
app.get("/stores", [authenticateToken], async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const stores = await prisma.store.findMany({ where: { userId } });
  res.json(stores);
});

/**
 * Endpoint to fetch a store by id and all it's inventory and products
 * @param {string} id - The id of the store
 * @returns {Store} - The store with it's inventory and products
 */
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
        }
      },
    });
    res.json(store);
  }
);

/**
 * Endpoint to delete a store by id
 * @param {string} id - The id of the store
 * @returns {Store} - The store that was deleted
 */
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

/**
 * Endpoint to update a store
 * @param {string} id - The id of the store
 * @param {string} name - The name of the store
 * @param {string} address - The address of the store
 * @returns {Store} - The store that was updated
 */
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

/**
 * Endpoint to create a new product
 * @param {string} name - The name of the product
 * @param {string} type - The type of the product
 * @param {string} meta - Any additional metadata about the product
 * @param {number} price - The price of the product
 * @returns {Product} - The newly created product
 */
app.post(
  "/products",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, type, meta, price } =
      req.body;
    try {
      const product = await prisma.product.create({
        data: {
          name,
          type,
          meta,
          price,
        },
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to create product" });
    }
  }
);

/**
 * Endpoint to update a product
 * @param {string} id - The id of the product
 * @param {string} name - The name of the product
 * @param {string} type - The type of the product
 * @param {string} meta - Any additional metadata about the product
 * @param {number} price - The price of the product
 * @returns {Product} - The product that was updated
 */
app.patch(
  "/products/:id",
  [authenticateToken],
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    const { name, type, meta, price } =
      req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, type, meta, price },
    });
    res.json(product);
  }
);

/**
 * Endpoint to delete a product by id
 * @param {string} id - The id of the product
 * @returns {Product} - The product that was deleted
 */
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

/**
 * Endpoint to create a new sale
 * @param {string} productId - The id of the product
 * @param {number} quantitySold - The quantity sold
 * @param {string} storeId - The id of the store
 * @param {number} totalPrice - The total price of the sale
 * @returns {Sale} - The newly created sale
 */
app.post("/sales", [authenticateToken], async (req: Request, res: Response) => {
  const { productId, quantitySold, storeId, totalPrice } = req.body;
  const sale = await prisma.sale.create({
    data: { 
      productId,
      storeId,
      quantitySold,
      totalPrice
    },
  });
  res.json(sale);
});

/**
 * Endpoint to update a sale
 * @param {string} id - The id of the sale
 * @param {number} quantitySold - The quantity sold
 * @param {string} storeId - The id of the store
 * @param {number} totalPrice - The total price of the sale
 * @returns {Sale} - The sale that was updated
 */
app.patch("/sales/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantitySold, totalPrice, storeId, productId } = req.body;
  const sale = await prisma.sale.update({
    where: { id },
    data: { quantitySold, totalPrice, storeId, productId },
  });
  res.json(sale);
});

/**
 * Endpoint to delete a sale by id
 * @param {string} id - The id of the sale
 * @returns {Sale} - The sale that was deleted
 */
app.delete("/sales/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const sale = await prisma.sale.delete({
    where: { id },
  });
  res.json(sale);
});

/**
 * Endpoint to fetch sales. optional filters for within a date range and for specific stores
 * @param {string} storeId - The id of the store
 * @param {string} startDate - The start date of the date range
 * @param {string} endDate - The end date of the date range
 * @returns {Sale[]} - The sales within the date range and for the store or stores
 */
app.get("/sales", [authenticateToken], async (req: Request, res: Response) => {
  const { storeId, startDate, endDate } = req.query;
  const where: { storeId?: string, createdAt?: { gte: string, lte: string } } = {};
  if (storeId && typeof storeId === 'string') where.storeId = storeId;
  if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') where.createdAt = { gte: startDate, lte: endDate };
  const sales = await prisma.sale.findMany({ where });
  res.json(sales);
});

/**
 * Endpoint to create a new inventory
 * @param {string} productId - The id of the product
 * @param {string} storeId - The id of the store
 * @param {number} quantity - The quantity of the product
 * @returns {Inventory} - The newly created inventory
 */
app.post("/inventory", [authenticateToken], async (req: Request, res: Response) => {
  const { productId, storeId, quantity } = req.body;
  const inventory = await prisma.inventory.create({
    data: { productId, storeId, quantity },
  });
  res.json(inventory);
});

/**
 * Endpoint to update an inventory
 * @param {string} id - The id of the inventory
 * @param {string} productId - The id of the product
 * @param {string} storeId - The id of the store
 * @param {number} quantity - The quantity of the product
 * @returns {Inventory} - The inventory that was updated
 */
app.patch("/inventory/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, storeId, quantity } = req.body;
  const inventory = await prisma.inventory.update({
    where: { id },
    data: { productId, storeId, quantity },
  });
  res.json(inventory);
});

/**
 * Endpoint to delete an inventory by id
 * @param {string} id - The id of the inventory
 * @returns {Inventory} - The inventory that was deleted
 */
app.delete("/inventory/:id", [authenticateToken], async (req: Request, res: Response) => {
  const { id } = req.params;
  const inventory = await prisma.inventory.delete({
    where: { id },
  });
  res.json(inventory);
});




const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`
      🚀 Server ready at: http://localhost:${port}
      ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
  });

module.exports = app;
