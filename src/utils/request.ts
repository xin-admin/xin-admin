import axios from "axios";
import type {AxiosRequestConfig} from "axios";
import {message} from "antd";

type Fn = (data: FcResponse<any>) => unknown;

interface IAnyObj {
    [index: string]: unknown;
}

interface FcResponse<T> {
    errno: string;
    errmsg: string;
    data: T;
}

const handleChangeRequestHeader = (config: AxiosRequestConfig) => {
    config["xxxx"] = "xxx";
    return config;
};

const handleConfigureAuth = (config: AxiosRequestConfig) => {
    config.headers = config.headers || {};
    config.headers["Authorization"] = localStorage.getItem("token") || "";
    return config;
};

const handleNetworkError = (errStatus?: number): void => {
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
        message.error(networkErrMap[errStatus.toString()] ?? `其他连接错误 --${errStatus}`);
        return;
    }
    message.error("无法连接到服务器！");
};



axios.interceptors.request.use((config) => {
    config = handleChangeRequestHeader(config);
    config = handleConfigureAuth(config);
    return config;
});

axios.interceptors.response.use(
    (response) => {
        if (response.status !== 200) return Promise.reject(response.data);
        handleAuthError(response.data.errno);
        handleGeneralError(response.data.errno, response.data.errmsg);
        return response;
    },
    (err) => {
        handleNetworkError(err.response.status);
        Promise.reject(err.response);
    }
);

export const Get = <T,>(
    url: string,
    params: IAnyObj = {},
    clearFn?: Fn
): Promise<[any, FcResponse<T> | undefined]> =>
    new Promise((resolve) => {
        axios
            .get(url, { params })
            .then((result) => {
                let res: FcResponse<T>;
                if (clearFn !== undefined) {
                    res = clearFn(result.data) as unknown as FcResponse<T>;
                } else {
                    res = result.data as FcResponse<T>;
                }
                resolve([null, res as FcResponse<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });

export const Post = <T,>(
    url: string,
    data: IAnyObj,
    params: AxiosRequestConfig = {}
): Promise<[any, FcResponse<T> | undefined]> => {
    return new Promise((resolve) => {
        axios
            .post(url, data, { params })
            .then((result) => {
                resolve([null, result.data as FcResponse<T>]);
            })
            .catch((err) => {
                resolve([err, undefined]);
            });
    });
};