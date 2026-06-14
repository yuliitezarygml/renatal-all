import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const totalItems = await prisma.item.count();
    const activeRentals = await prisma.rental.count({ where: { status: 'ACTIVE' } });
    const totalUsers = await prisma.user.count();
    
    // Calculate total revenue from COMPLETED rentals
    const completedRentals = await prisma.rental.findMany({ where: { status: 'COMPLETED' }});
    const totalRevenue = completedRentals.reduce((sum, rental) => sum + rental.totalPrice, 0);

    res.json({
      totalItems,
      activeRentals,
      totalUsers,
      totalRevenue
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
