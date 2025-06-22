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
    return HttpResponse.json<IAdminLoginResult>({
        success: true,
        msg: "成功",
        data: {
            plainTextToken: "hassxnans0asdasd012bjsac",
        }
    })
}

const getUserInfo: HttpResponseResolver = async () => {
    return HttpResponse.json<IAdminInfoResult>({
        success: true,
        msg: "成功",
        data: {
            user_id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar_url: 'string',
            email: 'xinadmin@email.com',
            mobile: '1999999999',
            status: 1,
            group_id: 1,
            sex: 1,
            role_id: 1,
            role_name: '系统管理员',
            dept_id: 1,
            dept_name: '总公司',
            create_time: 'string',
            update_time: 'string',
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
]