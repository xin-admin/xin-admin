import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import type ISysUser from "@/domain/iSysUser.ts";
import {info, login, logout} from "@/api/sys/sysUser";
import type {LoginParams, InfoResponse} from "@/api/sys/sysUser";
import type {IMenus} from "@/domain/iSysRule.ts";
import defaultRoute from "@/router/default.ts";

type BreadcrumbType = {
  href?: string;
  title?: string;
  icon?: string;
  local?: string;
};

interface AuthState {
  user: ISysUser | null;
  access: string[];
  menus: IMenus[];
  menuMap: {[key: string]: IMenus };
  localRoute: boolean;
  breadcrumbMap: {[key: string]: BreadcrumbType[] };
  login: (credentials: LoginParams) => Promise<boolean>;
  getInfo: () => Promise<void>;
  logout: () => Promise<void>;
  setMenus: (rules: IMenus[]) => void;
  setAccess: (access: string[]) => void;
  setLocalRoute: (isLocal: boolean) => void;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, getState) => ({
      user: null,
      access: [],
      menus: [],
      menuMap: {},
      breadcrumbMap: {},
      localRoute: true,
      login: async (params) => {
        try {
          const {data} = await login(params);
          if (!data.success || !data.data) {
            return false;
          }
          // 只存储到 localStorage，作为单一真实来源
          localStorage.setItem("token", data.data.plainTextToken);
          return true;
        } catch (error) {
          console.error('登录失败:', error);
          return false;
        }
      },
      getInfo: async () => {
        try {
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
          });
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // 清理状态
          set({ user: null, access: [], menus: [], menuMap: {}, breadcrumbMap: {} });
        }
      },
      setMenus: (menus: IMenus[]) => {
        set({ menus });
      },
      setAccess: (access: string[]) => {
        set({ access });
      },
      logout: async () => {
        try {
          await logout();
        } catch (error) {
          console.error('登出失败:', error);
        } finally {
          // 无论成功失败都清理本地状态
          localStorage.removeItem('token');
          set({
            user: null,
            access: [],
            menus: [],
            menuMap: {},
            breadcrumbMap: {},
          });
        }
      },
      setLocalRoute: (isLocal: boolean) => {
        set({ localRoute: isLocal });
      },
      // 派生方法：检查是否已登录
      isAuthenticated: () => {
        return !!localStorage.getItem('token');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore
