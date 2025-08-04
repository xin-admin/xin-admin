import createAxios from '@/utils/request';
import type {IAdminInfoResult, IAdminLoginParams, IAdminLoginResult} from '@/domain/iAdmin';
import type {IRule} from "@/domain/iRule.ts";

// 管理端用户登录
export async function login(data: IAdminLoginParams) {
  return createAxios<IAdminLoginResult>({
    url: '/admin/login',
    method: 'post',
    data,
  });
}

// 获取管理员用户信息
export async function info() {
  return createAxios<IAdminInfoResult>({
    url: '/admin/info',
    method: 'get',
  });
}

// 获取管理员权限信息
export async function rules() {
  return createAxios<IRule[]>({
    url: '/admin/rules',
    method: 'get',
  });
}


// 退出登录
export async function logout() {
  return createAxios({
    url: '/admin/logout',
    method: 'post',
  });
}
