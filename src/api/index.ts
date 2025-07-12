import { request } from '@/utils/request';
import type {IAdminInfoResult, IAdminLoginParams, IAdminLoginResult} from '@/domain/iAdmin';
import type {IRule} from "@/domain/iRule.ts";

// 管理端用户登录
export async function login(data: IAdminLoginParams) {
  return request.post<IAdminLoginResult>('/admin/login', data);
}

// 获取管理员用户信息
export async function info() {
  return request.get<IAdminInfoResult>('/admin/info');
}

// 获取管理员权限信息
export async function rules() {
  return request.get<API.ResponseStructure<IRule[]>>('/admin/rules');
}


// 退出登录
export async function logout() {
  return request.post<API.ResponseStructure<null>>('/admin/logout');
}
