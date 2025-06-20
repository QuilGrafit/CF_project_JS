import { Markup } from 'telegraf';
import { HoroscopeGenerator } from './horoscope.js';
import { getKeyboard } from './keyboards.js';
import { getTexts, SHARE_MESSAGE_RU } from './texts.js';
import { States } from './states.js'; // Define your FSM states here
import { getWebhookUrl } from './utils.js'; // Utility for webhook management

export function setupHandlers(bot) {
  // Helper to get text for the current user's language (from session)
  const getUserText = (ctx, key) => {
    const lang = ctx.session.user.lang || 'ru';
    return getTexts(lang)[key] || `_${key}_`;
  };

  bot.start(async (ctx) => {
    // Initialize user session data if it doesn't exist
    if (!ctx.session.user) {
      ctx.session.user = {
        sign: 'aries',
        lang: 'ru',
        birth_date: null,
      };
    }
    await ctx.reply(
      getUserText(ctx, 'welcome'),
      Markup.keyboard(await getKeyboard('main_menu', ctx.session.user.lang)).resize()
    );
  });

  bot.hears(getTexts('ru')['main_menu_horoscope'], async (ctx) => {
    const horoscope = await HoroscopeGenerator.generate(ctx.from.id, ctx.session.user);

    const bottomButtons = Markup.inlineKeyboard([
      Markup.button.callback(getUserText(ctx, 'main_menu_support'), 'show_donate_from_horoscope'),
      Markup.button.url(
        '💌 Поделиться ботом',
        `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/${ctx.botInfo.username}`)}&text=${encodeURIComponent(SHARE_MESSAGE_RU.replace('[Ссылка на бота]', `https://t.me/${ctx.botInfo.username}`))}`
      )
    ], { columns: 2 });

    await ctx.replyWithHTML(horoscope, bottomButtons);
  });

  bot.hears(getTexts('ru')['main_menu_settings'], async (ctx) => {
    await ctx.reply(
      getUserText(ctx, 'settings_menu_choose'),
      Markup.inlineKeyboard(await getKeyboard('settings_menu', ctx.session.user.lang))
    );
  });

  bot.action('change_sign', async (ctx) => {
    await ctx.editMessageText(
      getUserText(ctx, 'choose_sign'),
      Markup.inlineKeyboard(await getKeyboard('sign_selection_menu', ctx.session.user.lang))
    );
    await ctx.answerCbQuery();
  });

  bot.action(/^set_sign_/, async (ctx) => {
    const newSign = ctx.match[0].split('_')[2];
    ctx.session.user.sign = newSign; // Update session

    await ctx.editMessageText(
      getUserText(ctx, 'sign_set_success').replace('{sign}', getUserText(ctx, `sign_${newSign}`)),
      { parse_mode: 'HTML' }
    );
    await ctx.answerCbQuery(getUserText(ctx, 'sign_changed_answer'));
  });

  bot.action('set_birth_date', async (ctx) => {
    ctx.session.state = States.SET_BIRTH_DATE; // Set FSM state
    await ctx.editMessageText(getUserText(ctx, 'birth_date_prompt'));
    await ctx.answerCbQuery();
  });

  bot.on('text', async (ctx, next) => {
    if (ctx.session.state === States.SET_BIRTH_DATE) {
      const birthDateStr = ctx.message.text;

      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(birthDateStr)) {
        await ctx.reply(getUserText(ctx, 'birth_date_invalid_format'));
        return;
      }

      try {
        const [day, month, year] = birthDateStr.split('.').map(Number);
        const birthDateObj = new Date(year, month - 1, day); // Month is 0-indexed

        if (isNaN(birthDateObj.getTime()) || birthDateObj > new Date()) {
          await ctx.reply(getUserText(ctx, 'birth_date_future_error'));
          return;
        }

        ctx.session.user.birth_date = birthDateStr; // Update session
        ctx.session.user.sign = HoroscopeGenerator.getZodiacSign(birthDateObj); // Update sign based on birth date

        await ctx.replyWithHTML(
          getUserText(ctx, 'birth_date_success').replace('{birth_date}', birthDateStr),
          Markup.keyboard(await getKeyboard('main_menu', ctx.session.user.lang)).resize()
        );
        ctx.session.state = undefined; // Clear FSM state
      } catch (error) {
        console.error('Error parsing birth date:', error);
        await ctx.reply(getUserText(ctx, 'birth_date_invalid_format'));
      }
    } else if (ctx.session.state === States.MAGIC_BALL_ANSWER) {
      const question = ctx.message.text;
      if (!question.trim().endsWith('?')) {
        await ctx.reply(getUserText(ctx, 'magic_ball_not_a_question'));
        return;
      }

      const answerTypes = ['positive', 'negative', 'neutral'];
      const weights = [0.5, 0.3, 0.2];
      const answerType = answerTypes[Math.floor(Math.random() * answerTypes.length)]; // Simplified random choice
      const answers = HoroscopeGenerator.MAGIC_BALL_ANSWERS[answerType];
      const answer = answers[Math.floor(Math.random() * answers.length)];

      await ctx.replyWithHTML(
        getUserText(ctx, 'magic_ball_answer_message').replace('{answer}', answer),
        Markup.keyboard(await getKeyboard('main_menu', ctx.session.user.lang)).resize()
      );
      ctx.session.state = undefined; // Clear FSM state
    } else {
      return next(); // Pass to next middleware if no FSM state is active
    }
  });

  bot.action('change_language', async (ctx) => {
    await ctx.editMessageText(
      getUserText(ctx, 'choose_language_prompt'),
      Markup.inlineKeyboard(await getKeyboard('language_selection_menu', ctx.session.user.lang))
    );
    await ctx.answerCbQuery();
  });

  bot.action(/^set_lang_/, async (ctx) => {
    const newLang = ctx.match[0].split('_')[2];
    ctx.session.user.lang = newLang; // Update session

    const langName = 'Русский'; // Hardcoded as per request for now

    await ctx.editMessageText(
      getUserText(ctx, 'language_set_success').replace('{lang_name}', langName),
      { parse_mode: 'HTML' }
    );
    // Send main menu as a new message, as editMessageText changes the previous message
    await ctx.replyWithHTML(
      getUserText(ctx, 'welcome'),
      Markup.keyboard(await getKeyboard('main_menu', ctx.session.user.lang)).resize()
    );
    await ctx.answerCbQuery(getUserText(ctx, 'language_changed_answer'));
  });

  bot.hears(getTexts('ru')['main_menu_support'], async (ctx) => {
    const walletAddress = process.env.TON_WALLET_ADDRESS || "Not set"; // Placeholder if not defined
    const shareMessage = getUserText(ctx, 'support_us_prompt').replace('{wallet}', `<code>${walletAddress}</code>`);

    const supportKeyboard = Markup.inlineKeyboard([
      Markup.button.url(getUserText(ctx, 'donate_open_wallet'), 'https://t.me/wallet'),
      Markup.button.callback('📋 Копировать адрес TON', 'copy_ton_wallet'),
      Markup.button.callback(getUserText(ctx, 'donate_closed'), 'close_donate_message')
    ], { columns: 1 });

    await ctx.replyWithHTML(shareMessage, supportKeyboard);
  });

  bot.action('show_donate_from_horoscope', async (ctx) => {
    const walletAddress = process.env.TON_WALLET_ADDRESS || "Not set";
    const shareMessage = getUserText(ctx, 'support_us_prompt').replace('{wallet}', `<code>${walletAddress}</code>`);

    const supportKeyboard = Markup.inlineKeyboard([
      Markup.button.url(getUserText(ctx, 'donate_open_wallet'), 'https://t.me/wallet'),
      Markup.button.callback('📋 Копировать адрес TON', 'copy_ton_wallet'),
      Markup.button.callback(getUserText(ctx, 'donate_closed'), 'close_donate_message')
    ], { columns: 1 });

    await ctx.editMessageText(shareMessage, { parse_mode: 'HTML', reply_markup: supportKeyboard });
    await ctx.answerCbQuery();
  });

  bot.action('copy_ton_wallet', async (ctx) => {
    const walletAddress = process.env.TON_WALLET_ADDRESS || "Not set";
    await ctx.answerCbQuery(`Адрес кошелька TON:\n${walletAddress}\n\n(Нажмите на этот текст, чтобы скопировать)`, { show_alert: true });
  });

  bot.action('close_donate_message', async (ctx) => {
    try {
      await ctx.deleteMessage();
    } catch (e) {
      console.warn(`Failed to delete message for user ${ctx.from.id}: ${e.message}`);
    }
    await ctx.answerCbQuery(getUserText(ctx, 'donate_closed'));
  });

  bot.hears(getTexts('ru')['main_menu_entertainment'], async (ctx) => {
    await ctx.reply(
      getUserText(ctx, 'entertainment_menu_choose'),
      Markup.inlineKeyboard(await getKeyboard('entertainment_menu', ctx.session.user.lang))
    );
  });

  bot.action('get_cookie_fortune', async (ctx) => {
    const fortune = HoroscopeGenerator.COOKIE_FORTUNES[Math.floor(Math.random() * HoroscopeGenerator.COOKIE_FORTUNES.length)];
    await ctx.editMessageText(
      getUserText(ctx, 'cookie_fortune_message').replace('{fortune}', fortune),
      { parse_mode: 'HTML' }
    );
    await ctx.answerCbQuery('Ваше предсказание готово!');
  });

  bot.action('ask_magic_ball', async (ctx) => {
    ctx.session.state = States.MAGIC_BALL_ANSWER; // Set FSM state
    await ctx.editMessageText(getUserText(ctx, 'magic_ball_question_prompt'));
    await ctx.answerCbQuery('Шар готов ответить!');
  });

  bot.action('get_daily_motivation', async (ctx) => {
    const motivation = HoroscopeGenerator.DAILY_MOTIVATION[Math.floor(Math.random() * HoroscopeGenerator.DAILY_MOTIVATION.length)];
    await ctx.editMessageText(
      getUserText(ctx, 'motivation_message').replace('{motivation}', motivation),
      { parse_mode: 'HTML' }
    );
    await ctx.answerCbQuery('Ваша мотивация дня!');
  });
}
