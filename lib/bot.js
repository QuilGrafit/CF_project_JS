import { Telegraf, session } from 'telegraf';

let botInstance = null;

export function getBotInstance() {
  if (!botInstance) {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      throw new Error('BOT_TOKEN environment variable is not set.');
    }
    botInstance = new Telegraf(token);

    // Apply session middleware. Since we're not using a database,
    // this will be an in-memory session tied to the current request.
    // Data will not persist between separate requests (interactions).
    botInstance.use(session());

    // Middleware to initialize user data if not present in session
    botInstance.use(async (ctx, next) => {
      if (!ctx.session.user) {
        ctx.session.user = {
          sign: 'aries',
          lang: 'ru',
          birth_date: null,
        };
      }
      await next();
    });

    console.log('Telegraf bot instance created and middlewares applied.');
  }
  return botInstance;
}
