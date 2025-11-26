import { type MenuProps, type ConfigProviderProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import en_US from 'antd/es/locale/en_US';
import ja_JP from 'antd/es/locale/ja_JP';
import zh_CN from 'antd/es/locale/zh_CN';
import fr_FR from 'antd/es/locale/fr_FR';
import ru_RU from 'antd/es/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/fr';
import 'dayjs/locale/ru';

type Locale = ConfigProviderProps['locale'];

/**
 * 语言选项配置
 */
export const LANGUAGE_OPTIONS = [
  { label: '简体中文', value: 'zh', antdLocale: zh_CN, dayjsLocale: 'zh-cn' },
  { label: 'English', value: 'en', antdLocale: en_US, dayjsLocale: 'en' },
  { label: '日本語です', value: 'jp', antdLocale: ja_JP, dayjsLocale: 'ja' },
  { label: 'Français', value: 'fr', antdLocale: fr_FR, dayjsLocale: 'fr' },
  { label: 'Русский', value: 'ru', antdLocale: ru_RU, dayjsLocale: 'ru' },
] as const;

/**
 * 语言切换自定义 Hook
 * 提供语言切换功能和菜单项配置
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  /**
   * 切换语言
   * @param lng 语言代码
   */
  const changeLanguage = async (lng: string) => {
    const config = getLanguageConfig(lng);
    dayjs.locale(config.dayjsLocale);
    await i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  /**
   * 生成语言下拉菜单项
   */
  const getLanguageMenuItems = (): MenuProps['items'] => {
    return LANGUAGE_OPTIONS.map((option) => ({
      key: option.value,
      label: option.label,
      onClick: () => changeLanguage(option.value),
    }));
  };

  /**
   * 获取当前语言配置对象
   */
  const getLanguageConfig = (lng: string) => {
    return LANGUAGE_OPTIONS.find(opt => opt.value === lng) || LANGUAGE_OPTIONS[0];
  };

  return {
    language: i18n.language,
    changeLanguage,
    getLanguageMenuItems,
    getLanguageConfig,
    languageOptions: LANGUAGE_OPTIONS,
  };
};

/**
 * 使用 Antd Locale Hook
 * 专门用于 Antd ConfigProvider 的 locale 配置
 * 自动根据当前语言返回对应的 Antd locale，并监听语言变化
 */
export const useAntdLocale = (): Locale => {
  const { i18n } = useTranslation();
  
  const locale = useMemo(() => {
    const currentLang = i18n.language;
    const config = LANGUAGE_OPTIONS.find(opt => opt.value === currentLang);
    return config ? config.antdLocale : LANGUAGE_OPTIONS[0].antdLocale;
  }, [i18n.language]);

  return locale;
};
