import axios from "axios";
import type {AxiosResponse, AxiosInstance} from "axios";
import {message, notification, type NotificationArgsProps} from "antd";

// 请求错误处理
const handleNetworkError = async (errStatus?: number): Promise<void> => {
  if (errStatus) {
    let messageString: string;
    switch (errStatus) {
      case 302: messageString = '接口重定向了！'; break;
      case 400: messageString = '参数不正确！'; break;
      case 401: messageString = '您未登录，或者登录已经超时，请先登录！'; break;
      case 403: messageString = '您没有权限操作！'; break;
      case 404: messageString = '请求错误，未找到该资源'; break;
      case 408: messageString = '请求超时！'; break;
      case 409: messageString = '系统已存在相同数据！'; break;
      case 500: messageString = '服务器内部错误！'; break;
      case 501: messageString = '服务未实现！'; break;
      case 502: messageString = '网关错误！'; break;
      case 503: messageString = '服务不可用！'; break;
      case 504: messageString = '服务暂时无法访问，请稍后再试！'; break;
      case 505: messageString = 'HTTP版本不受支持！'; break;
      default: messageString = `其他连接错误 -- ${errStatus}`; break
    }
    message.error(messageString);
  } else {
    message.error("无法连接到服务器！");
  }
};

// 业务错误处理
const handleBusinessError = async (data: API.ResponseStructure<any>) => {
  const { msg = '', showType = 0, description = '', placement = 'topRight' } = data;
  const NProps: NotificationArgsProps = {
    message: msg,
    description: description,
    placement: placement
  }
  switch (showType) {
    case 99: break;
    case 0: message.success(msg); break;
    case 1: message.warning(msg); break;
    case 2: message.error(msg); break;
    case 3: notification.success(NProps); break;
    case 4: notification.warning(NProps); break;
    case 5: notification.error(NProps); break;
    default: message.error(msg);
  }
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  }
});

// 请求拦截
instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  let token: string = "";
  if(localStorage.getItem("token")) {
    token = `Bearer ${localStorage.getItem("token")}`
  }
  config.headers["Authorization"] = token;
  return config;
});

// 响应拦截
instance.interceptors.response.use(
  async (response: AxiosResponse<API.ResponseStructure<any>>) => {
    const { data } = response;
    if(data.success) return Promise.resolve(response);
    await handleBusinessError(data);
    return Promise.reject(response);
  },
  async (err) => {
    if(err.response) {
      await handleNetworkError(err.response.status);
      return Promise.reject(err.response);
    }else {
      message.error("网络链接错误：" + err.message);
      return Promise.reject(err);
    }
  }
);

export const request = instance;
