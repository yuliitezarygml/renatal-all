import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const reviews = await prisma.review.findMany({ include: { user: true, item: true } });
  res.json(reviews);
});

export default router;
