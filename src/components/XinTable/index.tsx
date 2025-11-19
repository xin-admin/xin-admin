import { useImperativeHandle, useRef, useState } from 'react';
import { BetaSchemaForm, ProTable } from '@ant-design/pro-components';
import type {ProTableProps, ProFormInstance, ProColumns, ActionType,} from '@ant-design/pro-components';
import { Create, Delete, Update, List } from '@/api/common/table';
import {Button, message, Popconfirm, Space, Tooltip} from 'antd';
import AuthButton from '@/components/AuthButton';
import type { FormMode, XinTableProps } from './typings.ts';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

/**
 * XinTable CRUD 表格
 * @param props
 * https://xinadmin.cn/ui/table/intro
 */
function XinTable<T extends Record<string, any>>(props: XinTableProps<T>) {
  /** 表格参数 */
  const {
    api,
    rowKey,
    columns,
    formRef,
    tableRef,
    xinTableRef,
    accessName,
    operateShow,
    editShow = true,
    addShow = true,
    deleteShow = true,
    beforeOperateRender,
    afterOperateRender,
    toolBarRender = [],
    reloadType = 'reset',
    beforeDelete,
    afterDelete,
    beforeSubmit,
    afterSubmit,
    requestSuccess,
    successMessage,
  } = props;
  /** 多语言 */
  const {t} = useTranslation();
  /** 表格 Ref */
  const actionRef = useRef<ActionType>(undefined);
  /** 表单 Ref */
  const schemaFormRef = useRef<ProFormInstance>(undefined);
  /** 表单开启状态 */
  const [formOpen, setFormOpen] = useState<boolean>(false);
  /** 表单模式: create-新增, edit-编辑 */
  const [formMode, setFormMode] = useState<FormMode>('create');
  /** 正在编辑的记录 */
  const [editingRecord, setEditingRecord] = useState<T>();
  /** Ref */
  useImperativeHandle(tableRef, () => actionRef.current);
  useImperativeHandle(formRef, () => schemaFormRef.current);
  useImperativeHandle(xinTableRef, () => ({
    setFormOpen: setFormOpen,
    setFormMode: setFormMode,
    setEditingRecord: setEditingRecord,
  }));
  /** 新增按钮点击事件 */
  const addButtonClick = () => {
    setFormMode('create');
    setEditingRecord(undefined);
    schemaFormRef.current?.resetFields();
    setFormOpen(true);
  };
  /** 编辑按钮点击事件 */
  const editButtonClick = (record: T) => {
    setFormMode('edit');
    setEditingRecord(record);
    setFormOpen(true);
    schemaFormRef.current?.setFieldsValue(record);
  };
  /** 删除按钮点击事件 */
  const deleteButtonClick = async (record: T) => {
    // 执行删除前钩子
    if (beforeDelete) {
      const canDelete = await beforeDelete(record);
      if (canDelete === false) return;
    }
    await Delete(api + `/${record[rowKey]}`);
    const msg = successMessage?.delete || t('xin-table.deleteSuccess');
    message.success(msg);
    // 刷新表格
    refreshTable();
    // 执行删除后钩子
    if (afterDelete) {
      afterDelete(record);
    }
  };
  /** 提交表单 */
  const onFinish = async (formData: T) => {
    // 自定义提交逻辑
    if (props.onFinish) {
      const success = await props.onFinish(formData, formMode, editingRecord);
      if (success) {
        setFormOpen(false);
        refreshTable();
      }
      return;
    }
    // 执行提交前钩子
    let processedData = formData;
    if (beforeSubmit) {
      processedData = await beforeSubmit(formData, formMode, editingRecord);
    }
    // 默认提交逻辑
    if (formMode === 'edit' && editingRecord) {
      await Update(api + `/${editingRecord[rowKey]}`, processedData);
      const msg = successMessage?.update || t('xin-table.finishSuccess');
      message.success(msg);
    } else {
      await Create(api, processedData);
      const msg = successMessage?.create || t('xin-table.finishSuccess');
      message.success(msg);
    }
    refreshTable();
    setFormOpen(false);
    // 执行提交后钩子
    if (afterSubmit) {
      afterSubmit(processedData, formMode);
    }
  };
  
  /** 刷新表格 */
  const refreshTable = () => {
    if (reloadType === 'reload') {
      actionRef.current?.reload?.();
    } else {
      actionRef.current?.reset?.();
    }
  };
  /** 表格操作列 */
  const operate = (): ProColumns<T>[] => {
    if (operateShow === false) return [];
    return [
      {
        title: t('xin-table.options'),
        hideInForm: true,
        hideInSearch: true,
        key: 'operate',
        align: 'center',
        hideInDescriptions: true,
        render: (_, record) => (
          <Space>
            {beforeOperateRender?.(record)}
            {(typeof editShow === 'function' ? editShow(record) : editShow) &&
              <AuthButton auth={props.accessName + '.update'} key={'update'}>
                <Tooltip title={t('xin-table.editButton')}>
                  <Button type="primary" icon={<EditOutlined />} size={'small'} onClick={() => editButtonClick(record)}/>
                </Tooltip>
              </AuthButton>
            }
            {(typeof deleteShow === 'function' ? deleteShow(record) : deleteShow) !== false &&
              <AuthButton auth={props.accessName + '.delete'} key={'delete '}>
                <Popconfirm
                  okText={t('xin-table.deleteButton.ok')}
                  cancelText={t('xin-table.deleteButton.cancel')}
                  title={t('xin-table.deleteButton.title')}
                  description={t('xin-table.deleteButton.description')}
                  onConfirm={() => deleteButtonClick(record)}
                >
                  <Tooltip title={t('xin-table.deleteButton')}>
                    <Button type="primary" icon={<DeleteOutlined />} size={'small'} danger/>
                  </Tooltip>
                </Popconfirm>
              </AuthButton>
            }
            {afterOperateRender?.(record)}
          </Space>
        ),
      },
    ];
  };
  /** 表格参数 */
  const tableProps: ProTableProps<T, {[key: string]: any}> = {
    actionRef,
    rowKey,
    columns: [...props.columns, ...operate()],
    toolBarRender: () => {
      return [
        <>
          {addShow &&
            <AuthButton auth={accessName + '.create'} key={'create'}>
              <Button children={t('xin-table.createButton')} type={'primary'} onClick={addButtonClick} />
            </AuthButton>
          }
        </>,
        ...toolBarRender,
      ];
    },
    request: async (params, sorter, filter) => {
      const { data } = await List<T>(props.api, { page: params.current,  sorter, filter, ...params });
      requestSuccess && requestSuccess(data.data)
      return { ...data.data, success: data.success };
    },
    ...props.tableProps,
    search: props.tableProps?.search !== false ? {
      searchText: t('xin-table.searchText'),
      resetText: t('xin-table.resetText'),
      collapseRender: (collapsed) => {
        if (collapsed) {
          return (
            <Space>
              { t('xin-table.collapse.open') }
              <CaretDownOutlined />
            </Space>
          )
        } else {
          return (
            <Space>
              { t('xin-table.collapse.clock') }
              <CaretUpOutlined />
            </Space>
          )
        }
      },
      ...props.tableProps?.search,
    } : false,
  };
  return (
    <>
      <BetaSchemaForm<T>
        {...props.formProps}
        open={formOpen}
        layoutType={'ModalForm'}
        onFinish={onFinish}
        columns={columns}
        formRef={schemaFormRef}
        modalProps={{
          onCancel: () => setFormOpen(false),
          forceRender: true,
          ...props.modalProps,
        }}
      />
      <ProTable<T> {...tableProps} />
    </>
  );
}

export default  XinTable;