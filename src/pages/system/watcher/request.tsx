import { Card, Space, Table, DatePicker, Typography, Tag } from 'antd';
import { GlobalOutlined, ClockCircleOutlined, HddOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getRequestList } from '@/api/sys/sysWatcher';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { TableProps } from 'antd';
import type { RequestRecord } from '@/domain/iSysWatcher';
const { Paragraph } = Typography;

/**
 * 请求记录查询页面
 */
export default function RequestRecordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RequestRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /**
   * 获取方法标签颜色
   */
  const getMethodColor = (method: string) => {
    const colors = {
      'GET': 'blue',
      'POST': 'green',
      'PUT': 'orange',
      'DELETE': 'red',
      'PATCH': 'purple',
      'HEAD': 'cyan',
      'OPTIONS': 'gold',
    };
    return colors[method as keyof typeof colors] || 'default';
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
        type: 'request' as const,
        date: date?.format('YYYY-MM-DD'),
      };
      
      const response = await getRequestList(params);
      
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
      console.error(t('watcher.request.loadError'), error);
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
  const columns: TableProps<RequestRecord>['columns'] = [
    {
      title: t('watcher.request.method'),
      dataIndex: 'method',
      key: 'method',
      width: 90,
      align: 'center',
      render: (method: string) => (
        <Tag color={getMethodColor(method)} style={{ fontWeight: 500, fontSize: '11px' }}>
          {method}
        </Tag>
      ),
    },
    {
      title: t('watcher.request.uri'),
      dataIndex: 'uri',
      key: 'uri',
      ellipsis: true,
      width: 300,
      render: (uri: string) => (
        <Paragraph 
          copyable
          ellipsis={{ rows: 2, expandable: false }}
          style={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            margin: 0
          }}
        >
          {uri}
        </Paragraph>
      ),
    },
    {
      title: t('watcher.request.status'),
      dataIndex: 'response_status',
      key: 'response_status',
      width: 90,
      align: 'center',
      render: (statusCode: number) => (
        <Tag color={statusCode >= 200 && statusCode < 300 ? 'success' : 
                    statusCode >= 300 && statusCode < 400 ? 'warning' : 
                    statusCode >= 400 ? 'error' : 'default'}>
          {statusCode}
        </Tag>
      ),
    },
    {
      title: t('watcher.request.ip'),
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 120,
      render: (ip: string) => (
        <Space>
          <GlobalOutlined style={{ color: '#1677ff' }} />
          <span>{ip}</span>
        </Space>
      ),
    },
    {
      title: t('watcher.request.userAgent'),
      dataIndex: 'headers',
      key: 'user_agent',
      ellipsis: true,
      width: 250,
      render: (headers: Record<string, string>) => {
        const userAgent = headers?.['user-agent'] || '-';
        return (
          <Paragraph 
            ellipsis={{ rows: 2, expandable: false }}
            style={{ fontSize: '12px', margin: 0 }}
          >
            {userAgent.length > 100 ? userAgent.substring(0, 100) + '...' : userAgent}
          </Paragraph>
        );
      },
    },
    {
      title: t('watcher.request.duration'),
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center',
      render: (duration: number | null) => {
        const time = duration || 0;
        const isSlow = time >= 1000;
        const isWarning = time >= 500;
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
    {
      title: t('watcher.request.memory'),
      dataIndex: 'memory',
      key: 'memory',
      width: 100,
      align: 'center',
      render: (memory: number) => (
        <span>{t('watcher.common.mb', { memory: (memory / 1024 / 1024).toFixed(1) })}</span>
      ),
    },
    {
      title: t('watcher.request.time'),
      dataIndex: 'time',
      key: 'time',
      width: 160,
      render: (time: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {dayjs(time).format('MM-DD HH:mm:ss')}
        </span>
      ),
    },
  ];

  return (
    <Card 
      title={(
        <Space>
          <HddOutlined />
          <span>{t('watcher.request.title')}</span>
        </Space>
      )}
      variant='borderless'
      extra={(
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          placeholder={t('watcher.request.datePlaceholder')}
          style={{ width: 150 }}
        />
      )}
    >
      <Table<RequestRecord>
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
          showTotal: (total) => t('watcher.request.totalRecords', { total }),
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        rowKey="id"
      />
    </Card>
  );
}