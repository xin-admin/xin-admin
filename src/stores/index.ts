import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {AppListProps} from "@ant-design/pro-components";
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
    menuSelectedKeys:  string[];
    setCollapsed: (collapsed: boolean) => void;
    setThemeConfig: (themeConfig: ThemeProps) => void;
    setThemeDrawer: (themeDrawer: boolean) => void;
    setTheme: (theme: ThemeProps) => void;
    setLayout:  (layout: LayoutType) => void;
    setMenuSelectedKeys:  (menuSelectedKeys: string[]) => void;
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
            appList: [],
            menuSelectedKeys: [],
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
            setMenuSelectedKeys: (menuSelectedKeys: string[]) => {
                setState({menuSelectedKeys})
            }
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
