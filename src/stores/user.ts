import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type {IAdminUser, IAdminLoginParams} from "@/domain/iAdmin.ts";
import {adminInfo, adminLogin, adminLogout} from "@/api";
import type {IRule} from "@/domain/iRule.ts";
import defaultRoute from "@/router/default.ts";

interface AuthState {
    token: string | null
    refresh_token: string | null
    user: IAdminUser | null
    user_id : number | null
    user_name: string | null
    access: string[]
    menus: IRule[]
    login: (credentials: IAdminLoginParams) => Promise<boolean>
    getInfo: () => Promise<void>
    logout: () => Promise<void>
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refresh_token: null,
            user: null,
            user_id: null,
            user_name: null,
            access: [],
            menus: defaultRoute,
            login: async (params) => {
                const { data } = await adminLogin(params);
                 if (!data.success) {
                    return false;
                }
                set({
                    token: data.data.plainTextToken,
                    user_id : data.data.accessToken.id,
                    user_name: data.data.accessToken.name,
                })
                localStorage.setItem( "token", data.data.plainTextToken)
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
            logout: async () => {
                await adminLogout()
                localStorage.removeItem('token')
                localStorage.removeItem('refresh_token')
                set({
                    token: null,
                    refresh_token: null,
                    user: null,
                    access: [],
                    menus: []
                })
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useAuthStore
