import { Telegraf } from 'telegraf';
import { connectToDatabase } from '../lib/db.js';
import { HoroscopeGenerator } from '../lib/horoscope.js';
import { mainMenu, settingsMenu } from '../lib/keyboards.js';
import i18n, { detectLanguage } from '../lib/i18n.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const db = await connectToDatabase();
  ctx.user = await db.collection('users').findOneAndUpdate(
    { id: ctx.from.id },
    { $setOnInsert: { 
        id: ctx.from.id, 
        sign: 'aries',
        lang: detectLanguage(ctx),
        createdAt: new Date()
    }},
    { upsert: true, returnDocument: 'after' }
  ).value;
  
  ctx.i18n = i18n.cloneInstance();
  ctx.i18n.changeLanguage(ctx.user.lang);
  
  return next();
});

bot.command('start', async (ctx) => {
  await ctx.reply(
    ctx.i18n.t('welcome'),
    mainMenu(ctx)
  );
});

// Обработка кнопки "Гороскоп"
bot.hears(i18n.t('main_menu_horoscope'), async (ctx) => {
  const horoscope = HoroscopeGenerator.generate(ctx.user);
  await ctx.replyWithHTML(horoscope.text, {
    reply_markup: horoscope.keyboard
  });
});

// ... другие обработчики

// Вебхук для Vercel
export default async (req, res) => {
  await bot.handleUpdate(req.body);
  res.status(200).send('OK');
};
