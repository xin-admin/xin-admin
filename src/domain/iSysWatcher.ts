export interface CacheRecord {
  /** 缓存类型 */
  'type': string;
  /** 缓存键名 */
  'key': string;
  /** 缓存值 */
  'value': string;
  /** 缓存地址 */
  'host_name': string;
  /** 缓存记录时间 */
  'recorded_at': string;
  /** 过期时间（秒） */
  'expiration': number;
}

export interface RedisRecord {
  /** Redis连接名称 */
  'connection': string;
  /** 执行的Redis命令 */
  'command': string;
  /** 执行时间 */
  'time': string;
}

export interface RequestRecord {
  /** 客户端IP地址 */
  'ip_address': string;
  /** 请求URI路径 */
  'uri': string;
  /** HTTP请求方法（GET、POST等） */
  'method': string;
  /** 控制器方法 */
  'controller_action': string;
  /** 中间件列表 */
  'middleware': string[];
  /** 请求头信息 */
  'headers': Record<string, string>;
  /** 请求参数 */
  'payload': Record<string, any>;
  /** 会话数据 */
  'session': Record<string, any>;
  /** 响应头信息 */
  'response_headers': Record<string, string>;
  /** HTTP响应状态码 */
  'response_status': number;
  /** 响应内容 */
  'response': Record<string, any>;
  /** 请求处理耗时（毫秒） */
  'duration': number | null;
  /** 内存使用量（字节） */
  'memory': number;
}

export interface QueryRecord {
  /** 数据库连接名称 */
  'connection': string;
  /** SQL查询语句 */
  'sql': string;
  /** 执行时间 */
  'time': string;
  /** 是否为慢查询 */
  'slow': boolean;
  /** 执行文件路径 */
  'file': string;
  /** 执行行号 */
  'line': number;
}