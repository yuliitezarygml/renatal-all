import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { setupBot } from './bot';

import categoriesRouter from './routes/categories';
import itemsRouter from './routes/items';
import rentalsRouter from './routes/rentals';
import usersRouter from './routes/users';
import discountsRouter from './routes/discounts';
import locationsRouter from './routes/locations';
import reviewsRouter from './routes/reviews';
import statsRouter from './routes/stats';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';
import { startCronJobs } from './services/cronService';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Basic API routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Rental API is running.' });
});

app.use('/api/categories', categoriesRouter);
app.use('/api/items', itemsRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/discounts', discountsRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);

// Initialize Telegraf bot
const botToken = process.env.BOT_TOKEN;
let bot: Telegraf | null = null;
if (botToken && botToken !== 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
  bot = new Telegraf(botToken);
  bot.use(Telegraf.log());
  app.set('bot', bot);
  setupBot(bot);
  
  // Launch bot gracefully
  bot.launch().catch(console.error);
  
  // Start cron jobs
  startCronJobs(bot);
  
  // Enable graceful stop
  process.once('SIGINT', () => bot?.stop('SIGINT'));
  process.once('SIGTERM', () => bot?.stop('SIGTERM'));
  console.log('Telegram bot started.');
} else {
  console.warn('BOT_TOKEN is not set or invalid. Telegram bot will not be started.');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
