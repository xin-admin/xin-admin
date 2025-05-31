import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type {IAdminUser} from "@/domain/iAdmin.ts";

interface UserLoginFrom {
    username?: string
    password?: string
    autoLogin?: boolean
    mobile?: string
    captcha?: number
    loginType?: 'phone' | 'account' | 'email'
}

interface AuthState {
    token: string | null
    user: IAdminUser | null
    login: (credentials: UserLoginFrom) => Promise<void>
    logout: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            login: async (credentials) => {
                // 登录逻辑
                set({ token: '...', user: {} })
            },
            getInfo: async () => {
                
            },
            logout: () => set({ token: null, user: null })
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useAuthStore