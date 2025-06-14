import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {AppListProps} from "@ant-design/pro-components";
import type {BreadcrumbProps} from "antd";
import type {LayoutType, ThemeProps} from "@/layout/typing";
import {configTheme, defaultColorTheme} from "@/layout/theme";

interface GlobalState {
    logo:  string;
    title: string;
    layout: LayoutType;
    themeConfig: ThemeProps;
    collapsed: boolean;
    themeDrawer: boolean;
    appList: AppListProps;
    mixValue: string;
    setCollapsed: (collapsed: boolean) => void;
    breadcrumbItems: BreadcrumbProps['items'];
    setThemeConfig: (themeConfig: ThemeProps) => void;
    setThemeDrawer: (themeDrawer: boolean) => void;
    setTheme: (theme: ThemeProps) => void;
    setLayout:  (layout: LayoutType) => void;
    setMixValue: (mixValue: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (setState) => ({
            logo: "https://file.xinadmin.cn/file/favicons.ico",
            title: "Xin Admin",
            layout: "side",
            themeConfig: {...defaultColorTheme, ...configTheme},
            collapsed: false,
            themeDrawer: false,
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
            mixValue: '',
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
            },
            setMixValue: (mixValue: string) => {
                setState({mixValue})
            },
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
