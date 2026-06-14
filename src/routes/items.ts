import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const items = await prisma.item.findMany({ include: { category: true } });
  res.json(items);
});

router.post('/', async (req, res) => {
  const { categoryId, name, description, photoUrl, pricePerDay, deposit } = req.body;
  const item = await prisma.item.create({
    data: { categoryId: Number(categoryId), name, description, photoUrl, pricePerDay: Number(pricePerDay), deposit: Number(deposit) }
  });
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryId, name, description, photoUrl, pricePerDay, deposit } = req.body;
  const item = await prisma.item.update({
    where: { id: Number(id) },
    data: { categoryId: Number(categoryId), name, description, photoUrl, pricePerDay: Number(pricePerDay), deposit: Number(deposit) }
  });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.item.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

export default router;
