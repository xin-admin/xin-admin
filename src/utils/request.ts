import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import type {AxiosInstance} from "axios";
import type {NotificationArgsProps} from "antd";

window.requests = [];
window.tokenRefreshing = false;
const pendingMap = new Map();

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 */
function addPending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 */
function removePending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

/**
 * 生成每个请求的唯一key
 */
function getPendingKey(config: AxiosRequestConfig) {
  let { data } = config
  const { url, method, params, headers } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [
    url,
    method,
    headers && (headers as anyObj).batoken ? (headers as anyObj).batoken : '',
    headers && (headers as anyObj)['ba-user-token'] ? (headers as anyObj)['ba-user-token'] : '',
    JSON.stringify(params),
    JSON.stringify(data),
  ].join('&')
}

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
    window.$message?.error(messageString);
  } else {
    window.$message?.error("无法连接到服务器！");
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
    case 0: window.$message?.success(msg); break;
    case 1: window.$message?.warning(msg); break;
    case 2: window.$message?.error(msg); break;
    case 3: window.$notification?.success(NProps); break;
    case 4: window.$notification?.warning(NProps); break;
    case 5: window.$notification?.error(NProps); break;
    default: window.$message?.error(msg);
  }
}

function createAxios<Data, T = API.ResponseStructure<Data>>(axiosConfig: AxiosRequestConfig) {
  // 创建 axios 实例
  const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    responseType: 'json',
  });

  // 请求拦截
  instance.interceptors.request.use((config) => {
    removePending(config);
    addPending(config);

    config.headers = config.headers || {};
    if(localStorage.getItem("token")) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
  });

  // 响应拦截
  instance.interceptors.response.use(
    async (response) => {
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
        window.$message?.error("网络链接错误：" + err.message);
        return Promise.reject(err);
      }
    }
  );
  return instance(axiosConfig) as Promise<AxiosResponse<T>>;
}

export default createAxios;
