import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { Telegraf } from 'telegraf';

const prisma = new PrismaClient();

export const startCronJobs = (bot: Telegraf) => {
  // Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('[Cron] Running daily rental checks...');
    const now = new Date();
    
    // Find rentals ending tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endingTomorrow = await prisma.rental.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date(tomorrow.setHours(0,0,0,0)),
          lte: new Date(tomorrow.setHours(23,59,59,999))
        }
      },
      include: { user: true, item: true }
    });

    for (const rental of endingTomorrow) {
      if (rental.user.telegramId) {
        try {
          await bot.telegram.sendMessage(
            rental.user.telegramId,
            `⏰ Напоминание! Срок аренды вещи "${rental.item.name}" заканчивается завтра. Пожалуйста, подготовьте вещь к возврату.`
          );
        } catch (e) {
          console.error('Cron reminder failed', e);
        }
      }
    }

    // Find overdue rentals (ended yesterday, still ACTIVE)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const overdue = await prisma.rental.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date(yesterday.setHours(0,0,0,0)),
          lte: new Date(yesterday.setHours(23,59,59,999))
        }
      },
      include: { user: true, item: true }
    });

    for (const rental of overdue) {
      if (rental.user.telegramId) {
        try {
          await bot.telegram.sendMessage(
            rental.user.telegramId,
            `⚠️ Внимание! Срок аренды вещи "${rental.item.name}" истек вчера. За каждый день просрочки может взиматься штраф. Срочно свяжитесь с нами!`
          );
        } catch (e) {
          console.error('Cron overdue failed', e);
        }
      }
    }
  });
};
