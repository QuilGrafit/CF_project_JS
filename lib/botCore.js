import { Telegraf } from 'telegraf';
import { connectToDatabase } from './db.js';
import { initI18n } from './i18n.js';
import { HoroscopeGenerator } from './horoscope.js';

let botInstance: Telegraf | null = null;

export async function initBot(): Promise<Telegraf> {
  if (botInstance) return botInstance;

  const bot = new Telegraf(process.env.BOT_TOKEN!);
  const db = await connectToDatabase();
  
  // Middleware для пользователя
  bot.use(async (ctx, next) => {
    const userCollection = db.collection('users');
    
    // Ищем или создаем пользователя
    const user = await userCollection.findOneAndUpdate(
      { id: ctx.from.id },
      {
        $setOnInsert: {
          id: ctx.from.id,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
          username: ctx.from.username,
          language: ctx.from.language_code?.startsWith('ru') ? 'ru' : 'en',
          createdAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    
    ctx.user = user;
    ctx.i18n = initI18n(ctx.user.language);
    
    await next();
  });

  // Обработчики команд
  bot.start(async (ctx) => {
    await ctx.reply(
      ctx.i18n.t('welcome'),
      { parse_mode: 'HTML' }
    );
  });

  // ... другие обработчики

  botInstance = bot;
  return bot;
}
