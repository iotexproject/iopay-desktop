import { action, computed, observable } from 'mobx';
import remotedev from 'mobx-remotedev';
import { Dict } from '../interfaces/dict.type';
import { LangType } from '../interfaces/lang-type.enum';
import de from '../translations/de.json';
import en from '../translations/en.json';
import it from '../translations/it.json';
import zh from '../translations/zh-CN.json';

@remotedev({ name: 'lang' })
export class LangStore {
  public langPath = '../translations';

  @observable
  public lang: LangType = LangType.EN;

  @observable
  public translations: Record<LangType, Dict> = {
    en,
    'zh-CN': zh,
    de,
    it,
  };

  @computed
  public get translation() {
    return this.translations[this.lang];
  }

  @action.bound
  public init() {
    const lang = localStorage.getItem('lang') as LangType;
    this.setLang(lang || this.lang);
  }

  @action.bound
  public setLang(lang: LangType) {
    localStorage.setItem('lang', lang);
    this.lang = lang;
  }

  public t(str: keyof Dict, data?: Dict): string {
    let processed = '';
    try {
      processed = this.translation[str] || this.translations.en[str];
      if (!processed) {
        return String(str);
      }
      if (data) {
        Object.keys(data).forEach((key) => {
          processed = processed.replace(`\${${key}}`, data[key]);
        });
      }
    } catch (err) {
      return str as string;
    }

    return processed;
  }
}
