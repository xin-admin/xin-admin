import { Card, Space, Table, DatePicker, Typography } from 'antd';
import { DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getQueryList } from '@/api/watcher';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';
import type { QueryRecord } from '@/domain/iSysWatcher';
const { Paragraph } = Typography;
/**
 * SQL查询记录查询页面
 */
export default function QueryRecordPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QueryRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /**
   * 加载数据
   */
  const fetchData = async (page = 1, pageSize = 10, date = selectedDate) => {
    setLoading(true);
    try {
      const params = {
        current: page,
        pageSize,
        date: date.format('YYYY-MM-DD'),
        type: 'query' as const,
      };
      
      const response = await getQueryList(params);
      
      // 根据API返回结构调整数据获取
      const listData = response.data.data?.data || [];
      const totalCount = response.data.data?.total || listData.length;
      
      setData(listData);
      setPagination({
        current: page,
        pageSize,
        total: totalCount,
      });
    } catch (error) {
      console.error('获取查询记录失败:', error);
      setData([]);
      setPagination({
        current: page,
        pageSize,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /**
   * 处理表格分页变化
   */
  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  /**
   * 处理日期变化
   */
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    fetchData(1, pagination.pageSize, date);
  };

  /**
   * 表格列配置
   */
  const columns: TableProps<QueryRecord>['columns'] = [
    {
      title: '数据库连接',
      dataIndex: 'connection',
      key: 'connection',
      width: 100,
      ellipsis: true,
      render: (connection: string) => (
        <Space>
          <DatabaseOutlined style={{ color: '#1890ff' }} />
          <span>{connection}</span>
        </Space>
      ),
    },
    {
      title: 'SQL语句',
      dataIndex: 'sql',
      key: 'sql',
      ellipsis: true,
      width: 500,
      render: (sql: string) => (
        <Paragraph 
          copyable 
          code 
          ellipsis 
          style={{ fontSize: '12px', margin: 0 }}
        >
          {sql}
        </Paragraph>
      ),
    },
    {
      title: '执行时间',
      dataIndex: 'time',
      key: 'time',
      width: 80,
      align: 'center',
      render: (time: string) => {
        const duration = parseFloat(time);
        return (
          <Space>
            <ClockCircleOutlined style={{ 
              color: duration >= 1000 ? '#ff4d4f' : duration >= 100 ? '#faad14' : '#52c41a'
            }} />
            <span style={{ 
              color: duration >= 1000 ? '#ff4d4f' : duration >= 100 ? '#faad14' : '#52c41a'
            }}>
              {time}ms
            </span>
          </Space>
        );
      },
    },
    {
      title: '慢查询',
      dataIndex: 'slow',
      key: 'slow',
      width: 80,
      align: 'center',
      render: (slow: boolean) => (
        <span style={{ color: slow ? '#ff4d4f' : '#52c41a' }}>
          {slow ? '是' : '否'}
        </span>
      ),
    },
    {
      title: '文件位置',
      dataIndex: 'file',
      key: 'file',
      width: 500,
      ellipsis: true,
      render: (file, record) => (
        <Paragraph copyable ellipsis style={{ fontSize: '12px', margin: 0 }}>
          {record.line}行 : {file} 
        </Paragraph>
      ),
    },
  ];

  return (
    <Card 
      title={(
        <Space>
          <DatabaseOutlined />
          <span>SQL查询记录查询</span>
        </Space>
      )}
      extra={(
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          placeholder="选择日期"
          style={{ width: 150 }}
        />
      )}
    >
      <Table<QueryRecord>
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        rowKey="id"
      />
    </Card>
  );
}