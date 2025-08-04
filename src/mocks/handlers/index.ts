import {http, HttpResponse, type HttpResponseResolver} from "msw";
import type {IAdminLoginParams, IAdminLoginResult, IAdminInfoResult} from "@/domain/iAdmin.ts";
import {withAuth} from '@/mocks/middleware';
import type {IRule} from "@/domain/iRule.ts";
import defaultRoute from "@/router/default";

const adminLogin: HttpResponseResolver = async ({ request }) => {
  const postData: IAdminLoginParams = await request.clone().json() // Post
  if(postData.username != 'admin' ||  postData.password != '123456') {
    return HttpResponse.json({
      success: false,
      msg: "用户名或密码不正确",
      showType: 2
    })
  }
  return HttpResponse.json<API.ResponseStructure<IAdminLoginResult>>({
    success: true,
    msg: "成功",
    data: {
      plainTextToken: "hassxnans0asdasd012bjsac",
    }
  })
}

const adminLogout: HttpResponseResolver = async () => {
  return HttpResponse.json<API.ResponseStructure<null>>({
    success: true,
    msg: "成功",
    data: null
  })
}


const getUserInfo: HttpResponseResolver = async () => {
  return HttpResponse.json<IAdminInfoResult>({
    success: true,
    msg: "成功",
    data: {
      user_id: 1,
      username: 'admin',
      nickname: '张三',
      avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'zhangsan@example.com',
      mobile: '138-1234-5678',
      gender: 1,
      role_name: '高级前端工程师',
      dept_name: '技术研发部',
      location: '北京市海淀区',
      website: 'https://xinadmin.cn',
      bio: '专注于前端技术开发，热爱开源，喜欢分享技术经验。'
    }
  })
}

const getRules: HttpResponseResolver = async () => {
  return HttpResponse.json<API.ResponseStructure<IRule[]>>({
    success: true,
    msg: "成功",
    data: defaultRoute
  })
}

// The root-level request handlers combine
// all the domain-based handlers into a single
// network description array.
export const handlers = [
  http.post('/api/admin/login', adminLogin),
  http.get('/api/admin/info', withAuth(getUserInfo)),
  http.get('/api/admin/rules', withAuth(getRules)),
  http.post('/api/admin/logout', withAuth(adminLogout)),
]