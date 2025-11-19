import XinTable from '@/components/XinTable';
import { Button, Col, Empty, message, Row } from 'antd';
import type { IDict } from '@/domain/iDict';
import type { IDictItem } from '@/domain/iDictItem';
import type { XinTableColumn, XinTableProps } from '@/components/XinTable/typings';
import type { ProTableProps } from '@ant-design/pro-components';
import { useState } from 'react';
import { Create, Update } from '@/api/common/table';

/** 字典管理 */
export default () => {

  // 字典
  const columns: XinTableColumn<IDict>[] = [
    { 
      title: '字典ID', 
      dataIndex: 'id',
       hideInForm: true, 
       sorter: true 
    },
    { 
      title: '字典名称',
      dataIndex: 'name', 
      valueType: 'text', 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: '字典名称不能为空' }] },
    },
    {
      title: '字典编码', 
      dataIndex: 'code', 
      valueType: 'text', 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: '字典编码不能为空' }] },
    },
    {
      title: '类型', 
      dataIndex: 'type', 
      valueType: 'select', 
      filters: true, 
      colProps: { span: 8 },
      formItemProps: { rules: [{ required: true, message: '类型不能为空' }] },
      valueEnum: {
        default: { text: '文字', status: 'Success' },
        badge: { text: '徽标', status: 'Success' },
        tag: { text: '标签', status: 'Success' },
      },
    },
    { 
      title: '描述', 
      dataIndex: 'describe', 
      valueType: 'textarea', 
      colProps: { span: 24 }, 
      hideInSearch: true 
    },
    { title: '创建时间', dataIndex: 'created_at', valueType: 'date', hideInForm: true },
    { title: '修改时间', dataIndex: 'updated_at', valueType: 'date', hideInForm: true },
  ];
  // 字典项
  const itemColumns: XinTableColumn<IDictItem>[] = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      hideInForm: true, 
      hideInTable: true 
    },
    { 
      title: '名称', 
      dataIndex: 'label', 
      valueType: 'text', 
      formItemProps: { rules: [{ required: true, message: '名称不能为空' }] },
    },
    { 
      title: '值', 
      dataIndex: 'value', 
      valueType: 'text', 
      formItemProps: { rules: [{ required: true, message: '值不能为空' }] },
    },
    {
      title: '类型', 
      dataIndex: 'status', 
      valueType: 'text', 
      initialValue: 'default',
      formItemProps: { rules: [{ required: true, message: '类型不能为空' }] },
      valueEnum: {
        success: { text: 'success', status: 'Success' },
        error: { text: 'error', status: 'Error' },
        default: { text: 'default', status: 'Default' },
        processing: { text: 'processing', status: 'Processing' },
        warning: { text: 'warning', status: 'Warning' },
      },
    },
    { 
      title: '状态', 
      dataIndex: 'switch', 
      valueType: 'switch', 
      initialValue: true,
      formItemProps: { rules: [{ required: true, message: '状态不能为空' }] },
    },
    { title: '创建时间', dataIndex: 'create_time', valueType: 'date', hideInForm: true, hideInTable: true },
    { title: '修改时间', dataIndex: 'update_time', valueType: 'date', hideInForm: true, hideInTable: true },
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
        placeholder: '请输入字典ID、字典名、字典编码搜索',
        style: { width: 304 },
        onSearch: (value: string) => {
          setParams({ keywordSearch: value });
        },
      },
      settings: [],
    },
    optionsRender: (_, dom) => {
      return [
        <Button type="primary" key={'ref'} onClick={() => {}}>刷新字典缓存</Button>,
        ...dom
      ];
    },
  };

  const handleAddItem: XinTableProps<IDictItem>['onFinish'] = async (formData, mode, initValue) => {
    if (!selectedRows) {
      message.warning('请选择字典！');
      return false;
    }
    if (mode === 'edit' && initValue) {
      let data = { ...initValue, ...formData };
      await Update('/sys/dict/item/' + initValue.id, data);
      message.success('编辑成功');
      return true;
    } else {
      let data = { ...formData, dict_id: selectedRows.id, };
      await Create('/sys/dict/item', data);
      message.success('添加成功');
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
              headerTitle: `字典项管理（${selectedRows?.name}）`
            }}
            accessName={'system.dict.item'}
            formProps={{ grid: true, colProps: { span: 12 } }}
          />
        ) : (
          <Empty description={'请选择字典'} />
        )}
      </Col>
    </Row>
  );
}