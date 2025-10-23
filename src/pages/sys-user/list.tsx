import {Avatar, Button, Form, Input, message, Modal, Tag, Tooltip} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import XinTable from '@/components/XinTable';
import {type ProTableProps} from '@ant-design/pro-components';
import type {XinTableColumn, XinTableRef} from "@/components/XinTable/typings.ts";
import type ISysUser from "@/domain/iSysUser.ts";
import AuthButton from "@/components/AuthButton";
import type {DeptFieldType, ResetPasswordType, RoleFieldType} from "@/api/sysUserList.ts";
import {deptField, resetPassword, roleField} from "@/api/sysUserList.ts";
import {RedoOutlined} from "@ant-design/icons";

interface TableParams {
  keywordSearch?: string;
  dept_id?: string | number | bigint;
}

const Table: React.FC = () => {
  /** 表格 REF */
  const tableRef = useRef<XinTableRef>(null);
  /** 角色选项数据 */
  const [roles, setRoles] = useState<RoleFieldType[]>([]);
  /** 部门选项数据 */
  const [depts, setDepts] = useState<DeptFieldType[]>([]);
  /** 高级表格列配置 */
  const columns: XinTableColumn<ISysUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      sorter: true,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
      align: 'center',
      formItemProps: {rules: [{required: true, message: '该项为必填'}]},
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'text',
      colProps: {md: 7},
      align: 'center',
      formItemProps: {rules: [{required: true, message: '该项为必填'}]},
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueType: 'radio',
      filters: true,
      align: 'center',
      hideInSearch: true,
      fieldProps: {
        options: [
          { value: 0, label: '男' },
          { value: 1, label: '女' },
        ]
      },
      valueEnum: {
        0: {text: '男'},
        1: {text: '女'},
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      colProps: {md: 6},
      align: 'center',
      formItemProps: {rules: [{required: true, message: '该项为必填'}]},
    },
    {
      title: '管理员角色',
      dataIndex: 'role_id',
      valueType: 'select',
      align: 'center',
      hideInSearch: true,
      formItemProps: {
        rules: [{required: true, message: '该项为必填'}],
      },
      render: (dom) => <Tag color={'magenta'}>{dom}</Tag>,
      fieldProps: {
        mode: 'multiple',
        options: roles,
        fieldNames: {label: 'name', value: 'role_id'},
      },
    },
    {
      title: '管理员部门',
      dataIndex: 'dept_id',
      valueType: 'treeSelect',
      align: 'center',
      hideInSearch: true,
      formItemProps: {
        rules: [{required: true, message: t("sysUserList.role.required")}],
      },
      render: (dom) => <Tag color={'volcano'}>{dom}</Tag>,
      fieldProps: {
        options: depts,
        fieldNames: {label: 'name', value: 'dept_id'}
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radioButton',
      fieldProps: {
        options: [
          { value: 0, label: '禁用' },
          { value: 1, label: '启用' },
        ]
      },
      valueEnum: {
        0: {text: '禁用', status: 'Error'},
        1: {text: '启用', status: 'Success'},
      },
      formItemProps: {rules: [{required: true, message: '该项为必填'}]},
      filters: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      valueType: 'text',
      formItemProps: {rules: [{required: true, message: '该项为必填'}]},
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      valueType: 'avatar',
      hideInForm: true,
      render: (_, entity) => <Avatar size={'small'} src={entity.avatar_url}></Avatar>,
      align: 'center',
    },
    {
      valueType: 'dependency',
      hideInTable: true,
      hideInSearch: true,
      name: ['id'],
      columns: ({id}) => {
        if (! id) {
          return [
            {
              title: '密码',
              dataIndex: 'password',
              valueType: 'password',
              formItemProps: {rules: [{required: true, message: '该项为必填'}]},
              fieldProps: {autoComplete: ''},
            },
            {
              title: '确认密码',
              dataIndex: 'rePassword',
              valueType: 'password',
              formItemProps: {rules: [{required: true, message: '该项为必填'}]},
              fieldProps: {autoComplete: ''},
            },
          ];
        }
        return [];
      },
    },
    {
      valueType: 'fromNow',
      title: '创建时间',
      hideInForm: true,
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      valueType: 'fromNow',
      title: '更新时间',
      hideInForm: true,
      dataIndex: 'updated_at',
      align: 'center',
    },
  ];
  /** 表格查询参数 */
  const [tableParams, setParams] = useState<TableParams>();
  /** 表格参数 */
  const tableProps: ProTableProps<ISysUser, any> = {
    params: tableParams,
    toolbar: {
      search: {
        placeholder: '请输入昵称、账户、手机号搜索',
        style: {width: 304},
        onSearch: (value: string) => {
          setParams({keywordSearch: value});
        },
      },
      settings: [],
    },
    bordered: true,
    cardProps: {
      bordered: true
    },
    search: {}
  }
  /** 修改密码相关状态 */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetUserId, setResetUserId] = useState<number>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  /** 打开重置密码框 */
  const showRedoModal = (id: number) => {
    setIsModalOpen(true);
    setResetUserId(id);
  };
  /** 提交重置密码 */
  const handleRedoSubmit = async (values: ResetPasswordType) => {
    try {
      setButtonLoading(true);
      await resetPassword({...values, id: resetUserId!});
      setIsModalOpen(false);
      message.success("重置成功！");
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    deptField().then(res => setDepts(res.data.data!));
    roleField().then(res => setRoles(res.data.data!));
  }, [])

  return (
    <>
      <XinTable<ISysUser>
        api={'/sys-user/list'}
        columns={columns}
        rowKey={'id'}
        tableRef={tableRef}
        accessName={'sys-user.list'}
        beforeOperateRender={(record) => (
          <>
            {record.id !== 1 &&
              <AuthButton auth={'sys-user.list.resetPassword'}>
                <Tooltip title={"重置密码"}>
                  <Button
                    variant={'solid'}
                    color={'pink'}
                    icon={<RedoOutlined/>}
                    size={'small'}
                    onClick={() => showRedoModal(record.id!)}
                  />
                </Tooltip>
              </AuthButton>
            }
          </>
        )}
        editShow={(i) => i.id !== 1}
        deleteShow={(i) => i.id !== 1}
        tableProps={tableProps}
        formProps={{grid: true, colProps: {span: 12}}}
      />
      <Modal
        title="重置密码"
        closable={{'aria-label': 'Custom Close Button'}}
        open={isModalOpen}
        footer={null}
        styles={{body: {paddingTop: 20}}}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form<ResetPasswordType> autoComplete="off" layout={'vertical'} onFinish={handleRedoSubmit}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{required: true, message: 'Please input your password!'}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="rePassword"
            rules={[{required: true, message: 'Please input your password!'}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item label={null} style={{marginTop: 30}}>
            <Button type="primary" block size={'large'} htmlType="submit" loading={buttonLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Table;
