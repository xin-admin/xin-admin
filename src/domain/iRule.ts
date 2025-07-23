/**
 * 菜单路由规则类型
 */
export interface IRule {
  // 权限ID
  id: number;
  // 上级ID，顶级菜单的 pid 为 0
  pid: number;
  // 权限类型，分为菜单、路由、权限
  type: 'menu' | 'route' | 'nested-route' | 'rule';
  // 权限的唯一标识
  key: string;
  // 排序
  sort?: number;
  // 名称
  name?: string;
  // 菜单的路径，menu 的路径会被当作前缀路由
  path?: string;
  // 路由组件的路径，当类型值为 route 时该配置有效
  elementPath?: string | null;
  // 路由的图标
  icon?: string;
  // 多语言
  local?: string;
  // 是否显示
  show?: number;
  // 是否外链
  link?: boolean;
  // 是否缓存
  cache?: boolean;
}