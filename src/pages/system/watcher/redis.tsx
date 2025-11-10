import { Card, Space, Table, DatePicker, Typography, Tag } from 'antd';
import { DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getRedisList } from '@/api/watcher';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { TableProps } from 'antd';
import type { RedisRecord } from '@/domain/iSysWatcher';
const { Paragraph } = Typography;

/**
 * Redis记录查询页面
 */
export default function RedisRecordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RedisRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /**
   * 获取命令类型标签颜色
   */
  const getCommandColor = (command: string) => {
    const colors = {
      'get': 'blue',
      'set': 'green',
      'del': 'orange',
      'expire': 'purple',
      'exists': 'cyan',
      'keys': 'gold',
      'flushdb': 'red',
      'flushall': 'red',
    };
    return colors[command.toLowerCase() as keyof typeof colors] || 'default';
  };

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
        type: 'redis' as const,
      };
      
      const response = await getRedisList(params);
      
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
      console.error(t('watcher.redis.loadError'), error);
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
  const columns: TableProps<RedisRecord>['columns'] = [
    {
      title: t('watcher.redis.connection'),
      dataIndex: 'connection',
      key: 'connection',
      width: 120,
      ellipsis: true,
      render: (connection: string) => (
        <Space>
          <DatabaseOutlined style={{ color: '#ff4d4f' }} />
          <span>{connection}</span>
        </Space>
      ),
    },
    {
      title: t('watcher.redis.command'),
      dataIndex: 'command',
      key: 'command',
      width: 300,
      ellipsis: true,
      render: (command: string) => {
        const commandParts = command.split(' ');
        const mainCommand = commandParts[0]?.toLowerCase() || '';
        return (
          <Paragraph 
            copyable 
            ellipsis={{ rows: 2, expandable: false }}
            style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              margin: 0
            }}
          >
            <Tag color={getCommandColor(mainCommand)} style={{ marginRight: '8px' }}>
              {commandParts[0]}
            </Tag>
            {commandParts.slice(1).join(' ')}
          </Paragraph>
        );
      },
    },
    {
      title: t('watcher.redis.time'),
      dataIndex: 'time',
      key: 'time',
      width: 90,
      align: 'center',
      render: (time: string) => {
        const duration = parseFloat(time);
        const isSlow = duration >= 100;
        const isWarning = duration >= 50;
        return (
          <Space>
            <ClockCircleOutlined style={{ 
              color: isSlow ? '#fa541c' : isWarning ? '#faad14' : '#52c41a'
            }} />
            <span style={{ 
              color: isSlow ? '#d4380d' : isWarning ? '#d48806' : '#389e0d'
            }}>
              {t('watcher.common.ms', { time })}
            </span>
          </Space>
        );
      },
    },
  ];

  return (
    <Card 
      title={(
        <Space>
          <DatabaseOutlined />
          <span>{t('watcher.redis.title')}</span>
        </Space>
      )}
      extra={(
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          placeholder={t('watcher.redis.datePlaceholder')}
          style={{ width: 150 }}
        />
      )}
    >
      <Table<RedisRecord>
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
          showTotal: (total) => t('watcher.redis.totalRecords', { total }),
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        rowKey="id"
      />
    </Card>
  );
}