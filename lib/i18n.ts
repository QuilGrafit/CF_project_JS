import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      welcome: "✨ Добро пожаловать в Cosmic Insight...",
      main_menu_horoscope: "🌟 Получить гороскоп",
      // ... другие переводы
    }
  },
  en: {
    translation: {
      welcome: "✨ Welcome to Cosmic Insight...",
      main_menu_horoscope: "🌟 Get Horoscope",
      // ... other translations
    }
  }
};

export function initI18n(lng: string = 'en') {
  return i18next.createInstance({
    lng,
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false
    }
  });
}
