import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type {IAdminUser, IAdminLoginParams} from "@/domain/iAdmin.ts";
import {adminInfo, adminLogin} from "@/api";
import type {IRule} from "@/domain/iRule.ts";

interface AuthState {
    token: string | null
    refresh_token: string | null
    user: IAdminUser | null
    access: string[]
    menus: IRule[]
    login: (credentials: IAdminLoginParams) => Promise<boolean>
    getInfo: () => Promise<void>
    logout: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refresh_token: null,
            user: null,
            access: [],
            menus: [
                {
                    path: "/",
                    elementPath: "/Index/index.tsx"
                },
                {
                    path: "dashboard",
                    elementPath: "/Dashboard/index.tsx"
                }
            ],
            login: async (params) => {
                const { data } = await adminLogin(params);
                 if (!data.success) {
                    return false;
                }
                set({
                    token: data.data.plainTextToken,
                    refresh_token : data.data.refresh_token,
                })
                localStorage.setItem( "token", data.data.plainTextToken)
                localStorage.setItem( "refresh_token", data.data.refresh_token)
                return true;
            },
            getInfo: async () => {
                const {data} = await adminInfo();
                set({
                    user: data.data.info,
                    access: data.data.access,
                    menus: data.data.menus
                })
            },
            logout: () => set({
                token: null,
                user: null,
                refresh_token : null,
                access: [],
                menus: []
            })
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useAuthStore
