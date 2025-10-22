import {Avatar, Tag} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import XinTable from '@/components/XinTable';
import {type ProTableProps} from '@ant-design/pro-components';
import type {XinTableColumn, XinTableRef} from "@/components/XinTable/typings.ts";
import type ISysUser from "@/domain/iSysUser.ts";
import AuthButton from "@/components/AuthButton";
import {deptField, roleField, type DeptFieldType, type RoleFieldType} from "@/api/sysUserList.ts";

const Table: React.FC = () => {
  const tableRef = useRef<XinTableRef>(null);
  const [roles, setRoles] = useState<RoleFieldType[]>([]);
  const [depts, setDepts] = useState<DeptFieldType[]>([]);
  const colorList = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
  useEffect(() => {
    deptField().then(res => setDepts(res.data.data!));
    roleField().then(res => setRoles(res.data.data!));
  },[])

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
      valueEnum: {
        0: {text: '男'},
        1: {text: '女'},
      },
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
      render: (_, record) => {
        return record.roles_field?.map((item, index) => (
          <Tag key={item.role_id || index} color={colorList[index % colorList.length]}>
            {item.name}
          </Tag>
        ))
      },
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
      fieldProps: {
        options: depts,
        fieldNames: {label: 'name', value: 'dept_id'}
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radioButton',
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

  const [tableParams, setParams] = useState<{
    keywordSearch?: string;
    dept_id?: string | number | bigint;
  }>();

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

  return (
    <XinTable<ISysUser>
      api={'/sys-user/list'}
      columns={columns}
      rowKey={'id'}
      tableRef={tableRef}
      accessName={'sys-user.list'}
      afterOperateRender={(record) => (
        <>
          {record.id !== 1 &&
            <AuthButton auth={'sys-user.list.resetPassword'}>
              修改密码
            </AuthButton>
          }
        </>
      )}
      editShow={(i) => i.id !== 1}
      deleteShow={(i) => i.id !== 1}
      tableProps={tableProps}
      formProps={{
        grid: true,
        colProps: {span: 12},
      }}
    />
  );
};

export default Table;
