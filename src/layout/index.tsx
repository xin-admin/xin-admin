import {Outlet} from 'react-router';
import SettingDrawer from "@/layout/SettingDrawer.tsx";
import {useGlobalStore} from "@/stores";
import {ConfigProvider, Layout, type ThemeConfig} from "antd";
import {useMemo} from "react";
import HeaderRender from "@/layout/HeaderRender.tsx";
import FooterRender from "@/layout/FooterRender.tsx";
import ColumnSiderRender from "@/layout/ColumnSiderRender.tsx";
import {ProConfigProvider} from "@ant-design/pro-components";
import algorithm from "@/layout/algorithm.ts";
import MenuRender from "@/layout/MenuRender.tsx";
import Sider from "antd/es/layout/Sider";

const {Content} = Layout;

const LayoutRender = () => {
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const layout = useGlobalStore(state => state.layout);
  const collapsed = useGlobalStore(state => state.collapsed);
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

  return (
    <ConfigProvider theme={{...theme, cssVar: true}}>
      <ProConfigProvider dark={themeConfig.themeScheme === 'dark'}>
        <SettingDrawer></SettingDrawer>
        <Layout
          className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
          style={{background: themeConfig.background}}
        >
          {layout === 'columns' ? (
            <>
              <ColumnSiderRender/>
              <Layout className={"relative"}>
                <HeaderRender/>
                <Content style={{padding: themeConfig.bodyPadding}}>
                  <Outlet/>
                </Content>
                <FooterRender/>
              </Layout>
            </>
          ) : (
            <>
              <HeaderRender/>
              <Layout hasSider>
                {(layout === "mix" || layout === "side") && (
                  <Sider
                    collapsed={collapsed}
                    width={themeConfig.siderWeight}
                    className={"sticky backdrop-blur-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
                    style={{
                      bottom: 0,
                      overflow: 'auto',
                      top: themeConfig.headerHeight,
                      height: `calc(100vh - ${themeConfig.headerHeight}px)`,
                      borderRight: themeConfig.layoutBorder ? '1px solid ' + themeConfig.colorBorder : 'none',
                    }}
                  >
                    <MenuRender />
                  </Sider>
                )}
                <Layout className={"relative"}>
                  <Content style={{padding: themeConfig.bodyPadding}}>
                    <Outlet/>
                  </Content>
                  <FooterRender/>
                </Layout>
              </Layout>
            </>
          )}
        </Layout>
      </ProConfigProvider>
    </ConfigProvider>
  );
};

export default LayoutRender;
