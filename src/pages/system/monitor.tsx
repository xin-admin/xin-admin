import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  DashboardOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ApiOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const SystemMonitor = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkIn: 0,
    networkOut: 0,
    ioRead: 0,
    ioWrite: 0,
    processCount: 0,
    uptime: 0
  });

  // 模拟数据获取
  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: 30 + Math.random() * 70,
        diskUsage: 40 + Math.random() * 60,
        networkIn: 100 + Math.random() * 900,
        networkOut: 100 + Math.random() * 500,
        ioRead: 50 + Math.random() * 200,
        ioWrite: 30 + Math.random() * 150,
        processCount: 100 + Math.floor(Math.random() * 200),
        uptime: 3600 + Math.floor(Math.random() * 86400)
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 图表配置
  const cpuOption = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: 'CPU使用率',
      type: 'gauge',
      detail: { formatter: '{value}%' },
      data: [{ value: metrics.cpuUsage.toFixed(2), name: '使用率' }]
    }]
  };

  const memoryOption = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: '内存使用率',
      type: 'gauge',
      detail: { formatter: '{value}%' },
      data: [{ value: metrics.memoryUsage.toFixed(2), name: '使用率' }]
    }]
  };

  const diskOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '磁盘使用',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: '18', fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: [
        { value: metrics.diskUsage, name: '已使用' },
        { value: 100 - metrics.diskUsage, name: '剩余' }
      ]
    }]
  };

  const networkOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['入流量', '出流量'] },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '入流量',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '出流量',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  };

  const ioOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['读取', '写入'] },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '读取',
        type: 'bar',
        data: [metrics.ioRead, 49, 70, 232, 256, 76, 135]
      },
      {
        name: '写入',
        type: 'bar',
        data: [metrics.ioWrite, 60, 52, 200, 334, 390, 330]
      }
    ]
  };

  const processOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }]
  };

  const uptimeOption = {
    tooltip: { trigger: 'item' },
    series: [{
      name: '运行时间',
      type: 'pie',
      radius: '70%',
      data: [
        { value: metrics.uptime, name: '已运行' },
        { value: 86400 - metrics.uptime, name: '剩余' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const temperatureOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
    yAxis: { type: 'value' },
    series: [{
      data: [45, 48, 52, 55, 53, 50, 47],
      type: 'line',
      areaStyle: {}
    }]
  };

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${mins}分钟`;
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">系统监控面板</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 概览卡片 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={6}>
              <Card variant={"borderless"}>
                <Statistic
                  title="CPU使用率"
                  value={metrics.cpuUsage.toFixed(2)}
                  suffix="%"
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant={"borderless"}>
                <Statistic
                  title="内存使用率"
                  value={metrics.memoryUsage.toFixed(2)}
                  suffix="%"
                  prefix={<DatabaseOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant={"borderless"}>
                <Statistic
                  title="磁盘使用率"
                  value={metrics.diskUsage.toFixed(2)}
                  suffix="%"
                  prefix={<CloudOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant={"borderless"}>
                <Statistic
                  title="进程数"
                  value={metrics.processCount}
                  prefix={<ApiOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 详细图表 */}
          <Row gutter={[16, 16]}>
            {/* CPU使用率 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="CPU使用率" variant={"borderless"} className="h-full">
                <ReactECharts option={cpuOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* 内存使用率 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="内存使用率" variant={"borderless"} className="h-full">
                <ReactECharts option={memoryOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* 磁盘使用 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="磁盘使用" variant={"borderless"} className="h-full">
                <ReactECharts option={diskOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* 网络流量 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="网络流量" variant={"borderless"} className="h-full">
                <ReactECharts option={networkOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* IO读写 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="IO读写" variant={"borderless"} className="h-full">
                <ReactECharts option={ioOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* 进程数 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="进程数" variant={"borderless"} className="h-full">
                <ReactECharts option={processOption} style={{ height: 300 }} />
              </Card>
            </Col>

            {/* 系统运行时间 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="系统运行时间" variant={"borderless"} className="h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <ClockCircleOutlined className="text-4xl mb-4 text-blue-500" />
                  <p className="text-xl">{formatUptime(metrics.uptime)}</p>
                  <ReactECharts option={uptimeOption} style={{ height: 200, width: '100%' }} />
                </div>
              </Card>
            </Col>

            {/* 系统温度 */}
            <Col xs={24} md={12} lg={6}>
              <Card title="系统温度" variant={"borderless"} className="h-full">
                <ReactECharts option={temperatureOption} style={{ height: 300 }} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default SystemMonitor;