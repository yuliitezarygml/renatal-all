import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const discounts = await prisma.discount.findMany();
  res.json(discounts);
});

router.post('/', async (req, res) => {
  const { code, percentage, fixedAmount, isActive } = req.body;
  const discount = await prisma.discount.create({
    data: {
      code,
      percentage: percentage ? Number(percentage) : null,
      fixedAmount: fixedAmount ? Number(fixedAmount) : null,
      isActive: isActive !== undefined ? isActive : true
    }
  });
  res.json(discount);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const discount = await prisma.discount.update({
    where: { id: Number(id) },
    data: { isActive }
  });
  res.json(discount);
});

export default router;
