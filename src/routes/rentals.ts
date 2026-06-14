import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAvailability } from '../services/rentalService';
import { generateRentalPdf } from '../services/pdfService';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const rentals = await prisma.rental.findMany({ include: { user: true, item: true, discount: true } });
  res.json(rentals);
});

router.post('/', async (req, res) => {
  const { userId, itemId, discountId, startDate, endDate, totalPrice } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const available = await checkAvailability(Number(itemId), start, end);
  if (!available) {
    return res.status(400).json({ error: 'Item is not available for the selected dates.' });
  }

  const rental = await prisma.rental.create({
    data: {
      userId: Number(userId),
      itemId: Number(itemId),
      discountId: discountId ? Number(discountId) : undefined,
      startDate: start,
      endDate: end,
      totalPrice: Number(totalPrice),
      status: 'PENDING'
    }
  });
  res.json(rental);
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  const rental = await prisma.rental.update({
    where: { id: Number(id) },
    data: { status, notes },
    include: { user: true, item: true }
  });

  // Notify user via Telegram
  const bot = req.app.get('bot');
  if (bot && rental.user.telegramId) {
    let message = `🔔 Статус аренды R-${rental.id.toString().padStart(4, '0')} изменен на: ${status}`;
    if (status === 'ACTIVE') message = `✅ Ваша аренда вещи "${rental.item.name}" подтверждена и началась!`;
    if (status === 'CANCELLED') message = `❌ Аренда вещи "${rental.item.name}" была отменена администратором.`;
    if (status === 'COMPLETED') message = `🏁 Аренда вещи "${rental.item.name}" успешно завершена. Спасибо, что выбрали нас!`;
    
    try {
      if (status === 'COMPLETED') {
        const kb = {
          inline_keyboard: [[
            { text: '1⭐️', callback_data: `review_1_${rental.item.id}_${rental.user.id}` },
            { text: '2⭐️', callback_data: `review_2_${rental.item.id}_${rental.user.id}` },
            { text: '3⭐️', callback_data: `review_3_${rental.item.id}_${rental.user.id}` },
            { text: '4⭐️', callback_data: `review_4_${rental.item.id}_${rental.user.id}` },
            { text: '5⭐️', callback_data: `review_5_${rental.item.id}_${rental.user.id}` }
          ]]
        };
        await bot.telegram.sendMessage(rental.user.telegramId, message + "\n\nОцените состояние вещи от 1 до 5 звезд:", { reply_markup: kb });
      } else {
        await bot.telegram.sendMessage(rental.user.telegramId, message);
      }
      
      if (status === 'ACTIVE') {
        const tmpDir = path.join(__dirname, '../../tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        
        const pdfPath = path.join(tmpDir, `Rental_R-${rental.id}.pdf`);
        await generateRentalPdf(rental, pdfPath);
        
        await bot.telegram.sendDocument(rental.user.telegramId, {
          source: pdfPath,
          filename: `Договор_Аренды_R-${rental.id}.pdf`
        }, { caption: '📄 Ваш электронный чек и договор аренды' });
        
        // Clean up
        fs.unlinkSync(pdfPath);
      }
    } catch (err) {
      console.error('Failed to send telegram notification', err);
    }
  }

  res.json(rental);
});

export default router;
