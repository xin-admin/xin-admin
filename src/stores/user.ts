import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type ISysUser from "@/domain/iSysUser.ts";
import {info, login, logout} from "@/api/admin.ts";
import type {LoginParams, InfoResponse} from "@/api/admin.ts";
import type {IMenus} from "@/domain/iSysRule.ts";
import defaultRoute from "@/router/default.ts";

type BreadcrumbType = {
  href?: string;
  title?: string;
  icon?: string;
  local?: string;
};

interface AuthState {
  token: string | null;
  refresh_token: string | null;
  user: ISysUser | null;
  user_id: number | null;
  user_name: string | null;
  access: string[];
  menus: IMenus[];
  menuMap: {[key: string]: IMenus };
  localRoute: boolean;
  breadcrumbMap: {[key: string]: BreadcrumbType[] };
  login: (credentials: LoginParams) => Promise<boolean>;
  getInfo: () => Promise<void>;
  logout: () => Promise<void>;
  setMenus: (rules: IMenus[]) => Promise<void>;
  setAccess: (access: string[]) => Promise<void>;
  setLocalRoute: (isLocal: boolean) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, getState) => ({
      token: null,
      refresh_token: null,
      user: null,
      user_id: null,
      user_name: null,
      access: [],
      menus: [],
      menuMap: {},
      breadcrumbMap: {},
      localRoute: true,
      login: async (params) => {
        const {data} = await login(params);
        if (!data.success || !data.data) {
          return false;
        }
        set({token: data.data.plainTextToken})
        localStorage.setItem("token", data.data.plainTextToken)
        return true;
      },
      getInfo: async () => {
        const result = await info();
        const data: InfoResponse = result.data.data!;
        const menuMap: {[key: string]: IMenus } = {};
        const breadcrumbMap: {[key: string]: BreadcrumbType[] } = {};
        const buildMenuIndexes = (menus: IMenus[], parentBreadcrumb: IMenus[] = []) => {
          for (const menu of menus) {
            if (!menu.key) continue;
            menuMap[menu.key] = menu;
            const currentBreadcrumb = [
              ...parentBreadcrumb,
              { href: menu.path, title: menu.name, icon: menu.icon, local: menu.local }
            ];
            breadcrumbMap[menu.key] = currentBreadcrumb;
            if (menu.children?.length) {
              buildMenuIndexes(menu.children, currentBreadcrumb);
            }
          }
        };
        let menus: IMenus[];
        if (getState().localRoute) {
          menus = defaultRoute;
        }else {
          menus = data.menus;
        }
        buildMenuIndexes(menus);
        set({
          menus,
          menuMap,
          breadcrumbMap,
          user: data.info,
          access: data.access,
          user_id: data.info.id,
          user_name: data.info.username,
        });
      },
      setMenus: async (menus: IMenus[]) => {
        set({
            menus: menus,
        })
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
          menus: []
        })
      },
      setLocalRoute: async (isLocal: boolean) => {
        set({ localRoute: isLocal })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore
