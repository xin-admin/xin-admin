/** Xin Table 公共接口 */
import { request } from '@/utils/request';
import type { AxiosRequestConfig } from "axios";

type IListParams = {
  keyword?: string;
  current?: number;
  pageSize?: number;
} & { [key: string]: unknown }

/**
 * 查询详情接口
 * @param url
 * @param id
 * @param options
 */
export function Get<T,>(
    url: string,
    id: number | string,
    options?: AxiosRequestConfig | undefined
){
  return request.get<
      API.ResponseStructure<T>
  >(url + '/' + id, options || {});
}

/**
 * 公共查询接口
 * @param url
 * @param params
 * @param options
 */
export function List<T,>(
    url: string,
    params?: IListParams,
    options?: AxiosRequestConfig | undefined
){
  return request.get<
      API.ListResponse<T>
  >(url, {
    params,
    ...(options || {}),
  });
}

/**
 * 公共新增接口
 * @param url
 * @param data
 * @param options
 */
export function Create<T,>(
    url: string,
    data?: { [key: string]: unknown },
    options?: AxiosRequestConfig | undefined
){
  return request.post<
      API.ResponseStructure<T>
  >(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || {}),
  });
}

/**
 * 公共编辑接口
 * @param url
 * @param data
 * @param options
 */
export function Update<T,>(
    url: string,
    data?: { [key: string]: unknown },
    options?: AxiosRequestConfig | undefined
){
  return request.put<
      API.ResponseStructure<T>
  >(url, {
    data,
    ...(options || {}),
  });
}

/**
 * 公共删除接口
 * @param url
 * @param params
 * @param options
 */
export function Delete<T,>(
    url: string,
    params?: { [key: string]: unknown },
    options?: AxiosRequestConfig | undefined
){
  return request.delete<
      API.ResponseStructure<T>
  >(url, {
    params,
    ...(options || {}),
  });
}
