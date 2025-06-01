/**
 * Xin Table 公共接口
 */
import { request } from '@/utils/request';
import type {AxiosRequestConfig} from "axios";

type IListParams = {
  keyword?: string;
  current?: number;
  pageSize?: number;
} | { [key: string]: unknown }

/**
 * 查询详情接口
 * @param url
 * @param id
 * @param options
 */
export const getApi = (
    url: string,
    id: number | string,
    options?: AxiosRequestConfig | undefined
) => {
  return request.get<
      ApiResponse.ResponseStructure<unknown>
  >(url + '/' + id, options || {});
}

/**
 * 公共查询接口
 * @param url
 * @param params
 * @param options
 */
export const listApi = (
    url: string,
    params?: IListParams,
    options?: { [key: string]: unknown }
) =>  {
  return request<API.ResponseStructure<unknown>>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 公共新增接口
 * @param url
 * @param data
 * @param options
 */
export const addApi = (url: string, data?: { [key: string]: unknown }, options?: { [key: string]: unknown }) => {
  return request<API.ResponseStructure<unknown>>(url, {
    method: 'POST',
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
export const editApi = (url: string, data?: { [key: string]: any }, options?: { [key: string]: unknown }) =>  {
  return request<API.ResponseStructure<unknown>>(url, {
    method: 'PUT',
    data: { ...data },
    ...(options || {}),
  });
}

/**
 * 公共删除接口
 * @param url
 * @param params
 * @param options
 */
export const deleteApi = (url: string, params?: { [key: string]: any }, options?: { [key: string]: unknown }) => {
  return request<API.ResponseStructure<unknown>>(url, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
