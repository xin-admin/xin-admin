/**
 * 管理员列表
 */
export interface IAdminUser {
  user_id?: number;
  username?: string;
  nickname?: string;
  avatar_url?: string;
  email?: string;
  mobile?: string;
  gender?: number;
  role_name?: string;
  dept_name?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export interface IAdminLoginParams {
  username?: string
  password?: string
  autoLogin?: boolean
  mobile?: string
  captcha?: number
  loginType?: 'phone' | 'account' | 'email'
}

export type IAdminInfoResult = API.ResponseStructure<IAdminUser>

export type IAdminLoginResult = {
  plainTextToken: string;
  accessToken?: {
    created_at: string;
    expires_at: string | null;
    id: number;
    name: string;
    abilities: string[];
  }
}
