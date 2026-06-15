import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      children: true,
      parent: true
    }
  });
  res.json(categories);
});

router.post('/', async (req, res) => {
  const { name, description, parentId } = req.body;
  const category = await prisma.category.create({ 
    data: { name, description, parentId: parentId ? Number(parentId) : null } 
  });
  res.json(category);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, parentId } = req.body;
  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: { name, description, parentId: parentId ? Number(parentId) : null }
  });
  res.json(category);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

export default router;
