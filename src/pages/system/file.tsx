import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Dropdown, Form, Image, message, Modal, Pagination, Popconfirm, Progress, Row, Select, Space, Spin, Table, Tooltip, Tree, Upload, type UploadFile} from 'antd';
import type {TreeProps} from 'antd/es/tree';
import {AppstoreOutlined, AudioOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FileAddOutlined, FileImageOutlined, FileTextOutlined, FileZipOutlined, FolderOpenOutlined, TableOutlined, UploadOutlined, VideoCameraOutlined} from '@ant-design/icons';
import type {ISysFileGroup} from '@/domain/iSysFileGroup';
import type {ISysFileInfo, SysFileType} from '@/domain/iSysFile';
import {createFileGroup, deleteFileGroup, getFileGroupList, updateFileGroup} from '@/api/sysFileGroup';
import {deleteFile, getFileList, uploadFile} from '@/api/sysFile';
import type {ProFormInstance} from '@ant-design/pro-components';
import {BetaSchemaForm} from '@ant-design/pro-components';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';

const FileManagement: React.FC = () => {
  const [fileGroups, setFileGroups] = useState<ISysFileGroup[]>([]);
  const [fileGroupMap, setFileGroupMap] = useState<Map<React.Key, ISysFileGroup>>(new Map());
  const [selectedGroupId, setSelectedGroupId] = useState<React.Key>(0);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ISysFileGroup | null>(null);
  const groupFormRef = useRef<ProFormInstance>(null);
  const [files, setFiles] = useState<ISysFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFileType, setUploadFileType] = useState<SysFileType>(10);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});

  /** 加载文件夹列表 */
  const loadFileGroups = async () => {
    const {data} = await getFileGroupList();
    const groups = data.data || [];
    setFileGroups(groups);
    const groupMap = new Map<React.Key, ISysFileGroup>();
    const buildMap = (items: ISysFileGroup[]) => {
      items.forEach(item => {
        groupMap.set(item.id, item);
        if (item.children) buildMap(item.children);
      });
    };
    buildMap(groups);
    setFileGroupMap(groupMap);
  };

  /** 加载文件列表 */
  const loadFiles = async (page = 1, pageSize = 5) => {
    try {
      setLoading(true);
      const {data} = await getFileList({group_id: Number(selectedGroupId) || 0, page, pageSize});
      setFiles(data.data?.data || []);
      setPagination({current: data.data?.current_page || page, pageSize: data.data?.per_page || pageSize, total: data.data?.total || 0});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFileGroups(); }, []);
  useEffect(() => { loadFiles(); }, [selectedGroupId]);

  /** 转换为树形数据 */
  const convertToTreeData = (groups: ISysFileGroup[]): any[] => groups.map(g => ({
    key: g.id, title: g.name, icon: <FolderOpenOutlined/>, children: g.children ? convertToTreeData(g.children) : []
  }));

  /** 树形选择 */
  const onTreeSelect: TreeProps['onSelect'] = (keys) => {
    if(keys.length > 0) {
      setSelectedGroupId(keys[0])
    }
  };

  /** 添加文件夹 */
  const handleAddGroup = (parentId: number) => {
    setEditingGroup(null);
    groupFormRef.current?.resetFields();
    groupFormRef.current?.setFieldsValue({parent_id: parentId});
    setGroupModalOpen(true);
  };

  /** 编辑文件夹 */
  const handleEditGroup = (group: ISysFileGroup) => {
    setEditingGroup(group);
    groupFormRef.current?.setFieldsValue(group);
    setGroupModalOpen(true);
  };

  /** 保存文件夹 */
  const handleSaveGroup = async (values: ISysFileGroup) => {
    await (editingGroup ? updateFileGroup({...values, id: editingGroup.id}) : createFileGroup(values));
    message.success(`${editingGroup ? '修改' : '新增'}文件夹成功`);
    setGroupModalOpen(false);
    loadFileGroups();
    return true;
  };

  /** 删除文件夹 */
  const handleDeleteGroup = async (id: number) => {
    await deleteFileGroup(id);
    message.success('删除文件夹成功');
    if (selectedGroupId === id) setSelectedGroupId(0);
    loadFileGroups();
  };

  /** 上传文件 */
  const handleUpload = async () => {
    if (!fileList.length) return message.warning('请选择要上传的文件');
    try {
      setUploading(true);
      for (const file of fileList) {
        await uploadFile(file.originFileObj as File, uploadFileType, Number(selectedGroupId) || undefined, setUploadProgress);
      }
      message.success('上传成功');
      setUploadModalOpen(false);
      setFileList([]);
      setUploadProgress(0);
      loadFiles();
    } finally {
      setUploading(false);
    }
  };

  /** 删除文件 */
  const handleDeleteFile = async (id: number) => {
    await deleteFile(String(id));
    message.success('删除文件成功');
    loadFiles();
  };

  /** 下载文件 */
  const handleDownloadFile = async (id: number) => {
    const link = document.createElement('a');
    link.href = import.meta.env.VITE_BASE_URL + `/sys/file/list/download/${id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** 文件图标 */
  const FILE_ICONS: Record<SysFileType, React.ReactNode> = {
    10: <FileImageOutlined style={{fontSize: 24, color: '#52c41a'}}/>,
    20: <AudioOutlined style={{fontSize: 24, color: '#1890ff'}}/>,
    30: <VideoCameraOutlined style={{fontSize: 24, color: '#eb2f96'}}/>,
    40: <FileZipOutlined style={{fontSize: 24, color: '#faad14'}}/>,
    50: <FileTextOutlined style={{fontSize: 24, color: '#8c8c8c'}}/>
  };

  /** 格式化文件大小 */
  const formatFileSize = (size = 0) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0, s = size;
    while (s >= 1024 && i < 3) { s /= 1024; i++; }
    return `${s.toFixed(2)} ${units[i]}`;
  };

  /** 文件类型选项 */
  const FILE_TYPE_OPTIONS = [
    {label: '图片', value: 10}, {label: '音频', value: 20}, {label: '视频', value: 30},
    {label: '压缩包', value: 40}, {label: '其他', value: 50}
  ];

  /** 文件列 */
  const columns: ColumnsType<ISysFileInfo> = [
    {title: '文件名', dataIndex: 'file_name', ellipsis: true},
    {title: '类型', dataIndex: 'file_type', width: 100, align: 'center', render: (type: SysFileType) => FILE_TYPE_OPTIONS.find(t => t.value === type)?.label},
    {title: '大小', dataIndex: 'file_size', width: 120, align: 'center', render: formatFileSize},
    {title: '预览', dataIndex: 'preview_url', width: 100, align: 'center', render: (url: string, r: ISysFileInfo) => r.file_type === 10 ? <Image src={url} width={50} height={50}/> : FILE_ICONS[r.file_type!]},
    {title: '创建时间', dataIndex: 'created_at', width: 180, align: 'center', render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss')},
    {
      title: '操作', key: 'action', width: 180, align: 'center',
      render: (_, r) => (
        <Space>
          <Tooltip title="下载"><Button icon={<DownloadOutlined/>} size="small" onClick={() => handleDownloadFile(r.id!)}/></Tooltip>
          <Popconfirm title="确定删除该文件吗？" onConfirm={() => handleDeleteFile(r.id!)} okText="确定" cancelText="取消">
            <Tooltip title="删除"><Button type="primary" danger icon={<DeleteOutlined/>} size="small"/></Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* 左侧文件夹树 */}
      <Col xs={24} lg={6}>
        <Card title="文件夹" variant={'borderless'}>
          <Tree
            showIcon
            showLine
            defaultExpandAll
            onSelect={onTreeSelect}
            treeData={[{key: 0, title: 'root', icon: <FolderOpenOutlined/>, children: convertToTreeData(fileGroups)}]}
            defaultExpandedKeys={[0]}
            selectedKeys={[selectedGroupId]}
            titleRender={(node) => (
              <Dropdown menu={{items: [
                {label: <Space><FileAddOutlined/>新增子文件夹</Space>, key: 'add', onClick: () => handleAddGroup(node.key)},
                {label: <Space><EditOutlined/>编辑文件夹</Space>, key: 'edit', disabled: node.key === 0, onClick: () => fileGroupMap.has(node.key) && handleEditGroup(fileGroupMap.get(node.key)!)},
                {type: 'divider'},
                {label: <Popconfirm title="确定删除该文件夹吗？" onConfirm={(e) => { e?.stopPropagation(); handleDeleteGroup(node.key); }} okText="确定" cancelText="取消"><Space><DeleteOutlined/>删除文件夹</Space></Popconfirm>, danger: true, disabled: node.key === 0, key: 'del'}
              ]}} trigger={['contextMenu']}>
                <span>{node.title}</span>
              </Dropdown>
            )}
          />
        </Card>
      </Col>

      {/* 右侧文件列表 */}
      <Col xs={24} lg={18}>
        <Card
          variant={'borderless'}
          title="文件列表"
          extra={
            <Space>
              <Button type={viewMode === 'table' ? 'primary' : 'default'} icon={<TableOutlined/>} onClick={() => setViewMode('table')}>表格</Button>
              <Button type={viewMode === 'card' ? 'primary' : 'default'} icon={<AppstoreOutlined/>} onClick={() => setViewMode('card')}>卡片</Button>
              <Button type="primary" icon={<UploadOutlined/>} onClick={() => setUploadModalOpen(true)}>上传文件</Button>
            </Space>
          }
        >
          {viewMode === 'table' ? (
            <Table columns={columns} dataSource={files} rowKey="id" loading={loading} pagination={{...pagination, onChange: loadFiles}}/>
          ) : (
            <>
              <Spin spinning={loading}>
                <Row gutter={[16, 16]} style={{marginBottom: '20px'}}>
                  {files.map(file => (
                    <Col xs={12} sm={8} md={6} lg={4} key={file.id}>
                      <Card hoverable
                        cover={file.file_type === 10 ? <Image src={file.preview_url} alt={file.file_name} style={{height: 160, objectFit: 'cover'}}/> : <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa'}}>{FILE_ICONS[file.file_type!]}</div>}
                        actions={[
                          <Tooltip title="下载" key="download"><DownloadOutlined onClick={() => handleDownloadFile(file.id!)}/></Tooltip>,
                          <Popconfirm key="delete" title="确定删除该文件吗？" onConfirm={() => handleDeleteFile(file.id!)} okText="确定" cancelText="取消"><Tooltip title="删除"><DeleteOutlined style={{color: '#ff4d4f'}}/></Tooltip></Popconfirm>
                        ]}>
                        <Card.Meta title={<Tooltip title={file.file_name}><div style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.file_name}</div></Tooltip>} description={formatFileSize(file.file_size)}/>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>
              <Pagination {...pagination} onChange={loadFiles}/>
            </>
          )}
        </Card>
      </Col>

      <BetaSchemaForm<ISysFileGroup>
        title={editingGroup ? '编辑文件夹' : '新增文件夹'}
        open={groupModalOpen}
        layoutType="ModalForm"
        columns={[
          {title: '文件夹名称', dataIndex: 'name', valueType: 'text', formItemProps: {rules: [{required: true, message: '请输入文件夹名称'}]}},
          {
            title: '父级文件夹', 
            dataIndex: 'parent_id',
            valueType: 'treeSelect', 
            fieldProps: {
              options: [{key: 0, title: 'root', icon: <FolderOpenOutlined/>, children: convertToTreeData(fileGroups)}], 
              fieldNames: {label: 'title', value: 'key'}, 
              disabled: true
            }
          },
          {title: '排序', dataIndex: 'sort', valueType: 'digit'},
          {title: '描述', dataIndex: 'describe', valueType: 'textarea'}
        ]}
        formRef={groupFormRef}
        onFinish={handleSaveGroup}
        modalProps={{onCancel: () => setGroupModalOpen(false)}}
      />

      <Modal title="上传文件" open={uploadModalOpen} onOk={handleUpload} onCancel={() => { setUploadModalOpen(false); setFileList([]); setUploadProgress(0); }} confirmLoading={uploading}>
        <Form layout="vertical">
          <Form.Item label="文件类型" required><Select value={uploadFileType} onChange={setUploadFileType} options={FILE_TYPE_OPTIONS}/></Form.Item>
          <Form.Item label="选择文件" required><Upload fileList={fileList} onChange={({fileList}) => setFileList(fileList)} beforeUpload={() => false} multiple><Button icon={<UploadOutlined/>}>选择文件</Button></Upload></Form.Item>
          {uploading && <Form.Item label="上传进度"><Progress percent={uploadProgress}/></Form.Item>}
        </Form>
      </Modal>
    </Row>
  );
};

export default FileManagement;
