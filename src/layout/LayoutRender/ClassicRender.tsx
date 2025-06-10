import {Breadcrumb, Button, ConfigProvider, Layout, Menu , theme as antTheme} from "antd";
import React, {useState} from "react";
import type { ThemeConfig, BreadcrumbProps, MenuProps } from 'antd';
import {useGlobalStore} from "@/stores";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
const { useToken } = antTheme;
const { Header, Content, Footer, Sider } = Layout;

interface ClassicProps {
    children: React.ReactNode;
    menus: MenuProps['items'];
}

const ClassicRender: React.FC<ClassicProps> = (props) => {
    const {children, menus} = props;
    const {logo, title} = useGlobalStore();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const {token} = useToken();

    const themeConfig = {
        // 主题
        themeScheme: "dack",
        // 品牌色
        colorPrimary: "#704cff",
        // 错误色
        colorError: "#ff4d4f",
        // 信息色
        colorInfo: "#1677ff",
        // 链接色
        colorLink: "#1677ff",
        // 成功色
        colorSuccess: "#52c41a",
        // 警告色
        colorWarning: "#faad14",
        // 基础组件的圆角大小
        borderRadius: 24,
        // 按钮和输入框等基础控件的高度
        controlHeight: 32,
        // 是否开启动画
        motion: false,
        // 头部两侧内边距
        headerPadding: 20,
        // 头部高度
        headerHeight: 56,
        // 亮色模式下内容区域背景色
        lightBodyBg: "#ffffff",
        // 暗色模式下内容区域背景色
        darkBodyBg: "#000000",
        // 侧边栏宽度
        siderWeight: 226,
        // 固定页脚
        fixedFooter: true,
        // 主题色
        theme: {
            // ---------------- 亮色模式 ----------------
            // // 基础文字颜色
            // colorText: "#000",
            // // 基础背景颜色
            // colorBg: "#fff",
            // // 内容区域背景色
            // bodyBg: "transparent",
            // // 页脚背景色
            // footerBg: "#fff",
            // // 头部背景色
            // headerBg: "#fff",
            // // 头部文字颜色
            // headerColor: "#000",
            // // 侧边栏背景色
            // siderBg: "#fff",
            // // 布局分割线边框颜色
            // colorBorder: token.colorBorderSecondary,
            // ---------------- 暗色模式 ----------------
            // 基础文字颜色
            colorText: "#e1e1e1",
            // 基础背景颜色
            colorBg: "#000",
            // 内容区域背景色
            bodyBg: "#000",
            // 页脚背景色
            footerBg: "#000",
            // 头部背景色
            headerBg: "#000",
            // 头部文字颜色
            headerColor: "#fff",
            // 侧边栏背景色
            siderBg: "#000",
            // 布局分割线边框颜色
            colorBorder: "#3b3b3b",
        }
    }

    const theme: ThemeConfig = {
        components: {
            Layout: {
                headerPadding: "0 " + themeConfig.headerPadding + "px",
                headerHeight: themeConfig.headerHeight,
                bodyBg: themeConfig.theme.bodyBg,
                footerBg: themeConfig.theme.footerBg,
                headerBg: themeConfig.theme.headerBg,
                headerColor: themeConfig.theme.headerColor,
                siderBg: themeConfig.theme.siderBg,
            },
            Menu: {
                activeBarBorderWidth: 0
            }
        },
        token: {
            colorPrimary: themeConfig.colorPrimary,
            colorBgBase: themeConfig.theme.colorBg,
            colorTextBase: themeConfig.theme.colorText,
            colorError: themeConfig.colorError,
            colorInfo: themeConfig.colorInfo,
            colorLink: themeConfig.colorLink,
            colorSuccess: themeConfig.colorSuccess,
            colorWarning: themeConfig.colorWarning,
            borderRadius: themeConfig.borderRadius,
            controlHeight: themeConfig.controlHeight,
            motion: false,
        },
        algorithm: themeConfig.themeScheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    }

    const [breadcrumbItems, setBreadcrumbItems]  = useState<BreadcrumbProps['items']>([
        {
            title: 'Home',
        },
        {
            title: 'List',
        },
        {
            title: 'App',
        },
    ]);

    return (
        <ConfigProvider theme={theme}>
            <Layout className="min-h-screen">
                <Header className={"border-b-1 border-solid sticky z-1 top-0"} style={{borderBottomColor: themeConfig.theme.colorBorder}}>
                    <div className={"flex items-center"}>
                        <img className={"w-9 mr-5"} src={logo} alt="logo"/>
                        <span className={"font-semibold text-[20px] mr-2"}>{title}</span>
                        <Button
                            type={'text'}
                            className={'text-[16px] mr-2'}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            { collapsed ?
                                <MenuUnfoldOutlined  />
                                :
                                <MenuFoldOutlined/>
                            }
                        </Button>
                        <Breadcrumb items={breadcrumbItems}/>
                    </div>
                </Header>
                <Layout hasSider>
                    <Sider
                        collapsed={collapsed}
                        width={themeConfig.siderWeight}
                        className={"p-2.5 border-r-1 border-solid sticky overflow-auto bottom-0"}
                        style={{
                            borderRightColor: themeConfig.theme.colorBorder,
                            top: themeConfig.headerHeight,
                            height: `calc(100vh - ${themeConfig.headerHeight}px)`,
                        }}
                    >
                        <Menu
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            items={menus}
                        />
                    </Sider>
                    <Layout className={"relative"}>
                        <Content>
                            {children}
                        </Content>
                        <Footer
                            className={
                                (themeConfig.fixedFooter ? 'fixed' : 'absolute') +
                                " bottom-0 border-t-1 border-solid z-10 w-full"
                            }
                            style={{borderTopColor: themeConfig.theme.colorBorder}}
                        >
                            <div className={"flex items-center justify-center w-full"}>
                                Xin Admin ©{new Date().getFullYear()} Created by xiaoliu
                            </div>
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default ClassicRender;
