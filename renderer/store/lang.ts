import { makeAutoObservable } from "mobx"
import { LangType } from "../interfaces/lang-type.enum"
import { Dict } from "../interfaces/common.type"
import de from "../translations/de.json"
import en from "../translations/en.json"
import it from "../translations/it.json"
import zh from "../translations/zh-CN.json"

export class LangStore {
  constructor() {
    makeAutoObservable(this)
  }
  lang: LangType = LangType.EN

  translations: Record<LangType, Dict> = {
    en,
    zh_CN: zh,
    de,
    it,
  }
  get translation() {
    return this.translations[this.lang]
  }
  init() {
    const lang = localStorage.getItem("lang") as LangType
    this.setLang(lang || this.lang)
  }
  setLang(lang: LangType) {
    localStorage.setItem("lang", lang)
    this.lang = lang
  }
  t(str: keyof typeof en, data?: Dict): string {
    let processed = ""
    try {
      processed = this.translation[str] || this.translations.en[str]
      if (!processed) {
        return String(str)
      }
      if (data) {
        Object.keys(data).forEach((key) => {
          processed = processed.replace(`\${${key}}`, data[key])
        })
      }
    } catch (err) {
      return str as string
    }

    return processed
  }
}
