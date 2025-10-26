import {
  Alert,
  Button,
  Card,
  type CardProps,
  Col,
  message,
  Popconfirm,
  Row,
  Space, Table, type TableProps, Tag,
  Tree,
  type TreeDataNode, type TreeProps
} from "antd";
import {BankOutlined, DeleteOutlined, PlusOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {listDept, addDept, updateDept, deleteDept, deptUsers} from "@/api/sysUserDept";
import type {IDeptUsers, ISysDept} from "@/domain/iSysDept.ts";
import {isArray, omit} from 'lodash';
import type {XinTableColumn} from "@/components/XinTable/typings.ts";
import {BetaSchemaForm, type ProFormInstance} from "@ant-design/pro-components";
import * as React from "react";

const deptMap = new Map<string, ISysDept>();

interface TableParams {
  page: number;
  pageSize: number;
  total: number;
}

const Dept = () => {
  /** 部门信息表单 */
  const formRef = useRef<ProFormInstance>(null);
  /** 新增表单 */
  const modalFormRef = useRef<ProFormInstance>(null);
  /** 新增表单对话框打开状态 */
  const [formOpen, setFormOpen] = useState<boolean>(false);
  /** 当前选中的部门 key */
  const [selectKey, setSelectKey] = useState<string>('');
  /** 当前（多选框）选择的部门 keys */
  const [checkedKeys , setCheckedKeys] = useState<React.Key[]>([]);
  /** 标签页 KEY */
  const [tabKey, setTabKey] = useState<string>('info');
  /** 标签页 Tab */
  const tabList: CardProps['tabList'] = [
    {
      key: 'info',
      label: '基本信息'
    },
    {
      key: 'users',
      label: '用户列表'
    },
  ];
  /** 部门数据 */
  const [deptData, setDeptData] = useState<TreeDataNode[]>([]);
  /** 部门用户列表数据 */
  const [users, setUsers] = useState<IDeptUsers[]>([]);
  /** 部门用户列表表格参数 */
  const [tableParams, setTableParams] = useState<TableParams>({ page: 1, pageSize: 10, total: 0 });
  /** 加载状态 */
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  /** 获取部门用户列表 */
  const selectUsers = async (id: number, params?: TableParams) => {
    try {
      setTableLoading(true);
      const data = await deptUsers(id, omit(params || tableParams, 'total'));
      setUsers(data.data.data!.data);
    } finally {
      setTableLoading(false);
    }
  }
  /** 刷新部门数据 */
  const refreshDept = async () => {
    setLoading(true);
    /** 转换部门类型 */
    const convertDeptToTreeData = (depts: ISysDept[]): TreeDataNode[] => {
      if (!depts?.length) return [];
      return depts.map(dept => {
        deptMap.set(dept.id!.toString(), omit(dept, 'children'));
        return {
          title: dept.name || '未命名部门',
          key: dept.id?.toString() || '',
          icon: dept.type === 0 ? <BankOutlined /> : dept.type === 1 ? <TeamOutlined /> : <UserOutlined />,
          children: convertDeptToTreeData(dept.children || [])
        }
      });
    };
    try {
      const res = await listDept();
      if(res.data.data && res.data.data.length > 0) {
        deptMap.clear();
        setDeptData(convertDeptToTreeData(res.data.data));
        if(!selectKey || !deptMap.has(selectKey)) {
          setSelectKey(res.data.data[0].id!.toString());
          formRef.current?.setFieldsValue(omit(res.data.data[0], 'children'));
          await selectUsers(res.data.data[0].id!);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  /** 新增部门点击事件 */
  const addChange = (children: boolean = false) => {
    setFormOpen(true);
    modalFormRef.current?.setFieldsValue({
      parent_id: children ? selectKey : 0,
      sort: 0,
      status: 0,
      type: 0
    })
  }
  /** 部门选择事件 */
  const onSelect: TreeProps['onSelect'] = (key) => {
    if(key && key.length >= 1) {
      setSelectKey(key[0].toString());
      formRef.current?.setFieldsValue(deptMap.get(key[0].toString()));
      selectUsers(Number(key[0])).then();
    }
  }
  /** 部门多选框选中事件 */
  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    if(isArray(checkedKeys)) {
      setCheckedKeys(checkedKeys);
    }else {
      setCheckedKeys(checkedKeys.checked);
    }
  }
  /** 表单提交 */
  const onSubmit = async (data: ISysDept, update: boolean = false) => {
    try {
      setLoading(true);
      if(!update) {
        await addDept(data);
        message.success("新增部门成功！");
        setFormOpen(false);
      }else {
        await updateDept(Number(selectKey), data);
        message.success("编辑部门成功！");
      }
      await refreshDept();
    }finally {
      setLoading(false);
    }
  }
  /** 批量删除 */
  const onDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteDept(checkedKeys);
      await refreshDept();
      setCheckedKeys([]);
      message.success('批量删除成功');
    }finally {
      setLoading(false);
    }
  }
  /** 表单列数据 */
  const columns: XinTableColumn[] = [
    {
      title: "部门名称",
      valueType: 'text',
      dataIndex: 'name',
      formItemProps: {rules: [{required: true, message: "部门名称必填！"}]},
    },
    {
      title: "部门编码",
      valueType: 'text',
      dataIndex: 'code',
      formItemProps: {rules: [{required: true, message: "部门编码必填！"}]},
    },
    {
      title: "部门类型",
      valueType: 'radioButton',
      dataIndex: 'type',
      fieldProps: {
        options: [
          { value: 0, label: "公司" },
          { value: 1, label: "部门" },
          { value: 2, label: "岗位" },
        ],
      },
      formItemProps: {rules: [{required: true, message: "部门类型必填！"}]},
    },
    {
      title: "上级部门",
      valueType: 'treeSelect',
      dataIndex: 'parent_id',
      fieldProps: {
        options: [
          {
            title: '顶级',
            key: 0,
            children: deptData
          }
        ],
        fieldNames: { label: 'title', value: 'key' },
        disabled: true
      },
      formItemProps: {rules: [{required: true, message: "上级部门必填！"}]},
    },
    {
      title: "邮箱",
      valueType: 'text',
      dataIndex: 'email',
    },
    {
      title: "地址",
      valueType: 'text',
      dataIndex: 'address',
    },
    {
      title: "电话",
      valueType: 'text',
      dataIndex: 'phone',
    },
    {
      title: "排序",
      valueType: 'digit',
      dataIndex: 'sort',
      formItemProps: {rules: [{required: true, message: "排序必填！"}]},
    },
    {
      title: "状态",
      valueType: 'radioButton',
      dataIndex: 'status',
      fieldProps: {
        options: [
          { value: 0, label: "正常" },
          { value: 1, label: "停用" },
        ]
      },
      formItemProps: {rules: [{required: true, message: "状态必填！"}]},
    },
    {
      title: "备注",
      valueType: 'textarea',
      dataIndex: 'remark',
    },
  ];
  /** 部门用户列表表格列 */
  const usersColumns: TableProps['columns'] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => (
        <>
          {value === 1 && <Tag color={'success'}>启用</Tag>}
          {value === 0 && <Tag color={'error'}>禁用</Tag>}
        </>
      )
    },
  ];
  /** 初始化 */
  useEffect(() => { refreshDept() }, []);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <BetaSchemaForm<ISysDept>
          layoutType={'ModalForm'}
          open={formOpen}
          modalProps={{
            title: '新增部门',
            forceRender: true,
            styles: { body: { paddingTop: 20, paddingRight: 40 } },
            onCancel: () => setFormOpen(false),
          }}
          formRef={modalFormRef}
          onFinish={(data) => onSubmit(data, false)}
          columns={columns}
          layout={'horizontal'}
        />
        <Card
          title={(
            <Space>
              <Button
                loading={loading}
                children={'新增部门'}
                icon={<PlusOutlined />}
                type={'primary'}
                onClick={() => addChange()}
              />
              <Button
                loading={loading}
                children={'添加下级'}
                icon={<PlusOutlined />}
                type={'primary'}
                onClick={() => addChange(true)}
              />
            </Space>
          )}
          loading={loading}
          styles={{ body: { minHeight: '70vh' } }}
        >
          {checkedKeys.length > 0 && (
            <Alert
              style={{ marginBottom: 20 }}
              message={`已选中 ${checkedKeys.length} 条记录`}
              type="info"
              action={
                <Space>
                  <Button size="small" type="primary" onClick={()=> setCheckedKeys([])}>
                    取消选择
                  </Button>
                  <Popconfirm
                    okText={'删除'}
                    cancelText={'取消删除'}
                    title={'删除部门'}
                    description={'你是否要删除这些部门？'}
                    onConfirm={() => onDeleteConfirm()}
                  >
                    <Button type="primary" icon={<DeleteOutlined />} size={'small'} danger loading={loading}/>
                  </Popconfirm>
                </Space>
              }
            />
          )}
          <Tree
            checkable
            treeData={deptData}
            showIcon={true}
            checkStrictly={true}
            selectedKeys={[selectKey]}
            defaultExpandedKeys={[selectKey]}
            onSelect={onSelect}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          tabList={tabList}
          tabProps={{ accessKey: tabKey }}
          onTabChange={setTabKey}
          styles={{ body: { minHeight: '70vh' } }}
        >
          <BetaSchemaForm<ISysDept>
            formRef={formRef}
            onFinish={(data) => onSubmit(data, true)}
            columns={columns}
            layout={'horizontal'}
            style={{ display: tabKey === 'info' ? "block" : "none" }}
            submitter={{
              render: () => (
                <Button
                  children={'保存信息'}
                  loading={loading}
                  htmlType={'submit'}
                  type={'primary'}
                />
              )
            }}
          />
          <Table<IDeptUsers>
            style={{ display: tabKey === 'users' ? "block" : "none" }}
            dataSource={users}
            bordered={true}
            columns={usersColumns}
            loading={tableLoading}
            size={'small'}
            pagination={{
              current: tableParams.page,
              pageSize: tableParams.pageSize,
              total: tableParams.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                const params = { total: tableParams.total, pageSize, page }
                setTableParams(params);
                selectUsers(Number(selectKey), params).then();
              }
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dept;