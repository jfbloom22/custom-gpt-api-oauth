import express, { Request as ExpressRequest, Response } from 'express'
import { prisma } from './utils/db';
import { authenticateToken } from './auth';

const app = express()
interface Request extends ExpressRequest {
  user?: {
    id: string;
  }
}


app.use(express.json())

app.post(`/signup`, async (req: Request, res: Response) => {
  const { name, email, clerkId } = req.body

  const result = await prisma.user.create({
    data: {
      name,
      email,
      clerkId
    },
  })
  res.json(result)
})

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

// Endpoint to create a new store
app.post('/stores', [authenticateToken], async (req: Request, res: Response) => {
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
});

// Endpoint to fetch all stores
app.get('/stores', async (req: Request, res: Response) => {
  const stores = await prisma.store.findMany();
  res.json(stores);
});

// Endpoint to create a new product
app.post('/products', async (req: Request, res: Response) => {
  const { name, type, meta, storeId } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        type,
        meta,
        storeId,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to create product" });
  }
});

// Endpoint to fetch all products
app.get('/products', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)