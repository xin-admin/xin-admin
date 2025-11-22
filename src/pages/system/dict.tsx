import XinTable from '@/components/XinTable';
import { Button, Col, Empty, message, Row } from 'antd';
import type { IDict } from '@/domain/iDict';
import type { IDictItem } from '@/domain/iDictItem';
import type { XinTableColumn, XinTableProps } from '@/components/XinTable/typings';
import type { ProTableProps } from '@ant-design/pro-components';
import { useState } from 'react';
import { Create, Update } from '@/api/common/table';
import { useTranslation } from 'react-i18next';

/** 字典管理 */
export default () => {
  const { t } = useTranslation();

  // 字典
  const columns: XinTableColumn<IDict>[] = [
    { 
      title: t('dict.id'), 
      dataIndex: 'id',
       hideInForm: true, 
       sorter: true 
    },
    { 
      title: t('dict.name'),
      dataIndex: 'name', 
      valueType: 'text', 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: t('dict.name.required') }] },
    },
    {
      title: t('dict.code'), 
      dataIndex: 'code', 
      valueType: 'text', 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: t('dict.code.required') }] },
    },
    {
      title: t('dict.type'), 
      dataIndex: 'type', 
      valueType: 'select', 
      filters: true, 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: t('dict.type.required') }] },
      valueEnum: {
        default: { text: t('dict.type.default'), status: 'Success' },
        badge: { text: t('dict.type.badge'), status: 'Success' },
        tag: { text: t('dict.type.tag'), status: 'Success' },
      },
    },
    { 
      title: t('dict.describe'), 
      dataIndex: 'describe', 
      valueType: 'textarea', 
      colProps: { span: 24 }, 
      hideInSearch: true 
    },
    { title: t('dict.createdAt'), dataIndex: 'created_at', valueType: 'date', hideInForm: true },
    { title: t('dict.updatedAt'), dataIndex: 'updated_at', valueType: 'date', hideInForm: true },
  ];
  // 字典项
  const itemColumns: XinTableColumn<IDictItem>[] = [
    { 
      title: t('dictItem.id'), 
      dataIndex: 'id', 
      hideInForm: true, 
      hideInTable: true 
    },
    { 
      title: t('dictItem.label'), 
      dataIndex: 'label', 
      valueType: 'text', 
      formItemProps: { rules: [{ required: true, message: t('dictItem.label.required') }] },
    },
    { 
      title: t('dictItem.value'), 
      dataIndex: 'value', 
      valueType: 'text', 
      formItemProps: { rules: [{ required: true, message: t('dictItem.value.required') }] },
    },
    {
      title: t('dictItem.status'), 
      dataIndex: 'status', 
      valueType: 'text', 
      initialValue: 'default',
      formItemProps: { rules: [{ required: true, message: t('dictItem.status.required') }] },
      valueEnum: {
        success: { text: t('dictItem.status.success'), status: 'Success' },
        error: { text: t('dictItem.status.error'), status: 'Error' },
        default: { text: t('dictItem.status.default'), status: 'Default' },
        processing: { text: t('dictItem.status.processing'), status: 'Processing' },
        warning: { text: t('dictItem.status.warning'), status: 'Warning' },
      },
    },
    { 
      title: t('dictItem.switch'), 
      dataIndex: 'switch', 
      valueType: 'switch', 
      initialValue: true,
      formItemProps: { rules: [{ required: true, message: t('dictItem.switch.required') }] },
    },
    { title: t('dictItem.createTime'), dataIndex: 'create_time', valueType: 'date', hideInForm: true, hideInTable: true },
    { title: t('dictItem.updateTime'), dataIndex: 'update_time', valueType: 'date', hideInForm: true, hideInTable: true },
  ];

  const [selectedRows, setSelectedRows] = useState<IDict>();
  const [tableParams, setParams] = useState<{ keywordSearch?: string; }>();
  const tableProps: ProTableProps<IDict, any> = {
    params: tableParams,
    search: false,
    rowSelection: {
      type: 'radio',
      alwaysShowAlert: true,
      selectedRowKeys: selectedRows ? [selectedRows.id!] : [],
      onSelect: (record) => {
        setSelectedRows(record);
      },
    },
    onRow: (record) => ({
      onClick: () => setSelectedRows(record)
    }),
    cardProps: { bordered: true },
    tableAlertRender: false,
    tableAlertOptionRender: false,
    toolbar: {
      search: {
        placeholder: t('dict.searchPlaceholder'),
        style: { width: 304 },
        onSearch: (value: string) => {
          setParams({ keywordSearch: value });
        },
      },
      settings: [],
    },
    optionsRender: (_, dom) => {
      return [
        <Button type="primary" key={'ref'} onClick={() => {}}>{t('dict.refreshCache')}</Button>,
        ...dom
      ];
    },
  };

  const handleAddItem: XinTableProps<IDictItem>['onFinish'] = async (formData, mode, initValue) => {
    if (!selectedRows) {
      message.warning(t('dict.selectWarning'));
      return false;
    }
    if (mode === 'edit' && initValue) {
      let data = { ...initValue, ...formData };
      await Update('/sys/dict/item/' + initValue.id, data);
      message.success(t('dict.editSuccess'));
      return true;
    } else {
      let data = { ...formData, dict_id: selectedRows.id, };
      await Create('/sys/dict/item', data);
      message.success(t('dict.addSuccess'));
      return true;
    }
  };
  const requestSuccess: XinTableProps<IDictItem>['requestSuccess'] = (data) => {
    if(data?.data && data?.data.length > 0) {
      setSelectedRows(data.data[0]);
    }
  };

  return (
    <Row gutter={20}>
      <Col span={14}>
        <XinTable<IDict>
          api={'/sys/dict/list'}
          columns={columns}
          rowKey={'id'}
          tableProps={tableProps}
          accessName={'system.dict.list'}
          formProps={{
            grid: true,
            colProps: { span: 12 },
          }}
          requestSuccess={requestSuccess}
        />
      </Col>
      <Col span={10}>
        {selectedRows ? (
          <XinTable<IDictItem>
            api={'/sys/dict/item'}
            columns={itemColumns}
            rowKey={'id'}
            onFinish={handleAddItem}
            tableProps={{
              search: false,
              params: { dict_id: selectedRows.id },
              toolbar: { settings: [] },
              pagination: { pageSize: 10 },
              cardProps: { bordered: true },
              headerTitle: `${t('dict.itemManagement')}（${selectedRows?.name}）`
            }}
            accessName={'system.dict.item'}
            formProps={{ grid: true, colProps: { span: 12 } }}
          />
        ) : (
          <Empty description={t('dict.selectDict')} />
        )}
      </Col>
    </Row>
  );
}