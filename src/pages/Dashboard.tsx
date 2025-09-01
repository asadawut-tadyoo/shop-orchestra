import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import {
  Package,
  Layers,
  ClipboardList,
  Factory,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/StatusBadge';

const stats = [
  {
    title: 'Active Work Orders',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: ClipboardList,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Units in Production',
    value: '1,284',
    change: '+8%',
    trend: 'up',
    icon: Package,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Active Batches',
    value: '18',
    change: '-3%',
    trend: 'down',
    icon: Layers,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Station Utilization',
    value: '87%',
    change: '+5%',
    trend: 'up',
    icon: Factory,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
];

const recentActivities = [
  { id: '1', type: 'Work Order', action: 'Created', item: 'WO-2024-0145', time: '5 minutes ago', status: 'Created' },
  { id: '2', type: 'Assembly Unit', action: 'Completed', item: 'AU-2024-8912', time: '12 minutes ago', status: 'Passed' },
  { id: '3', type: 'Batch', action: 'Started', item: 'B-2024-0067', time: '1 hour ago', status: 'InProgress' },
  { id: '4', type: 'Station', action: 'Maintenance', item: 'ST-ASSY-01', time: '2 hours ago', status: 'OnHold' },
  { id: '5', type: 'Quality Check', action: 'Failed', item: 'AU-2024-8909', time: '3 hours ago', status: 'Failed' },
];

export default function DashboardPage() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Shop Floor Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of production activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-error" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Production Overview */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-lg font-semibold mb-4">Production Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Daily Target</span>
                  <span className="text-sm font-medium">850/1000 units</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Weekly Target</span>
                  <span className="text-sm font-medium">4,200/5,000 units</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Quality Pass Rate</span>
                  <span className="text-sm font-medium">96.5%</span>
                </div>
                <Progress value={96.5} className="h-2 bg-success/20" />
              </div>
            </div>
          </Card>

          {/* Station Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Station Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Assembly Line 1</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Assembly Line 2</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inspection Station</span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-xs text-warning">Maintenance</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Packaging Line</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {activity.type} {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={activity.status} />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}