/**
 * 监控管理相关API接口
 */
import type { CacheRecord, QueryRecord, RedisRecord, RequestRecord } from '@/domain/iSysWatcher';
import request from '@/utils/request';

/**
 * 请求记录查询参数
 */
export interface RecordParams {
  'current': number;
  'pageSize': number;
  'date': string;
  'type': 'request' | 'query' | 'cache' | 'redis';
}

/**
 * 获取请求记录列表
 */
export async function getRequestList(params: RecordParams) {
  return request<API.ListResponse<RequestRecord>>({
    url: '/system/watcher/request',
    method: 'get',
    params: {
      ...params, 
      type: 'request',
    },
  });
}

/**
 * 获取SQL查询记录列表
 */
export async function getQueryList(params: RecordParams) {
  return request<API.ListResponse<QueryRecord>>({
    url: '/system/watcher/query',
    method: 'get',
    params: {
      ...params,
      type: 'query',
    },
  });
}

/**
 * 获取缓存记录列表
 */
export async function getCacheList(params: RecordParams) {
  return request<API.ListResponse<CacheRecord>>({
    url: '/system/watcher/cache',
    method: 'get',
    params: {
      ...params,
      type: 'cache',
    },
  });
}

/**
 * 获取Redis记录列表
 */
export async function getRedisList(params: RecordParams) {
  return request<API.ListResponse<RedisRecord>>({
    url: '/system/watcher/redis',
    method: 'get',
    params: {
      ...params,
      type: 'redis',
    },
  });
}
