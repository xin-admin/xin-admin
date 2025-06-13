import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {AppListProps} from "@ant-design/pro-components";
import type {BreadcrumbProps, MenuProps} from "antd";
import React from "react";
import type {LayoutType, ThemeProps} from "@/layout/typing";
import {configTheme, defaultColorTheme} from "@/layout/theme";

type MenuItem = Required<MenuProps>['items'][number];

interface GlobalState {
    logo:  string;
    title: string;
    layout: LayoutType;
    themeConfig: ThemeProps;
    collapsed: boolean;
    themeDrawer: boolean;
    siderMenus: MenuItem[];
    appList: AppListProps;
    setCollapsed: (collapsed: boolean) => void;
    breadcrumbItems: BreadcrumbProps['items'];
    setThemeConfig: (themeConfig: ThemeProps) => void;
    setThemeDrawer: (themeDrawer: boolean) => void;
    setTheme: (theme: ThemeProps) => void;
    setLayout:  (layout: LayoutType) => void;
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
            layout: "side",
            themeConfig: {...defaultColorTheme, ...configTheme},
            collapsed: false,
            themeDrawer: false,
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
            appList: [],
            setCollapsed: (collapsed: boolean) => {
                setState({collapsed})
            },
            setThemeConfig: (themeConfig: ThemeProps) => {
                setState({themeConfig})
            },
            setThemeDrawer: (themeDrawer: boolean) => {
                setState({themeDrawer})
            },
            setTheme: (theme: ThemeProps) => {
                setState({themeConfig: theme})
            },
            setLayout: (layout: LayoutType) => {
                setState({layout})
            }
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
