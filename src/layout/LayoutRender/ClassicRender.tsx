import {ConfigProvider, Layout , theme as antTheme} from "antd";
import React from "react";
import type { ThemeConfig } from 'antd';
import {useGlobalStore} from "@/stores";
import HeaderLeftRender from "@/layout/HeaderLeftRender.tsx";
import HeaderBodyRender from "@/layout/HeaderBodyRender.tsx";
import HeaderRightRender from "@/layout/HeaderRightRender.tsx";
import SiderRender from "@/layout/SiderRender.tsx";
import FooterRender from "@/layout/FooterRender.tsx";
const { Header, Content } = Layout;

const ClassicRender: React.FC<{children: React.ReactNode}> = (props) => {
    const {children} = props;
    const {themeConfig} = useGlobalStore();

    const theme: ThemeConfig = {
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
                activeBarBorderWidth: 0
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
    }

    return (
        <ConfigProvider theme={theme}>
            <Layout className="min-h-screen" style={{
                // backgroundImage: `url(/fmt.webp)`,
            }}>
                <Header
                    className={"flex border-b-1 border-solid sticky z-1 top-0"}
                    style={{borderBottomColor: themeConfig.colorBorder}}
                >
                    <HeaderLeftRender/>
                    <HeaderBodyRender/>
                    <HeaderRightRender/>
                </Header>
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
