import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GlobalState {
    logo:  string;
    title: string;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        () => ({
            logo: "https://file.xinadmin.cn/file/favicons.ico",
            title: "Xin Admin",
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)