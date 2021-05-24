// import i18n from './i18n';

/**
 * Locales
 */
export default class Locales {
  i18n: any;
  /**
   *
   * @param i18n The i18n provider
   */
  constructor(i18n) {
    this.i18n = i18n;
  }

  /**
   *
   * @returns {string} The current locale code
   */
  getCurrentLocale() {
    return this.i18n.getLocale();
  }

  /**
   *
   * @returns string[] The list of available locale codes
   */
  getLocales() {
    return this.i18n.getLocales();
  }

  /**
   *
   * @param locale The locale to set. Must be from the list of available locales.
   */
  setLocale(locale) {
    if (this.i18n.getLocales().indexOf(locale) !== -1) {
      this.i18n.setLocale(locale)
    }
  }

  /**
   *
   * @param string String to translate
   * @param args Extra parameters
   * @returns {string} Translated string
   */
  t(string, args: any = undefined) {
    return this.i18n.__(string, args);
  }

  /**
   *
   * @param phrase Object to translate
   * @param count The plural number
   * @returns {string} Translated string
   */
  tN(phrase, count) {
    return this.i18n.__n(phrase, count)
  }
}

// const Locales = new Locales(i18n);
// const { t, tN, setLocale, getCurrentLocale, getLocales } = Locales;
// export default { t, tN, setLocale, getLocales, getCurrentLocale };