import type {
  ActionType,
  FormProps,
  ProColumns,
  ProFormColumnsType,
  ProFormInstance,
  ProTableProps,
} from '@ant-design/pro-components';
import React, {type Dispatch, type Ref, type SetStateAction} from 'react';
import type {ColProps, ModalProps, RowProps} from 'antd';

export type XinTableColumn<T = any> = ProFormColumnsType<T> & ProColumns<T>;

export type FormMode = 'create' | 'edit';

export interface XinTableRef<T> {
  setFormMode: Dispatch<SetStateAction<FormMode>>;
  setEditingRecord: Dispatch<SetStateAction<T | undefined>>;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
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
  /** 新增按钮显示 */
  addShow?: boolean;
  /** 编辑按钮显示 */
  editShow?: ((record: T) => boolean) | boolean;
  /** 删除按钮显示 */
  deleteShow?: ((record: T) => boolean) | boolean;
  /** 操作栏之后渲染 */
  beforeOperateRender?: (record: T) => React.ReactNode;
  /** 操作栏之后渲染 */
  afterOperateRender?: (record: T) => React.ReactNode;
  /** ProTable 和 ProForm 的 ref */
  tableRef?: Ref<ActionType | undefined>;
  formRef?: Ref<ProFormInstance | undefined>;
  xinTableRef?: Ref<XinTableRef<T> | undefined>;
  /** 工具栏渲染 */
  toolBarRender?: React.ReactNode[];
  /**
   * 表单提交
   * @param formData 表单数据
   * @param mode 表单模式 'create' | 'edit'
   * @param editingRecord 编辑时的原始数据，新增时为 null
   */
  onFinish?: (formData: T, mode: FormMode, editingRecord?: T) => Promise<boolean>
  /** 删除前钩子，返回 false 可取消删除 */
  beforeDelete?: (record: T) => Promise<boolean> | boolean;
  /** 删除后钩子 */
  afterDelete?: (record: T) => void;
  /** 提交前钩子，可对表单数据进行处理 */
  beforeSubmit?: (formData: T, mode: FormMode, editingRecord?: T) => Promise<T> | T;
  /** 提交后钩子 */
  afterSubmit?: (formData: T, mode: FormMode) => void;
  /** 请求后钩子 */
  requestSuccess?: (data?: API.ListResponse<T>) => void;
  /** 刷新方式: reset-重置到第一页, reload-保持当前页 */
  reloadType?: 'reset' | 'reload';
  /** 成功提示文本配置 */
  successMessage?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  /** 表单扩展配置 */
  formProps?: XinFromProps;
  /** 表格扩展配置 */
  tableProps?: ProTableProps<T, {[key: string]: unknown}>;
  /** 表单弹窗配置 */
  modalProps?: Omit<ModalProps, "visible">;
}
