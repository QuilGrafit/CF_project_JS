import { Markup } from 'telegraf';
import { HoroscopeGenerator } from './horoscope.js';
import { getTexts } from './texts.js';

// This function now takes language as an argument
export async function getKeyboard(keyboardName, lang = 'ru') {
    const TEXTS = getTexts(lang); // Get texts for the specific language

    switch (keyboardName) {
        case 'main_menu':
            return [
                [TEXTS['main_menu_horoscope'], TEXTS['main_menu_settings']],
                [TEXTS['main_menu_support'], TEXTS['main_menu_entertainment']]
            ];
        case 'settings_menu':
            return [
                [Markup.button.callback(TEXTS['settings_change_sign'], 'change_sign')],
                [Markup.button.callback(TEXTS['settings_set_birth_date'], 'set_birth_date')],
                [Markup.button.callback(TEXTS['settings_change_language'], 'change_language')]
            ];
        case 'sign_selection_menu':
            const builder = [];
            const signsList = Object.keys(HoroscopeGenerator.SIGNS);
            for (let i = 0; i < signsList.length; i += 3) {
                const rowButtons = signsList.slice(i, i + 3).map(signKey => {
                    const signInfo = HoroscopeGenerator.SIGNS[signKey];
                    return Markup.button.callback(`${signInfo.emoji} ${TEXTS[`sign_${signKey}`]}`, `set_sign_${signKey}`);
                });
                builder.push(rowButtons);
            }
            return builder;
        case 'language_selection_menu':
            return [
                [Markup.button.callback('🇷🇺 Русский', 'set_lang_ru')]
            ];
        case 'entertainment_menu':
            return [
                [Markup.button.callback(TEXTS['cookie_button'], 'get_cookie_fortune')],
                [Markup.button.callback(TEXTS['magic_ball_button'], 'ask_magic_ball')],
                [Markup.button.callback(TEXTS['motivation_button'], 'get_daily_motivation')] // Added motivation button
            ];
        default:
            return [];
    }
}
