import { request } from '@/utils/request';
import type {IAdminInfoResult, IAdminLoginParams, IAdminLoginResult} from '@/domain/iAdmin';

// 管理端用户登录
export async function adminLogin(data: IAdminLoginParams) {
    return request.post<IAdminLoginResult>('/admin/login', data);
}

// 获取管理员用户信息
export async function adminInfo() {
    return request.get<IAdminInfoResult>('/admin/info');
}

// 退出登录
export async function adminLogout() {
    return request.post<API.ResponseStructure<null>>('/admin/logout');
}
