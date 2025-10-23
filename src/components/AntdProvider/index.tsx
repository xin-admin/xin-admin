import {App, ConfigProvider, type ThemeConfig} from 'antd';
import {type PropsWithChildren, useEffect, useMemo, useState} from 'react';
import '@ant-design/v5-patch-for-react-19';
import algorithm from "@/layout/algorithm.ts";
import {useGlobalStore} from "@/stores";
import {ProConfigProvider} from "@ant-design/pro-components";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

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

  const { i18n } = useTranslation();
  const [antdLocale, setAntdLocale] = useState<any>(null);

  useEffect(() => {
    const loadAntdLocale = async () => {
      try {
        switch (i18n.language) {
          case 'zh-CN':
          case 'zh':
            {
              const zhCN = await import('antd/locale/zh_CN');
              await import('dayjs/locale/zh-cn');
              dayjs.locale('zh-cn');
              setAntdLocale(zhCN.default);
              break;
            }
          case 'en-US':
          case 'en':
            {
              const enUS = await import('antd/locale/en_US');
              await import('dayjs/locale/en');
              dayjs.locale('en');
              setAntdLocale(enUS.default);
              break;
            }
          case 'ja-JP':
          case 'jp':
            {
              const jaJP = await import('antd/locale/ja_JP');
              await import('dayjs/locale/ja');
              dayjs.locale('ja');
              setAntdLocale(jaJP.default);
              break;
            }
          // 添加更多语言...
          default:
            {
              const defaultLocale = await import('antd/locale/zh_CN');
              await import('dayjs/locale/zh-cn');
              dayjs.locale('zh-cn');
              setAntdLocale(defaultLocale.default);
            }
        }
      } catch (error) {
        console.error('Failed to load antd locale:', error);
      }
    };

    loadAntdLocale();
  }, [i18n.language]);

  return (
    <ConfigProvider theme={{...theme, cssVar: true}} locale={antdLocale}>
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