/**
 * 权限类型
 */
export interface IRule {
  rule_id?: number;
  parent_id?: number;
  type?: string | number;
  sort?: number;
  name?: string;
  path?: string;
  index?: boolean;
  elementPath?: string;
  icon?: string;
  key?: string;
  local?: string;
  status?: number;
  show?: number;
  created_at?: string;
  updated_at?: string;
  children?: IRule[];
}
