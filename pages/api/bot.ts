import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработка стартовой команды
bot.start((ctx) => ctx.reply('✨ Добро пожаловать в Cosmic Insight!'));

// Вебхук для Vercel
export default async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).end();
  } catch (err) {
    console.error('Bot error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Установка вебхука при старте
if (process.env.VERCEL_URL) {
  bot.telegram.setWebhook(`${process.env.VERCEL_URL}/api/bot`);
}
