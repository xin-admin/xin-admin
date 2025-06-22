/**
 * 权限类型
 */
export interface IRule {
  // 权限的唯一标识
  rule_id?: number;
  // 上级ID，顶级的上级ID为0
  parent_id?: number;
  // 权限类型，分为菜单、路由、权限
  type?: 'menu' | 'route' | 'rule';
  // 排序
  sort?: number;
  // 名称
  name?: string;
  // 菜单的路径，menu 的路径会被当作前缀路由
  path?: string;
  // 是否索引路由，当类型值为 menu 和 route 时该配置有效
  index?: boolean;
  // 路由组件的路径，当类型值为 route 时该配置有效
  elementPath?: string | null;
  // 路由的图标
  icon?: string;
  // 权限标识
  key?: string;
  // 多语言
  local?: string;
  // 状态
  status?: number;
  // 是否显示
  show?: number;
  // 创建时间
  created_at?: string;
  // 更新时间
  updated_at?: string;
}
