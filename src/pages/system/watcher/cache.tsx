import { Card, Space, Table, DatePicker } from 'antd';
import { HddOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getCacheList } from '@/api/sys/sysWatcher';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { TableProps } from 'antd';
import type { CacheRecord } from '@/domain/iSysWatcher';

/**
 * 缓存记录查询页面
 */
export default function CacheRecordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CacheRecord[]>([]);
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
        type: 'cache' as const,
      };
      
      const response = await getCacheList(params);
      
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
      console.error(t('watcher.cache.loadError'), error);
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

  // 组件加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 表格列配置
   */
  const columns: TableProps['columns'] = [
    {
      title: t('watcher.cache.type'),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: 'cache' | 'redis') => type === 'cache' ? t('watcher.cache.typeCache') : t('watcher.cache.typeRedis'),
    },
    {
      title: t('watcher.cache.key'),
      dataIndex: 'key',
      key: 'key',
      ellipsis: true,
      width: 400,
      render: (key: string) => (
        <div style={{ 
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {key}
        </div>
      ),
    },
    {
      title: t('watcher.cache.value'),
      dataIndex: 'value',
      key: 'value',
      ellipsis: true,
      width: 500,
      render: (value: string) => {
        if (!value) return '-';
        let strValue: string;
        if (typeof value === 'string') {
          strValue = value;
        }else if (typeof value === 'object') {
          strValue = JSON.stringify(value);
        }else {
          strValue = String(value);
        }
        return (
            <div style={{ 
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {strValue}
            </div>
          );
      },
    },
    {
      title: t('watcher.cache.expiration'),
      dataIndex: 'expiration',
      key: 'expiration',
      width: 180,
      render: (expiration: number) => {
        if (!expiration) return t('watcher.cache.neverExpire');
        return (
          <Space>
            <ClockCircleOutlined style={{ color: '#1890ff' }} />
            <span>{dayjs(expiration * 1000).format('MM-DD HH:mm:ss')}</span>
          </Space>
        );
      },
    },
  ];

  return (
    <Card 
      title={(
        <Space>
          <HddOutlined />
          <span>{t('watcher.cache.title')}</span>
        </Space>
      )}
      variant='borderless'
      extra={(
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          placeholder={t('watcher.cache.datePlaceholder')}
          style={{ width: 150 }}
        />
      )}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => t('watcher.cache.totalRecords', { total }),
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        rowKey="key"
      />
    </Card>
  );
}