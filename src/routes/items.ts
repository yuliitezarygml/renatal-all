import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const items = await prisma.item.findMany({ include: { category: true } });
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const item = await prisma.item.findUnique({
    where: { id: Number(id) },
    include: { category: true, reviews: true }
  });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const { categoryId, name, description, photoUrls, pricePerDay, deposit } = req.body;
  const item = await prisma.item.create({
    data: {
      categoryId: Number(categoryId),
      name,
      description,
      photoUrls: photoUrls || [],
      pricePerDay: Number(pricePerDay),
      deposit: Number(deposit),
    }
  });
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryId, name, description, photoUrls, pricePerDay, deposit } = req.body;
  const item = await prisma.item.update({
    where: { id: Number(id) },
    data: {
      categoryId: categoryId ? Number(categoryId) : undefined,
      name,
      description,
      photoUrls: photoUrls !== undefined ? photoUrls : undefined,
      pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
      deposit: deposit ? Number(deposit) : undefined,
    }
  });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.item.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

export default router;
