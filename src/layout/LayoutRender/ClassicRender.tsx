import {Outlet} from "react-router";
import {Breadcrumb, ConfigProvider, Layout, Menu, type ThemeConfig} from "antd";
import React from "react";
import type { MenuProps } from 'antd';
import {useGlobalStore} from "@/stores";

type MenuItem = Required<MenuProps>['items'][number];
const { Header, Content, Footer, Sider } = Layout;

function getItem(
    label: React.ReactNode,
    key: React.Key,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Option 1', '1',),
    getItem('Option 2', '2'),
    getItem('User', 'sub1', [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9'),
];


const ClassicRender = () => {
    const {logo, title} = useGlobalStore();

    const layoutStyle = {
        color: 'rgba(0,0,0,0.88)',
        bgColor: '#fff',
        headerHeight: 56,
        borderStyle: '1px solid #ebebeb'
        // color: 'rgba(251,251,251,0.88)',
        // bgColor: '#1d2938',
        // headerHeight: 56,
        // borderStyle: '1px solid #171d4d'
    }

    const globalTheme: ThemeConfig = {
        components: {
            Layout: {
                siderBg: layoutStyle.bgColor,
                headerBg: layoutStyle.bgColor,
                headerColor: layoutStyle.color,
                headerHeight: layoutStyle.headerHeight
            },
            Menu: {
                activeBarBorderWidth: 0,
                itemBg: layoutStyle.bgColor,
                itemColor: layoutStyle.color,
                darkItemBg: layoutStyle.bgColor,
            }
        },
    }

    const siderStyle: React.CSSProperties = {
        top: 0,
        bottom: 0,
        position: 'sticky',
        zIndex: 100,
        overflow: "auto",
        height: '100vh',
        borderRight: layoutStyle.borderStyle,
    };

    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        borderBottom: layoutStyle.borderStyle,
    }

    const logoStyle: React.CSSProperties = {
        height: layoutStyle.headerHeight,
        borderBottom: layoutStyle.borderStyle,
    }

    return (
        <ConfigProvider theme={globalTheme}>
            <Layout className="min-h-screen">
                <Sider style={siderStyle} width={256}>
                    <div className="flex justify-center items-center mb-3" style={logoStyle}>
                        <img className="w-8 mr-[10px]" src={ logo } alt="logo" />
                        <h1 className="font-semibold text-[18px]" style={{color: layoutStyle.color}}>{ title }</h1>
                    </div>
                    <Menu defaultSelectedKeys={['1']} mode="inline" items={items}/>
                </Sider>
                <Layout>
                    <Header style={headerStyle}></Header>
                    <Content style={{margin: '0 16px'}}>
                        <Breadcrumb style={{margin: '16px 0'}} items={[{title: 'User'}, {title: 'Bill'}]}/>
                        <Outlet></Outlet>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>

    )
}

export default ClassicRender;