import { Telegraf, session, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import LocalSession from 'telegraf-session-local';
import { addDays, format, isValid, parseISO, differenceInDays } from 'date-fns';
import { checkAvailability } from '../services/rentalService';
import { getCalendarKeyboard } from './calendar';

const prisma = new PrismaClient();

export const setupBot = (bot: Telegraf) => {
  // Use session for state management
  const localSession = new LocalSession({ database: 'session_db.json' });
  bot.use(localSession.middleware());

  bot.start(async (ctx) => {
    const telegramId = String(ctx.from?.id);
    let user = await prisma.user.findUnique({ where: { telegramId } });
    
    if (!user) {
      await ctx.reply('Добро пожаловать! Пожалуйста, зарегистрируйтесь, поделившись своим номером телефона:', Markup.keyboard([
        Markup.button.contactRequest('📱 Поделиться контактом')
      ]).resize().oneTime());
    } else {
      await sendMainMenu(ctx);
    }
  });

  bot.on('contact', async (ctx) => {
    const telegramId = String(ctx.from?.id);
    const phone = ctx.message.contact.phone_number;
    const name = ctx.from?.first_name || 'User';

    await prisma.user.upsert({
      where: { telegramId },
      update: { phone },
      create: { telegramId, name, phone }
    });

    await ctx.reply('Регистрация прошла успешно!', Markup.removeKeyboard());
    await sendMainMenu(ctx);
  });

  bot.hears('📚 Каталог', async (ctx) => {
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      return ctx.reply('На данный момент каталог пуст.');
    }
    const buttons = categories.map(c => Markup.button.callback(c.name, `cat_${c.id}`));
    await ctx.reply('Выберите категорию:', Markup.inlineKeyboard(buttons, { columns: 2 }));
  });

  bot.action(/cat_(\d+)/, async (ctx) => {
    const categoryId = Number(ctx.match[1]);
    const items = await prisma.item.findMany({ where: { categoryId } });
    
    if (items.length === 0) {
      return ctx.reply('В этой категории пока нет вещей.');
    }
    const buttons = items.map(i => Markup.button.callback(i.name, `item_${i.id}`));
    await ctx.editMessageText('Выберите вещь:', Markup.inlineKeyboard(buttons, { columns: 1 }));
  });

  bot.action(/item_(\d+)/, async (ctx) => {
    const itemId = Number(ctx.match[1]);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return ctx.reply('Вещь не найдена.');

    const msg = `*${item.name}*\n${item.description || ''}\nЦена: $${item.pricePerDay}/день\nЗалог: $${item.deposit}`;
    await ctx.replyWithMarkdown(msg, Markup.inlineKeyboard([
      Markup.button.callback('📅 Забронировать', `book_${item.id}`)
    ]));
  });

  bot.action('ignore', async (ctx) => {
    await ctx.answerCbQuery();
  });

  bot.action(/book_(\d+)/, async (ctx) => {
    const itemId = Number(ctx.match[1]);
    (ctx as any).session.booking = { itemId };
    
    await ctx.editMessageText('🗓 Выберите дату НАЧАЛА аренды:', Markup.inlineKeyboard(
      getCalendarKeyboard(new Date(), 'calstart')
    ));
  });

  bot.action(/calstart_(prev|next)_(\d{4}-\d{2})/, async (ctx) => {
    const date = new Date(`${ctx.match[2]}-01`);
    await ctx.editMessageReplyMarkup({ inline_keyboard: getCalendarKeyboard(date, 'calstart') });
  });

  bot.action(/calstart_(\d{4}-\d{2}-\d{2})/, async (ctx) => {
    const startDate = new Date(ctx.match[1]);
    (ctx as any).session.booking.startDate = startDate;
    
    await ctx.editMessageText(`Начало: ${format(startDate, 'dd.MM.yyyy')}\n\n🗓 Теперь выберите дату ОКОНЧАНИЯ аренды:`, Markup.inlineKeyboard(
      getCalendarKeyboard(startDate, 'calend')
    ));
  });

  bot.action(/calend_(prev|next)_(\d{4}-\d{2})/, async (ctx) => {
    const date = new Date(`${ctx.match[2]}-01`);
    await ctx.editMessageReplyMarkup({ inline_keyboard: getCalendarKeyboard(date, 'calend') });
  });

  bot.action(/calend_(\d{4}-\d{2}-\d{2})/, async (ctx) => {
    const session = (ctx as any).session;
    if (!session.booking) return;

    const endDate = new Date(ctx.match[1]);
    const startDate = new Date(session.booking.startDate);
    
    if (endDate <= startDate) {
      return ctx.answerCbQuery('Дата окончания должна быть позже даты начала!', { show_alert: true });
    }

    const days = differenceInDays(endDate, startDate);
    const itemId = session.booking.itemId;
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return;

    const available = await checkAvailability(itemId, startDate, endDate);
    if (!available) {
      session.booking = null;
      return ctx.editMessageText('К сожалению, эта вещь уже занята на эти даты. Пожалуйста, выберите другие даты.');
    }

    const totalPrice = item.pricePerDay * days;
    session.booking = { ...session.booking, endDate, totalPrice };
    
    await ctx.editMessageText(
      `Вы выбрали аренду с ${format(startDate, 'dd.MM')} по ${format(endDate, 'dd.MM')} (${days} дней).\nСтоимость аренды: $${totalPrice}\n\nВыберите способ получения:`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🏢 Самовывоз', 'delivery_pickup')],
        [Markup.button.callback('🚚 Доставка (+$10)', 'delivery_courier')]
      ])
    );
  });

  bot.action('delivery_pickup', async (ctx) => {
    const session = (ctx as any).session;
    if (!session.booking) return;

    session.booking.deliveryType = 'PICKUP';
    session.booking.deliveryFee = 0;

    const locations = await prisma.location.findMany({ where: { isActive: true } });
    if (locations.length === 0) {
      session.booking.deliveryAddress = 'Главный склад';
      return askConfirmation(ctx, session.booking);
    }

    const buttons = locations.map(loc => [Markup.button.callback(loc.name, `loc_${loc.id}`)]);
    await ctx.editMessageText('Выберите пункт самовывоза:', Markup.inlineKeyboard(buttons));
  });

  bot.action(/loc_(\d+)/, async (ctx) => {
    const session = (ctx as any).session;
    if (!session.booking) return;
    
    const locId = Number(ctx.match[1]);
    const location = await prisma.location.findUnique({ where: { id: locId } });
    
    session.booking.deliveryAddress = location ? `${location.name} (${location.address})` : 'Главный склад';
    
    session.step = 'AWAITING_PROMO';
    await ctx.editMessageText('У вас есть промокод? Напишите его в ответном сообщении или нажмите "Пропустить".', Markup.inlineKeyboard([
      [Markup.button.callback('⏭ Пропустить', 'skip_promo')]
    ]));
  });

  bot.action('delivery_courier', async (ctx) => {
    const session = (ctx as any).session;
    if (!session.booking) return;

    session.booking.deliveryType = 'DELIVERY';
    session.booking.deliveryFee = 10;
    session.step = 'AWAITING_ADDRESS';
    
    await ctx.editMessageText('Пожалуйста, напишите ваш полный адрес для доставки в ответном сообщении:');
  });

  bot.on('text', async (ctx, next) => {
    const session = (ctx as any).session;
    const text = ctx.message.text;

    // Support Chat System
    if (session?.step === 'AWAITING_SUPPORT_MESSAGE') {
      const adminId = process.env.ADMIN_TELEGRAM_ID;
      session.step = null;
      if (adminId) {
        await ctx.telegram.sendMessage(adminId, `🆘 Новое сообщение в поддержку от ${ctx.from.first_name} (@${ctx.from.username || 'no_user'}):\n\n${text}\n\n/reply_${ctx.from.id}`);
        return ctx.reply('Ваше сообщение отправлено менеджеру. Мы ответим вам в ближайшее время!');
      } else {
        return ctx.reply('Извините, система поддержки временно недоступна.');
      }
    }
    
    // Admin Reply System
    if (text.startsWith('/reply_')) {
      const parts = text.split(' ');
      const targetId = parts[0].replace('/reply_', '');
      const replyText = parts.slice(1).join(' ');
      if (replyText) {
        try {
          await ctx.telegram.sendMessage(targetId, `👨‍💻 Ответ менеджера:\n\n${replyText}`);
          return ctx.reply('Ответ успешно отправлен пользователю.');
        } catch(e) {
          return ctx.reply('Ошибка отправки. Возможно пользователь заблокировал бота.');
        }
      }
    }

    if (session?.step === 'AWAITING_ADDRESS') {
      session.booking.deliveryAddress = text;
      session.step = 'AWAITING_PROMO';
      return ctx.reply('У вас есть промокод? Напишите его в ответном сообщении или нажмите "Пропустить".', Markup.inlineKeyboard([
        [Markup.button.callback('⏭ Пропустить', 'skip_promo')]
      ]));
    } 
    
    if (session?.step === 'AWAITING_PROMO') {
      const promoCode = text.trim();
      const discount = await prisma.discount.findFirst({ where: { code: promoCode, isActive: true } });
      if (discount) {
        session.booking.discountId = discount.id;
        session.booking.discountPercent = discount.percentage;
        session.step = null;
        await ctx.reply(`🎉 Промокод применен! Скидка: ${discount.percentage}%`);
        await askConfirmation(ctx, session.booking, true);
      } else {
        return ctx.reply('❌ Промокод не найден или недействителен. Попробуйте другой или нажмите "Пропустить".', Markup.inlineKeyboard([
          [Markup.button.callback('⏭ Пропустить', 'skip_promo')]
        ]));
      }
      return;
    }

    return next();
  });

  bot.action('skip_promo', async (ctx) => {
    const session = (ctx as any).session;
    if (!session.booking) return;
    session.step = null;
    await askConfirmation(ctx, session.booking);
  });

  async function askConfirmation(ctx: any, booking: any, isNewMessage = false) {
    const item = await prisma.item.findUnique({ where: { id: booking.itemId } });
    if (!item) return;

    const days = differenceInDays(new Date(booking.endDate), new Date(booking.startDate));
    const total = booking.totalPrice + booking.deliveryFee;
    let finalTotal = total;
    let discountMsg = '';
    
    if (booking.discountPercent) {
      const discountAmount = (booking.totalPrice * booking.discountPercent) / 100;
      finalTotal = total - discountAmount;
      discountMsg = `🎁 Скидка по промокоду (${booking.discountPercent}%): -$${discountAmount.toFixed(2)}\n`;
    }

    const msg = `🧾 *Подтверждение заказа*\n\n` +
      `📦 Товар: ${item.name}\n` +
      `🗓 Период: с ${format(new Date(booking.startDate), 'dd.MM')} по ${format(new Date(booking.endDate), 'dd.MM')} (${days} дней)\n` +
      `🚚 Способ получения: ${booking.deliveryType === 'PICKUP' ? 'Самовывоз' : 'Доставка'}\n` +
      `📍 Адрес: ${booking.deliveryAddress}\n\n` +
      `💰 Аренда: $${booking.totalPrice}\n` +
      (booking.deliveryFee > 0 ? `🛵 Доставка: $${booking.deliveryFee}\n` : '') +
      discountMsg +
      `🛡 Залог: $${item.deposit}\n` +
      `💵 *Итого к оплате (без залога): $${finalTotal.toFixed(2)}*\n\n` +
      `Для оформления заказа необходимо ознакомиться и согласиться с Политикой конфиденциальности.`;

    const kb = Markup.inlineKeyboard([
      [Markup.button.url('📄 Прочитать Политику', 'https://telegra.ph/Politika-konfidencialnosti-01-01')],
      [Markup.button.callback('✅ Прочитал и согласен (Подтвердить)', 'confirm_booking')],
      [Markup.button.callback('❌ Отмена', 'cancel_booking')]
    ]);

    booking.finalTotal = total;
    (ctx as any).session.step = 'AWAITING_AGREEMENT';

    if (isNewMessage) {
      await ctx.replyWithMarkdown(msg, kb);
    } else {
      await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...kb });
    }
  }

  bot.action('confirm_booking', async (ctx) => {
    const session = (ctx as any).session;
    if (session.step !== 'AWAITING_AGREEMENT') return;

    const telegramId = String(ctx.from?.id);
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) return ctx.reply('Пользователь не найден.');

    const { itemId, startDate, endDate, finalTotal, deliveryType, deliveryAddress, deliveryFee, discountId } = session.booking;
    
    await prisma.rental.create({
      data: {
        userId: user.id,
        itemId,
        discountId,
        startDate,
        endDate,
        totalPrice: finalTotal,
        deliveryType: deliveryType || 'PICKUP',
        deliveryAddress: deliveryAddress || '',
        deliveryFee: deliveryFee || 0,
        status: 'PENDING'
      }
    });

    session.step = null;
    session.booking = null;

    await ctx.reply('🎉 Бронь успешно создана! Администратор свяжется с вами в ближайшее время.');
  });

  bot.action('cancel_booking', async (ctx) => {
    (ctx as any).session.step = null;
    (ctx as any).session.booking = null;
    await ctx.reply('Бронирование отменено.');
  });

  bot.hears('📋 Мои аренды', async (ctx) => {
    const telegramId = String(ctx.from?.id);
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) return;

    const rentals = await prisma.rental.findMany({
      where: { userId: user.id },
      include: { item: true }
    });

    if (rentals.length === 0) return ctx.reply('У вас пока нет активных бронирований.');
    
    let msg = 'Ваши бронирования:\n\n';
    rentals.forEach(r => {
      msg += `- ${r.item.name} (${format(r.startDate, 'dd.MM')} - ${format(r.endDate, 'dd.MM')}) [${r.status}]\n`;
    });
    await ctx.reply(msg);
  });

  bot.hears('🆘 Задать вопрос', async (ctx) => {
    (ctx as any).session.step = 'AWAITING_SUPPORT_MESSAGE';
    await ctx.reply('Опишите вашу проблему или задайте вопрос в одном сообщении. Мы передадим его менеджеру.');
  });

  bot.action(/review_([\d.]+)_(\d+)_(\d+)/, async (ctx) => {
    const rating = parseFloat(ctx.match[1]);
    const itemId = Number(ctx.match[2]);
    const userId = Number(ctx.match[3]);

    await prisma.review.create({
      data: {
        rating,
        itemId,
        userId,
        comment: 'Оставлено через бота'
      }
    });

    // Recalculate Average Rating for the Item
    const allReviews = await prisma.review.findMany({ where: { itemId } });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await prisma.item.update({
      where: { id: itemId },
      data: { 
        averageRating,
        reviewCount: allReviews.length
      }
    });

    await ctx.editMessageText(`Вы оценили заказ на ${rating}⭐️. Большое спасибо за ваш отзыв!`);
  });
};

async function sendMainMenu(ctx: any) {
  await ctx.reply('Главное меню:', Markup.keyboard([
    ['📚 Каталог', '📋 Мои аренды'],
    ['🆘 Задать вопрос']
  ]).resize());
}
