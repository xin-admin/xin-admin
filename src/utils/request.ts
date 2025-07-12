import axios from "axios";
import type {AxiosResponse, AxiosInstance} from "axios";
import {message, notification} from "antd";

// 请求错误处理
const handleNetworkError = async (errStatus?: number): Promise<void> => {
  const networkErrMap = {
    "400": "错误的请求", // token 失效
    "401": "未授权，请重新登录",
    "403": "拒绝访问",
    "404": "请求错误，未找到该资源",
    "405": "请求方法未允许",
    "408": "请求超时",
    "500": "服务器端出错",
    "501": "网络未实现",
    "502": "网络错误",
    "503": "服务不可用",
    "504": "网络超时",
    "505": "http版本不支持该请求",
  };
  if (errStatus) {
    if (String(errStatus) in networkErrMap) {
      message.error(networkErrMap[String(errStatus) as keyof typeof networkErrMap])
    }else {
      message.error(`其他连接错误 --${errStatus}`);
    }
    return;
  }
  message.error("无法连接到服务器！");
};

// 业务错误处理
const handleBusinessError = async (data: API.ResponseStructure<unknown>) => {
  const { msg = '', showType = 0, description = '', placement = 'topRight' } = data;
  switch (showType) {
    case 99:
      break;
    case 0:
      message.success(msg);
      break;
    case 1:
      message.warning(msg);
      break;
    case 2:
      message.error(msg);
      break;
    case 3:
      notification.success({
        description: description,
        message: msg,
        placement
      });
      break;
    case 4:
      notification.warning({
        description: description,
        message: msg,
        placement
      });
      break;
    case 5:
      notification.error({
        description: description,
        message: msg,
        placement
      });
      break;
    default:
      message.error(msg);
  }
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  }
});

instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  let token: string = "";
  if(localStorage.getItem("token")) {
    token =  `Bearer ${localStorage.getItem("token")}`
  }
  config.headers["Authorization"] = token;
  return config;
});

instance.interceptors.response.use(
  async (response: AxiosResponse<API.ResponseStructure<unknown>>) => {
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
