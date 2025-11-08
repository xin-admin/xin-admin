import XinTable from "@/components/XinTable";
import type {XinTableColumn} from "@/components/XinTable/typings.ts";
import {Button, Card, type CardProps, Col, message, Row, Switch, Table, type TableProps, Tag, Tooltip, Tree, type TreeProps} from "antd";
import {type RuleFieldsList, rulesList, saveRoleRules, statusRole, users as usersApi} from "@/api/sysUserRole";
import type {ISysRole} from "@/domain/iSysRole";
import React, {useEffect, useRef, useState} from "react";
import type ISysUser from "@/domain/iSysUser.ts";
import {KeyOutlined, SaveOutlined, SmileOutlined, TeamOutlined} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { isArray } from "lodash";

const Role = () => {
  const {t} = useTranslation();
  // 状态管理
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState('users');
  const [roleUsers, setRoleUsers] = useState<ISysUser[]>([]);
  const [roleUsersTotal, setRoleUsersTotal] = useState<number>(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [ruleFields, setRuleFields] = useState<RuleFieldsList[]>([]);
  const [checkedRuleKeys, setCheckedRuleKeys] = useState<React.Key[]>([]);
  const [isSavingRules, setIsSavingRules] = useState<boolean>(false);
  // 树展开状态
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // 树引用
  const treeRef = useRef<any>(null);
  // Tab 配置
  const tabList: CardProps['tabList'] = [
    {
      key: "users",
      icon: <TeamOutlined />,
      label: '用户列表',
    },
    {
      key: "rules",
      icon: <KeyOutlined />,
      label: '权限设置'
    }
  ];
  // 角色表格列配置
  const roleColumns: XinTableColumn<ISysRole>[] = [
    {
      title: '角色名称',
      dataIndex: "name",
      valueType: "text",
      align: "center",
      formItemProps: {
        rules: [{ required: true, message: '请输入角色名称' }],
      },
      render: (value, record) => (
        <>
          <Tooltip title={record.description}>
            <Tag bordered={false} color="blue">{value}</Tag>
          </Tooltip>
        </>
      ),
    },
    {
      title: '排序',
      dataIndex: "sort",
      valueType: "digit",
      hideInSearch: true,
      align: "center",
      formItemProps: {
        rules: [{ required: true, message: '请输入排序值' }],
      },
      render: (value) => <Tag bordered={false} color="purple">{value}</Tag>,
    },
    {
      title: '用户数',
      dataIndex: "countUser",
      valueType: "text",
      hideInForm: true,
      align: "center",
      renderText: (value: number) => <a><u>{value}人</u></a>,
    },
    {
      title: '状态',
      dataIndex: "status",
      valueType: "switch",
      align: "center",
      filters: true,
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '请选择状态' }],
      },
      valueEnum: {
        0: { text: "停用", status: 'Error' as const },
        1: { text: "启用", status: 'Success' as const },
      },
      render: (_, record) => (
        <Switch
          disabled={record.id === 1}
          checked={record.status === 1}
          checkedChildren='启用'
          unCheckedChildren='停用'
          onChange={async (_, event) => {
            event.stopPropagation();
            try {
              await statusRole(record.id!);
              message.success('状态更新成功');
            } catch (error) {
              message.error('状态更新失败');
              console.error('Failed to update role status:', error);
            }
          }}
        />
      ),
    },
    {
      valueType: 'textarea',
      title: '角色描述',
      dataIndex: 'description',
      hideInTable: true,
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
  // 用户列表表格列配置
  const userColumns: TableProps<ISysUser>['columns'] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      ellipsis: true,
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
      render: (value: number) => {
        const status = value === 0 
          ? { color: 'error', text: "禁用" }
          : { color: 'success', text: "正常" };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
      width: 80,
    },
  ];
  // 获取角色用户列表
  const fetchRoleUsers = async (page: number = 1, pageSize: number = 10) => {
    if (!selectedRoleId) return;
    setIsLoadingUsers(true);
    try {
      const response = await usersApi(selectedRoleId, { page, pageSize });
      const { data, total } = response.data.data!;
      setRoleUsers(data);
      setRoleUsersTotal(total);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  useEffect(() => { 
    rulesList().then(response => {
      setRuleFields(response.data.data!);
    });
   }, []);

  // 当selectedRoleId变化时，重新获取用户列表
  useEffect(() => { fetchRoleUsers(1, 10) }, [selectedRoleId]);

  // 事件处理函数
  const handleRoleSelect = (record: ISysRole) => {
    setSelectedRoleId(record.id!);
    // 回显当前角色的权限
    if (record.ruleIds && record.ruleIds.length > 0) {
      setCheckedRuleKeys(record.ruleIds);
    } else {
      setCheckedRuleKeys([]);
    }
  };

  // 渲染权限树节点
  const renderRuleTreeNode = (node: RuleFieldsList) => {
    if (node.local) {
      return (
        <>
          {t(node.local)} - <span style={{ color: '#00000040' }}>{node.title}</span>
        </>
      );
    }
    return <>{node.title}</>;
  };

  // 处理权限树勾选变化
  const handleRuleCheck: TreeProps['onCheck'] = (checkedKeys) => {
    if(isArray(checkedKeys)) {
      setCheckedRuleKeys(checkedKeys);
    }else {
      setCheckedRuleKeys(checkedKeys.checked);
    }
  };

  // 处理树展开状态变化
  const handleTreeExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys);
  };

  // 获取所有节点的key
  const getAllNodeKeys = (nodes: RuleFieldsList[]): React.Key[] => {
    let keys: React.Key[] = [];
    nodes.forEach(node => {
      keys.push(node.key);
      if (node.children && node.children.length > 0) {
        keys = [...keys, ...getAllNodeKeys(node.children)];
      }
    });
    return keys;
  };

  // 展开全部节点
  const expandAll = () => {
    const allKeys = getAllNodeKeys(ruleFields);
    setExpandedKeys(allKeys);
  };

  // 折叠全部节点
  const collapseAll = () => {
    setExpandedKeys([]);
  };

  // 选择全部节点
  const selectAll = () => {
    const allKeys = getAllNodeKeys(ruleFields);
    setCheckedRuleKeys(allKeys);
  };

  // 取消选择全部节点
  const deselectAll = () => {
    setCheckedRuleKeys([]);
  };

  // 反选节点
  const invertSelection = () => {
    const allKeys = getAllNodeKeys(ruleFields);
    const currentCheckedSet = new Set(checkedRuleKeys);
    const invertedKeys = allKeys.filter(key => !currentCheckedSet.has(key));
    setCheckedRuleKeys(invertedKeys);
  };

  // 保存权限设置
  const handleSaveRules = async () => {
    if (!selectedRoleId) {
      message.warning('请先选择角色');
      return;
    }
    setIsSavingRules(true);
    try {
      const ruleIds = checkedRuleKeys.map(key => Number(key));
      await saveRoleRules(selectedRoleId, ruleIds);
      message.success('权限保存成功');
    } finally {
      setIsSavingRules(false);
    }
  }

  return (
    <Row gutter={20}>
      {/* 角色列表 */}
      <Col span={12}>
        <XinTable<ISysRole>
          api="/sys-user/role"
          accessName="sys-user.role"
          columns={roleColumns}
          rowKey="id"
          tableProps={{
            headerTitle: '角色列表',
            search: false,
            bordered: true,
            rowSelection: {
              type: 'radio',
              selectedRowKeys: selectedRoleId ? [selectedRoleId] : [],
              onChange: (_, rows) => handleRoleSelect(rows[0])
            },
            onRow: (record) => ({
              onClick: () => handleRoleSelect(record)
            }),
            tableAlertRender: false,
            tableStyle: { minHeight: '70vh' },
            cardProps: { bordered: true },
          }}
          editShow={(row) => row.id !== 1}
          deleteShow={(row) => row.id !== 1}
          formProps={{
            grid: true,
            colProps: { span: 12 },
          }}
        />
      </Col>

      {/* 用户列表和权限管理 */}
      <Col span={12}>
        <Card
          tabList={tabList}
          onTabChange={setActiveTab}
          activeTabKey={activeTab}
          styles={{ body: { minHeight: '70vh' } }}
        >
          { selectedRoleId ? (
            activeTab === 'users' ? (
              <Table<ISysUser>
                loading={isLoadingUsers}
                dataSource={roleUsers}
                bordered={true}
                columns={userColumns}
                size="small"
                pagination={{
                  total: roleUsersTotal,
                  showSizeChanger: true,
                  onChange: fetchRoleUsers
                }}
              />
            ) : (
              <>
                <div style={{ height: '600px', overflow: 'auto', marginBottom: 12 }}>
                  <Tree
                    ref={treeRef}
                    checkable
                    treeData={ruleFields}
                    checkedKeys={checkedRuleKeys}
                    onCheck={handleRuleCheck}
                    titleRender={renderRuleTreeNode}
                    checkStrictly={true}
                    expandedKeys={expandedKeys}
                    onExpand={handleTreeExpand}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: '#666', fontSize: 12 }}>
                    已选择 {checkedRuleKeys.length} 项权限
                  </span>
                  <Button size="small" onClick={expandAll}>展开全部</Button>
                  <Button size="small" onClick={collapseAll}>折叠全部</Button>
                  <Button size="small" onClick={selectAll}>选择全部</Button>
                  <Button size="small" onClick={deselectAll}>清空选择</Button>
                  <Button size="small" onClick={invertSelection}>反选</Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={isSavingRules}
                    onClick={handleSaveRules}
                    size="small"
                    disabled={selectedRoleId === 1}
                  >
                    保存权限
                  </Button>
                </div>
              </>
            )
          ) : (
            <div style={{ textAlign: 'center', color: '#00000040' }}>
              <SmileOutlined style={{ fontSize: 40, marginBottom: 12 }} />
              <p>请先选择角色</p>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default Role;