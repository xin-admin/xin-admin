import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type {AppListProps} from "@ant-design/pro-components";
import type {LayoutType, ThemeProps} from "@/layout/typing";
import {configTheme, defaultColorTheme} from "@/layout/theme";

type BreadcrumbType = {
  href?: string;
  title?: string;
  icon?: string;
  local?: string;
};

interface GlobalState {
  logo: string;
  title: string;
  headTitle: string;
  layout: LayoutType;
  themeConfig: ThemeProps;
  collapsed: boolean;
  themeDrawer: boolean;
  appList: AppListProps;
  breadcrumb: BreadcrumbType[];
  menuParentKey: string | null;
  setHeadTitle: (title: string) => void;
  setCollapsed: (collapsed: boolean) => void;
  setThemeConfig: (themeConfig: ThemeProps) => void;
  setThemeDrawer: (themeDrawer: boolean) => void;
  setLayout: (layout: LayoutType) => void;
  setBreadcrumb: (breadcrumb: BreadcrumbType[]) => void;
  setMenuParentKey: (menuParentKey: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (setState) => ({
      logo: "https://file.xinadmin.cn/file/favicons.ico",
      title: "Xin Admin",
      headTitle: "Xin Admin",
      layout: "side",
      themeConfig: {...defaultColorTheme, ...configTheme},
      collapsed: false,
      themeDrawer: false,
      appList: [],
      breadcrumb: [],
      menuParentKey: null,
      setHeadTitle: (headTitle: string) => {
        setState({headTitle})
      },
      setCollapsed: (collapsed: boolean) => {
        setState({collapsed})
      },
      setThemeConfig: (themeConfig: ThemeProps) => {
        setState({themeConfig})
      },
      setThemeDrawer: (themeDrawer: boolean) => {
        setState({themeDrawer})
      },
      setLayout: (layout: LayoutType) => {
        setState({layout})
      },
      setBreadcrumb: (breadcrumb: BreadcrumbType[]) => {
        setState({breadcrumb})
      },
      setMenuParentKey: (menuParentKey: string) => {
        setState({menuParentKey})
      }
    }),
    {
      name: 'global-store-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
