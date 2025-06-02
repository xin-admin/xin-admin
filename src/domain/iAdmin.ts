import type { IRule } from './iRule';

/**
 * 管理员列表
 */
export interface IAdminUser {
  user_id?: number;
  username?: string;
  nickname?: string;
  avatar_id?: number;
  avatar_url?: string;
  email?: string;
  mobile?: string;
  status?: number;
  group_id?: number;
  sex?: number;
  role_id?: number;
  role_name?: string;
  dept_id?: number;
  dept_name?: string;
  rules?: string[];
  create_time?: string;
  update_time?: string;
}

export interface IAdminLoginParams {
  username?: string
  password?: string
  autoLogin?: boolean
  mobile?: string
  captcha?: number
  loginType?: 'phone' | 'account' | 'email'
}

type AdminInfo = {
  menus: IRule[]
  access: string[]
  info: IAdminUser
}

export type IAdminInfoResult = API.ResponseStructure<AdminInfo>

export type IAdminLoginResult = API.ResponseStructure<{
  plainTextToken: string;
  refresh_token: string
}>
