import {App, ConfigProvider, type ConfigProviderProps, type ThemeConfig} from 'antd';
import {type PropsWithChildren, useEffect, useMemo, useState} from 'react';
import '@ant-design/v5-patch-for-react-19';
import algorithm from "@/layout/algorithm.ts";
import {useGlobalStore} from "@/stores";
import {useTranslation} from "react-i18next";
import {ProConfigProvider} from "@ant-design/pro-components";
import en_US from 'antd/es/locale/en_US';
import ja_JP from 'antd/es/locale/ja_JP';
import zh_CN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-cn';
import dayjs from "dayjs";

type Locale = ConfigProviderProps['locale'];

function ContextHolder() {
  const { message, modal, notification } = App.useApp();
  window.$message = message;
  window.$modal = modal;
  window.$notification = notification;
  return null;
}

const AppProvider = ({ children }: PropsWithChildren) => {
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const theme: ThemeConfig = useMemo(() => ({
    components: {
      Layout: {
        headerPadding: "0 " + themeConfig.headerPadding + "px",
        headerHeight: themeConfig.headerHeight,
        bodyBg: themeConfig.bodyBg,
        footerBg: themeConfig.footerBg,
        headerBg: themeConfig.headerBg,
        headerColor: themeConfig.headerColor,
        siderBg: themeConfig.siderBg,
        footerPadding: 0
      },
      Menu: {
        activeBarBorderWidth: 0,
        itemBg: 'transparent',
      }
    },
    token: {
      colorPrimary: themeConfig.colorPrimary,
      colorBgBase: themeConfig.colorBg,
      colorTextBase: themeConfig.colorText,
      colorError: themeConfig.colorError,
      colorInfo: themeConfig.colorPrimary,
      colorLink: themeConfig.colorPrimary,
      colorSuccess: themeConfig.colorSuccess,
      colorWarning: themeConfig.colorWarning,
      borderRadius: themeConfig.borderRadius,
      controlHeight: themeConfig.controlHeight,
    },
    algorithm: themeConfig.algorithm ? algorithm[themeConfig.algorithm] : undefined
  }), [themeConfig])

  const [locale, setLocal] = useState<Locale>(zh_CN);
  const { i18n } = useTranslation();

  useEffect(() => {
    if( i18n.language === 'en') {
      dayjs.locale('en');
      setLocal(en_US);
    } else if (i18n.language === 'jp') {
      dayjs.locale('ja');
      setLocal(ja_JP);
    } else {
      dayjs.locale('zh-cn');
      setLocal(zh_CN);
    }
  }, [i18n.language]);

  return (
    <ConfigProvider theme={{...theme, cssVar: true}} locale={locale}>
      <App>
        <ContextHolder />
        <ProConfigProvider dark={themeConfig.themeScheme === 'dark'}>
          {children}
        </ProConfigProvider>
      </App>
    </ConfigProvider>
  );
};

export default AppProvider;