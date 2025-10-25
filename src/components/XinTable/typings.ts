import type {
  ActionType,
  FormProps,
  ProColumns,
  ProFormColumnsType,
  ProFormInstance,
  ProTableProps,
} from '@ant-design/pro-components';
import React, {type Ref } from 'react';
import type {ColProps, ModalProps, RowProps} from 'antd';

export type XinTableColumn<T = any> = ProFormColumnsType<T> & ProColumns<T>;

export interface BooleanActions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

export interface XinTableRef {
  formRef?: React.RefObject<ProFormInstance | undefined>;
  tableRef?: React.RefObject<ActionType | undefined>;
}

export interface XinFromProps {
  // 表单 layout
  layout?: FormProps['layout'];
  // 表单项 label Align
  labelAlign?: FormProps['labelAlign'];
  // 表单项 Label Warp
  labelWrap?: FormProps['labelWrap'];
  // 表单项 Label Col
  labelCol?: FormProps['labelCol'];
  // 表单项 Wrapper Col
  wrapperCol?: FormProps['wrapperCol'];
  // Grid 布局
  grid?: boolean;
  // Row Props
  rowProps?: RowProps;
  // Col Props
  colProps?: ColProps;
}

// CRUD 表格
export type XinTableProps<T> = {
  /** 表单 columns */
  columns: XinTableColumn<T>[];
  /** 主键 */
  api: string;
  /** 主键 */
  rowKey: string;
  /** 权限 */
  accessName: string;
  /** 表格操作列显示 */
  operateShow?: boolean;
  /** 编辑按钮显示 */
  addShow?: boolean;
  /** 编辑按钮显示 */
  editShow?: ((record: T) => boolean) | boolean;
  /** 操作栏之后渲染 */
  deleteShow?: ((record: T) => boolean) | boolean;
  /** 操作栏之后渲染 */
  beforeOperateRender?: (record: T) => React.ReactNode;
  /** 操作栏之后渲染 */
  afterOperateRender?: (record: T) => React.ReactNode;
  /** ProTable 和 ProForm 的 ref */
  tableRef?: Ref<XinTableRef | undefined>;
  /** 工具栏渲染 */
  toolBarRender?: React.ReactNode[];
  /**
   * 表单提交
   * @param formData 表单数据
   * @param initValue 编辑时的初始数据，如果是新增则为 false
   */
  onFinish?: (formData: T, initValue: T | false) => Promise<boolean>
  /** 表单扩展配置 */
  formProps?: XinFromProps;
  /** 表格扩展配置 */
  tableProps?: ProTableProps<T, {[key: string]: unknown}>;
  /** 表单弹窗配置 */
  modalProps?: Omit<ModalProps, "visible">;
}
