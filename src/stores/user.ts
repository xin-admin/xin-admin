import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type {IAdminUser, IAdminLoginParams} from "@/domain/iAdmin.ts";
import {info, login, logout, rules} from "@/api";
import type {IRule} from "@/domain/iRule.ts";

interface AuthState {
    token: string | null
    refresh_token: string | null
    user: IAdminUser | null
    user_id : number | null
    user_name: string | null
    access: string[]
    rules: IRule[]
    login: (credentials: IAdminLoginParams) => Promise<boolean>
    getInfo: () => Promise<void>
    logout: () => Promise<void>
    setRules: (rules: IRule[]) => Promise<void>
    setAccess: (access: string[]) => Promise<void>
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
            rules: [],
            login: async (params) => {
                const { data } = await login(params);
                 if (!data.success) {
                    return false;
                }
                set({ token: data.data.plainTextToken })
                localStorage.setItem( "token", data.data.plainTextToken)
                return true;
            },
            getInfo: async () => {
                const {data} = await info();
                const rulesRes = await rules();
                const rulesData = rulesRes.data.data;
                const access = rulesData.map(rule => rule.key!);
                set({
                    user: data.data,
                    rules: rulesData,
                    access: access,
                    user_id: data.data.user_id,
                    user_name: data.data.username
                });
            },
            setRules: async (rules: IRule[]) => {
                const access = rules.map(rule => rule.key!);
                set({
                    access: access,
                    rules: rules
                });
            },
            setAccess: async (access: string[]) => {
                set({
                    access: access,
                })
            },
            logout: async () => {
                await logout()
                localStorage.removeItem('token')
                localStorage.removeItem('refresh_token')
                set({
                    token: null,
                    refresh_token: null,
                    user: null,
                    access: [],
                    rules: []
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
