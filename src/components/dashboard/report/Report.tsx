import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/_card';
import { Button } from '../../ui/_button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import { Badge } from '../../ui/_badge';
import { Progress } from '../../ui/_progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/_dialog';
// import { AddProjectModal } from './add-project-modal';
// import { AddBoardModal } from './add-board-modal';
// import { UserAddModal } from './user-add-modal';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  Activity,
  Calendar,
  ArrowUpRight,
  Plus,
  FileText,
  Target,
  Zap,
  BarChart3,
  TrendingUpIcon,
  PieChartIcon,
  FileBarChart,
} from 'lucide-react';
import { toast } from 'sonner';

function Report() {
  const [timeRange, setTimeRange] = useState('week');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Mock available users data
  const availableUsers = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      role: 'Project Manager',
      status: 'online' as const,
    },
    {
      id: '2',
      name: 'Michael Ross',
      email: 'michael.ross@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      role: 'Lead Developer',
      status: 'online' as const,
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      role: 'UI/UX Designer',
      status: 'away' as const,
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      role: 'Backend Developer',
      status: 'online' as const,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
      role: 'QA Engineer',
      status: 'offline' as const,
    },
  ];

  const handleAddProject = (projectData: any) => {
    console.log('New project created:', projectData);
    toast.success('Project created successfully!');
    setIsProjectModalOpen(false);
  };

  const handleAddBoard = (boardData: any) => {
    console.log('New board created:', boardData);
    toast.success('Board created successfully!');
    setIsBoardModalOpen(false);
  };

  const handleAddUsers = (users: any[]) => {
    console.log('Users invited:', users);
    toast.success(`${users.length} user(s) invited successfully!`);
    setIsInviteModalOpen(false);
  };

  // Stats data
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Tasks',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Team Members',
      value: '48',
      change: '+4',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Completion Rate',
      value: '87%',
      change: '-3%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Project status data for pie chart
  const projectStatusData = [
    { name: 'Active', value: 14, color: '#3b82f6' },
    { name: 'On Hold', value: 5, color: '#f59e0b' },
    { name: 'Completed', value: 3, color: '#10b981' },
    { name: 'Blocked', value: 2, color: '#ef4444' },
  ];

  // Task completion trend data
  const taskTrendData = [
    { name: 'Mon', completed: 12, created: 8 },
    { name: 'Tue', completed: 19, created: 15 },
    { name: 'Wed', completed: 15, created: 12 },
    { name: 'Thu', completed: 22, created: 18 },
    { name: 'Fri', completed: 18, created: 14 },
    { name: 'Sat', completed: 8, created: 5 },
    { name: 'Sun', completed: 5, created: 3 },
  ];

  // Team performance data
  const teamPerformanceData = [
    { name: 'Design', tasks: 45, completed: 38 },
    { name: 'Development', tasks: 68, completed: 52 },
    { name: 'QA', tasks: 32, completed: 28 },
    { name: 'Marketing', tasks: 25, completed: 23 },
    { name: 'Management', tasks: 18, completed: 16 },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      action: 'completed task',
      target: 'Homepage Redesign',
      time: '5 minutes ago',
      type: 'completed',
    },
    {
      id: 2,
      user: { name: 'Michael Ross', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      action: 'created project',
      target: 'Mobile App Launch',
      time: '23 minutes ago',
      type: 'created',
    },
    {
      id: 3,
      user: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      action: 'commented on',
      target: 'API Integration',
      time: '1 hour ago',
      type: 'comment',
    },
    {
      id: 4,
      user: { name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      action: 'assigned you to',
      target: 'Database Migration',
      time: '2 hours ago',
      type: 'assigned',
    },
    {
      id: 5,
      user: { name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100' },
      action: 'updated deadline for',
      target: 'Q4 Planning',
      time: '3 hours ago',
      type: 'updated',
    },
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Website Redesign',
      dueDate: 'Nov 5, 2025',
      daysLeft: 2,
      priority: 'high',
      progress: 78,
      assignee: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    },
    {
      id: 2,
      title: 'Mobile App Beta',
      dueDate: 'Nov 8, 2025',
      daysLeft: 5,
      priority: 'high',
      progress: 62,
      assignee: { name: 'Michael Ross', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      dueDate: 'Nov 12, 2025',
      daysLeft: 9,
      priority: 'medium',
      progress: 45,
      assignee: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    },
    {
      id: 4,
      title: 'API Documentation',
      dueDate: 'Nov 15, 2025',
      daysLeft: 12,
      priority: 'low',
      progress: 30,
      assignee: { name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'created':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'comment':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'assigned':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'updated':
        return <Activity className="h-4 w-4 text-slate-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 7 days
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h2>{stat.value}</h2>
                    <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </div>
                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Task Trend Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Completion Trend</CardTitle>
                <CardDescription>Daily task activity for the past week</CardDescription>
              </div>
              <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Completed"
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Created"
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Pie Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Overview of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {projectStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Task completion by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-1.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-slate-900">
                          <span>{activity.user.name}</span>{' '}
                          <span className="text-slate-600">{activity.action}</span>{' '}
                          <span>{activity.target}</span>
                        </p>
                        <p className="text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tasks and projects due soon</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="space-y-3 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p>{deadline.title}</p>
                        <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                          {deadline.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{deadline.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{deadline.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={deadline.assignee.avatar} alt={deadline.assignee.name} />
                      <AvatarFallback>{deadline.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Progress</span>
                      <span>{deadline.progress}%</span>
                    </div>
                    <Progress value={deadline.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <div className="rounded-lg bg-blue-100 p-3">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p>Create Project</p>
                <p className="text-slate-500">Start a new project</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => setIsBoardModalOpen(true)}
            >
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <p>Add Task</p>
                <p className="text-slate-500">Create a new task</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <div className="rounded-lg bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-center">
                <p>Invite Team</p>
                <p className="text-slate-500">Add team members</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => setIsReportsModalOpen(true)}
            >
              <div className="rounded-lg bg-orange-100 p-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-center">
                <p>View Reports</p>
                <p className="text-slate-500">Analyze performance</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}

      {/* Reports Modal */}
      <Dialog open={isReportsModalOpen} onOpenChange={setIsReportsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Reports & Analytics</DialogTitle>
            <DialogDescription>
              Detailed insights and performance metrics for your projects
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-600">Total Productivity</p>
                      <h3>92%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <TrendingUpIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-slate-600">Growth Rate</p>
                      <h3>+24%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-slate-600">Goals Achieved</p>
                      <h3>18/20</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Project Completion Rate</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Task Efficiency</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Team Collaboration</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Resource Utilization</span>
                    <span>82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p>Development team exceeded targets by 15% this month</p>
                  </div>
                </div>
                
                <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <Activity className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p>Peak productivity hours: 10 AM - 2 PM</p>
                  </div>
                </div>
                
                <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p>3 projects require attention due to approaching deadlines</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast.success('Report exported as PDF');
                  setIsReportsModalOpen(false);
                }}
              >
                <FileBarChart className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast.success('Report exported as CSV');
                  setIsReportsModalOpen(false);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Report;