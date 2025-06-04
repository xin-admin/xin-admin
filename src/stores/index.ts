import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {ProSettings} from "@ant-design/pro-components";

interface GlobalState {
    logo:  string;
    title: string;
    layoutSetting: ProSettings;
    setLayout: (layoutSetting: ProSettings) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (setState) => ({
            logo: "https://file.xinadmin.cn/file/favicons.ico",
            title: "Xin Admin",
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
            }
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)