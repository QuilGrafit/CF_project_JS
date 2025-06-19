import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      welcome: "✨ Добро пожаловать в Cosmic Insight...",
      // ... все русские тексты из Python версии
    }
  },
  en: {
    translation: {
      welcome: "✨ Welcome to Cosmic Insight...",
      // ... английские аналоги
    }
  }
};

i18next.init({
  lng: 'ru', // дефолтный язык
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false
  }
});

export function detectLanguage(ctx) {
  return ctx.from?.language_code?.startsWith('ru') ? 'ru' : 'en';
}

export default i18next;
