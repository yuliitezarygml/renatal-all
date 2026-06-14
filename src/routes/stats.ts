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
    const completedRentals = await prisma.rental.findMany({ 
      where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
      include: { item: true }
    });
    const totalRevenue = completedRentals.reduce((sum, rental) => sum + rental.totalPrice, 0);

    // Chart Data (Last 6 months revenue)
    const chartDataMap: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    completedRentals.forEach(r => {
      const month = months[r.startDate.getMonth()];
      chartDataMap[month] = (chartDataMap[month] || 0) + r.totalPrice;
    });
    
    // Fill last 6 months
    const chartData = [];
    for(let i=5; i>=0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = months[d.getMonth()];
      chartData.push({ name: m, total: chartDataMap[m] || 0 });
    }

    // Top Items
    const topItemsMap: Record<string, number> = {};
    completedRentals.forEach(r => {
      topItemsMap[r.item.name] = (topItemsMap[r.item.name] || 0) + r.totalPrice;
    });
    const topItems = Object.entries(topItemsMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalItems,
      activeRentals,
      totalUsers,
      totalRevenue,
      chartData,
      topItems
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
