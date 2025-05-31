import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {IRule} from "@/domain/iRule.ts";

interface GlobalState {
    routes: IRule[]
    setRoutes: (routes: IRule[]) => void
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            routes: [],
            setRoutes: (routes: IRule[]) => set(() => ({ routes: routes })),
        }),
        {
            name: 'global-store-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)