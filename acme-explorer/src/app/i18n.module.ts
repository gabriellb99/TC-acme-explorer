import {APP_INITIALIZER, Injectable, LOCALE_ID} from "@angular/core";
import {registerLocaleData} from "@angular/common";
import {loadTranslations} from "@angular/localize";

@Injectable({
  providedIn: 'root',
})

class I18n {
  locale = '';

  async setLocale() {

    this.locale = getLocale();

    const localeModule = await import(`/node_modules/@angular/common/locales/${this.locale}.mjs`)
    registerLocaleData(localeModule.default);

    const localeTranslationsModule = await import(`src/assets/i18n/messages_${this.locale}.json`)

    loadTranslations(localeTranslationsModule.default.translations);

  }
}

function getLocale(): string {
  const locale = localStorage.getItem('locale');
  if (locale)
    return locale;
  return 'en';
}

function setLocale() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18n) => () => i18n.setLocale(),
    deps: [I18n],
    multi: true
  }
}

function setLocaleId() {
  return {
    provide: LOCALE_ID,
    useFactory: (i18n: I18n) => () => i18n.locale,
    deps: [I18n]
  } 
}

export const I18nModule = {
  setLocale : setLocale,
  setLocaleId: setLocaleId
}
