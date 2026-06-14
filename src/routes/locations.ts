import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all locations
router.get('/', async (req, res) => {
  const locations = await prisma.location.findMany();
  res.json(locations);
});

// Create location
router.post('/', async (req, res) => {
  const { name, address, isActive } = req.body;
  const location = await prisma.location.create({
    data: { name, address, isActive }
  });
  res.json(location);
});

// Update location
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, isActive } = req.body;
  const location = await prisma.location.update({
    where: { id: Number(id) },
    data: { name, address, isActive }
  });
  res.json(location);
});

// Delete location
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.location.delete({
    where: { id: Number(id) }
  });
  res.status(204).send();
});

export default router;
