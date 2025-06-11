import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {ProSettings} from "@ant-design/pro-components";
import type {AppListProps} from "@ant-design/pro-components";
import type {BreadcrumbProps, MenuProps} from "antd";
import React from "react";
import type {ThemeProps} from "@/layout/typing.ts";
import {configTheme, defaultColorTheme} from "@/layout/theme.ts";

type MenuItem = Required<MenuProps>['items'][number];

interface GlobalState {
    logo:  string;
    title: string;
    themeConfig: ThemeProps;
    collapsed: boolean;
    siderMenus: MenuItem[];
    appList: AppListProps;
    layoutSetting: ProSettings;
    setLayout: (layoutSetting: ProSettings) => void;
    setCollapsed: (collapsed: boolean) => void;
    breadcrumbItems: BreadcrumbProps['items'];
    setThemeConfig: (themeConfig: ThemeProps) => void;
}

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

export const useGlobalStore = create<GlobalState>()(
    persist(
        (setState) => ({
            logo: "https://file.xinadmin.cn/file/favicons.ico",
            title: "Xin Admin",
            themeConfig: {...defaultColorTheme, ...configTheme},
            collapsed: false,
            siderMenus: items,
            breadcrumbItems: [
                {
                    title: 'Home',
                },
                {
                    title: 'List',
                },
                {
                    title: 'App',
                },
            ],
            appList: [
                {
                    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
                    title: 'Ant Design',
                    desc: '杭州市较知名的 UI 设计语言',
                    url: 'https://ant.design',
                },
                {
                    icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
                    title: 'AntV',
                    desc: '蚂蚁集团全新一代数据可视化解决方案',
                    url: 'https://antv.vision/',
                    target: '_blank',
                },
                {
                    icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                    title: 'Pro Components',
                    desc: '专业级 UI 组件库',
                    url: 'https://procomponents.ant.design/',
                },
                {
                    icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
                    title: 'umi',
                    desc: '插件化的企业级前端应用框架。',
                    url: 'https://umijs.org/zh-CN/docs',
                },

                {
                    icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
                    title: 'qiankun',
                    desc: '可能是你见过最完善的微前端解决方案🧐',
                    url: 'https://qiankun.umijs.org/',
                },
                {
                    icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
                    title: '语雀',
                    desc: '知识创作与分享工具',
                    url: 'https://www.yuque.com/',
                },
                {
                    icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
                    title: 'Kitchen ',
                    desc: 'Sketch 工具集',
                    url: 'https://kitchen.alipay.com/',
                },
                {
                    icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
                    title: 'dumi',
                    desc: '为组件开发场景而生的文档工具',
                    url: 'https://d.umijs.org/zh-CN',
                },
            ],
            layoutSetting: {
                "navTheme": "light",
                "layout": "mix",
                "contentWidth": "Fluid",
                "fixSiderbar": true,
                "colorPrimary": "#1677FF",
                "siderMenuType": "group",
                "splitMenus": false,
                "fixedHeader": true
            },
            setLayout: (layoutSetting: ProSettings) => {
                setState({layoutSetting})
            },
            setCollapsed: (collapsed: boolean) => {
                setState({collapsed})
            },
            setThemeConfig: (themeConfig: ThemeProps) => {
                setState({themeConfig})
            }
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
