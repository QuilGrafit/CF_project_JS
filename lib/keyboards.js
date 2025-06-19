export function mainMenu(ctx) {
  return Markup.keyboard([
    [ctx.i18n.t('main_menu_horoscope')],
    [ctx.i18n.t('main_menu_settings'), ctx.i18n.t('main_menu_support')],
    [ctx.i18n.t('main_menu_entertainment')]
  ]).resize();
}

export function settingsMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Изменить знак', 'change_sign')],
    // ... другие кнопки
  ]);
}
