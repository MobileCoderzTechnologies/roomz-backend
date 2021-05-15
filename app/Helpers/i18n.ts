import i18n from 'i18n';

i18n.configure({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  directory: 'locales',
  api: {
    '__': 'translate',
    '__n': 'translateN'
  },
});
export default i18n;