import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Dropdown, Form, Image, message, Modal, Pagination, Popconfirm, Progress, Row, Select, Space, Spin, Table, Tooltip, Tree, Upload, type UploadFile} from 'antd';
import {useTranslation} from 'react-i18next';
import type {TreeProps} from 'antd/es/tree';
import {AppstoreOutlined, AudioOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FileAddOutlined, FileImageOutlined, FileTextOutlined, FileZipOutlined, FolderOpenOutlined, TableOutlined, UploadOutlined, VideoCameraOutlined} from '@ant-design/icons';
import type {ISysFileGroup} from '@/domain/iSysFileGroup';
import type {ISysFileInfo, SysFileType} from '@/domain/iSysFile';
import {createFileGroup, deleteFileGroup, getFileGroupList, updateFileGroup} from '@/api/sys/sysFileGroup';
import {deleteFile, getFileList, uploadFile} from '@/api/sys/sysFile';
import type {ProFormInstance} from '@ant-design/pro-components';
import {BetaSchemaForm} from '@ant-design/pro-components';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';

const FileManagement: React.FC = () => {
  const {t} = useTranslation();
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

  /** 树形数据根节点 */
  const getTreeData = () => [{
    key: 0, 
    title: t('sysFile.root'), 
    icon: <FolderOpenOutlined/>, 
    children: convertToTreeData(fileGroups)
  }];

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
    const isEdit = !!editingGroup;
    await (isEdit ? updateFileGroup({...values, id: editingGroup.id}) : createFileGroup(values));
    message.success(t('sysFile.saveFolderSuccess', {action: isEdit ? '修改' : '新增'}));
    setGroupModalOpen(false);
    loadFileGroups();
    return true;
  };

  /** 删除文件夹 */
  const handleDeleteGroup = async (id: number) => {
    await deleteFileGroup(id);
    message.success(t('sysFile.deleteFolderSuccess'));
    if (selectedGroupId === id) setSelectedGroupId(0);
    loadFileGroups();
  };

  /** 上传文件 */
  const handleUpload = async () => {
    if (!fileList.length) return message.warning(t('sysFile.selectFileWarning'));
    try {
      setUploading(true);
      for (const file of fileList) {
        await uploadFile(file.originFileObj as File, uploadFileType, Number(selectedGroupId) || undefined, setUploadProgress);
      }
      message.success(t('sysFile.uploadSuccess'));
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
    message.success(t('sysFile.deleteSuccess'));
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
    {label: t('sysFile.type.image'), value: 10}, {label: t('sysFile.type.audio'), value: 20}, {label: t('sysFile.type.video'), value: 30},
    {label: t('sysFile.type.archive'), value: 40}, {label: t('sysFile.type.other'), value: 50}
  ];

  /** 文件列 */
  const columns: ColumnsType<ISysFileInfo> = [
    {title: t('sysFile.fileName'), dataIndex: 'file_name', ellipsis: true},
    {title: t('sysFile.fileType'), dataIndex: 'file_type', width: 100, align: 'center', render: (type: SysFileType) => FILE_TYPE_OPTIONS.find(opt => opt.value === type)?.label},
    {title: t('sysFile.fileSize'), dataIndex: 'file_size', width: 120, align: 'center', render: formatFileSize},
    {title: t('sysFile.preview'), dataIndex: 'preview_url', width: 100, align: 'center', render: (url: string, r: ISysFileInfo) => r.file_type === 10 ? <Image src={url} width={50} height={50}/> : FILE_ICONS[r.file_type!]},
    {title: t('sysFile.createdAt'), dataIndex: 'created_at', width: 180, align: 'center', render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss')},
    {
      title: t('sysFile.action'), key: 'action', width: 180, align: 'center',
      render: (_, r) => (
        <Space>
          <Tooltip title={t('sysFile.download')}><Button icon={<DownloadOutlined/>} size="small" onClick={() => handleDownloadFile(r.id!)}/></Tooltip>
          <Popconfirm title={t('sysFile.confirmDelete')} onConfirm={() => handleDeleteFile(r.id!)} okText={t('sysFile.ok')} cancelText={t('sysFile.cancel')}>
            <Tooltip title={t('sysFile.delete')}><Button type="primary" danger icon={<DeleteOutlined/>} size="small"/></Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* 左侧文件夹树 */}
      <Col xs={24} lg={6}>
        <Card title={t('sysFile.fileFolder')} variant={'borderless'}>
          <Tree
            showIcon
            showLine
            defaultExpandAll
            onSelect={onTreeSelect}
            treeData={getTreeData()}
            defaultExpandedKeys={[0]}
            selectedKeys={[selectedGroupId]}
            titleRender={(node) => (
              <Dropdown menu={{items: [
                {label: <Space><FileAddOutlined/>{t('sysFile.addFolder')}</Space>, key: 'add', onClick: () => handleAddGroup(node.key)},
                {label: <Space><EditOutlined/>{t('sysFile.editFolder')}</Space>, key: 'edit', disabled: node.key === 0, onClick: () => fileGroupMap.has(node.key) && handleEditGroup(fileGroupMap.get(node.key)!)},
                {type: 'divider'},
                {label: <Popconfirm title={t('sysFile.confirmDeleteFolder')} onConfirm={(e) => { e?.stopPropagation(); handleDeleteGroup(node.key); }} okText={t('sysFile.ok')} cancelText={t('sysFile.cancel')}><Space><DeleteOutlined/>{t('sysFile.deleteFolder')}</Space></Popconfirm>, danger: true, disabled: node.key === 0, key: 'del'}
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
          title={t('sysFile.fileList')}
          extra={
            <Space>
              <Button type={viewMode === 'table' ? 'primary' : 'default'} icon={<TableOutlined/>} onClick={() => setViewMode('table')}>{t('sysFile.tableView')}</Button>
              <Button type={viewMode === 'card' ? 'primary' : 'default'} icon={<AppstoreOutlined/>} onClick={() => setViewMode('card')}>{t('sysFile.cardView')}</Button>
              <Button type="primary" icon={<UploadOutlined/>} onClick={() => setUploadModalOpen(true)}>{t('sysFile.upload')}</Button>
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
                          <Tooltip title={t('sysFile.download')} key="download"><DownloadOutlined onClick={() => handleDownloadFile(file.id!)}/></Tooltip>,
                          <Popconfirm key="delete" title={t('sysFile.confirmDelete')} onConfirm={() => handleDeleteFile(file.id!)} okText={t('sysFile.ok')} cancelText={t('sysFile.cancel')}><Tooltip title={t('sysFile.delete')}><DeleteOutlined style={{color: '#ff4d4f'}}/></Tooltip></Popconfirm>
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
        title={editingGroup ? t('sysFile.editFolderTitle') : t('sysFile.addFolderTitle')}
        open={groupModalOpen}
        layoutType="ModalForm"
        columns={[
          {title: t('sysFile.folderName'), dataIndex: 'name', valueType: 'text', formItemProps: {rules: [{required: true, message: t('sysFile.folderNameRequired')}]}},
          {
            title: t('sysFile.parentFolder'), 
            dataIndex: 'parent_id',
            valueType: 'treeSelect', 
            fieldProps: {
              options: getTreeData(), 
              fieldNames: {label: 'title', value: 'key'}, 
              disabled: true
            }
          },
          {title: t('sysFile.sort'), dataIndex: 'sort', valueType: 'digit'},
          {title: t('sysFile.describe'), dataIndex: 'describe', valueType: 'textarea'}
        ]}
        formRef={groupFormRef}
        onFinish={handleSaveGroup}
        modalProps={{onCancel: () => setGroupModalOpen(false)}}
      />

      <Modal title={t('sysFile.uploadTitle')} open={uploadModalOpen} onOk={handleUpload} onCancel={() => { setUploadModalOpen(false); setFileList([]); setUploadProgress(0); }} confirmLoading={uploading}>
        <Form layout="vertical">
          <Form.Item label={t('sysFile.uploadFileType')} required><Select value={uploadFileType} onChange={setUploadFileType} options={FILE_TYPE_OPTIONS}/></Form.Item>
          <Form.Item label={t('sysFile.selectFile')} required><Upload fileList={fileList} onChange={({fileList}) => setFileList(fileList)} beforeUpload={() => false} multiple><Button icon={<UploadOutlined/>}>{t('sysFile.selectFile')}</Button></Upload></Form.Item>
          {uploading && <Form.Item label={t('sysFile.uploadProgress')}><Progress percent={uploadProgress}/></Form.Item>}
        </Form>
      </Modal>
    </Row>
  );
};

export default FileManagement;
