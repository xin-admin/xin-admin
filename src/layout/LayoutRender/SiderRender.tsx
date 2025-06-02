import {Outlet} from "react-router";
import {Breadcrumb, ConfigProvider, Layout, Menu, type ThemeConfig} from "antd";
import HeaderTitleRender from "@/layout/HeaderTitleRender.tsx";
import React from "react";
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

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

const bgLayoutImgList: { src: string; style: React.CSSProperties  }[] = [
    {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        style: {
            left: 30,
            top: 200,
            height: '303px',
            position: 'absolute'
        }
    },
    {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        style: {
            bottom: 0,
            left: 0,
            width: '331px',
            position: 'absolute'
        }
    },
]

const globalTheme: ThemeConfig = {
    components: {
        Layout: {
            siderBg: "transparent",
        },
        Menu: {
            colorBgContainer: "transparent",
            activeBarBorderWidth: 0
        }
    },
}

const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: '100vh',
    position: 'sticky',
    backgroundColor: 'transparent',
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    zIndex: 100,
    borderRight: '1px solid #ebebeb',
    padding: '0 6px',
};

const siderBgStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'fixed',
    overflow: 'hidden',
    zIndex: 0,
    height: '100%',
    width: '100%',
    background: 'linear-gradient(#ffffff, #f5f5f5 28%)'
}

const SiderRender = () => {
    return (
        <ConfigProvider theme={globalTheme}>
            <div style={siderBgStyle}>
                {
                    bgLayoutImgList?.map((item, index) => {
                        return <img key={index} src={item.src} style={item.style} alt={''}/>;
                    })
                }
            </div>
            <Layout className="min-h-screen">
                <Sider style={siderStyle} width={226}>
                    <HeaderTitleRender/>
                    <Menu defaultSelectedKeys={['1']} mode="inline" items={items}/>
                </Sider>
                <Layout style={{position: 'relative'}}>
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

export default SiderRender;