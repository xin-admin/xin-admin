import {ConfigProvider, Layout , theme as antTheme} from "antd";
import React, {useMemo} from "react";
import type { ThemeConfig } from 'antd';
import {useGlobalStore} from "@/stores";
import HeaderRender from "@/layout/HeaderRender";
import SiderRender from "@/layout/SiderRender";
import FooterRender from "@/layout/FooterRender";

const { Content } = Layout;

const ClassicRender: React.FC<{children: React.ReactNode}> = (props) => {
    const {children} = props;
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
            colorBorder: themeConfig.colorBorder,
            motion: false,
        },
        algorithm: themeConfig.themeScheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    }), [themeConfig])

    return (
        <ConfigProvider theme={{...theme, cssVar: true}}>
            <Layout
                className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
                style={{background: themeConfig.background}}
            >
                <HeaderRender/>
                <Layout hasSider>
                    <SiderRender/>
                    <Layout className={"relative"}>
                        <Content>
                            {children}
                        </Content>
                        <FooterRender/>
                    </Layout>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default ClassicRender;
