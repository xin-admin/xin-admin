import {Outlet} from 'react-router';
import {useGlobalStore} from "@/stores";
import {Layout} from "antd";
import HeaderRender from "@/layout/HeaderRender";
import FooterRender from "@/layout/FooterRender";
import SettingDrawer from "@/layout/SettingDrawer";
import ColumnSiderRender from "@/layout/ColumnSiderRender";
import MenuRender from "@/layout/MenuRender";

const {Content, Sider} = Layout;

const LayoutRender = () => {
  const themeConfig = useGlobalStore(state => state.themeConfig);
  const layout = useGlobalStore(state => state.layout);
  const collapsed = useGlobalStore(state => state.collapsed);

  return (
    <Layout
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{background: themeConfig.background}}
    >
      <SettingDrawer></SettingDrawer>
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
  );
};

export default LayoutRender;
