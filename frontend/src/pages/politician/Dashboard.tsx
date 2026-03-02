import { PoliticianLayout } from '@/layouts/PoliticianLayout';
import { StatCard } from '@/components/StatCard';
import { mockTasks, WARDS } from '@/data/mock';
import { ClipboardList, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { useAIChat } from '@/contexts/AIChatContext';

const STATUS_COLORS = ['hsl(220,10%,58%)', 'hsl(210,80%,52%)', 'hsl(33,90%,55%)', 'hsl(152,60%,40%)', 'hsl(0,72%,51%)'];

const PoliticianDashboard = () => {
  const { openChat } = useAIChat();
  const totalTasks = mockTasks.length;
  const inProgress = mockTasks.filter(t => t.status === 'in-progress').length;
  const pending = mockTasks.filter(t => t.status === 'awaiting-approval').length;
  const completed = mockTasks.filter(t => t.status === 'completed').length;

  const statusData = [
    { name: 'New', value: mockTasks.filter(t => t.status === 'new').length },
    { name: 'In Progress', value: inProgress },
    { name: 'Awaiting', value: pending },
    { name: 'Completed', value: completed },
    { name: 'Rejected', value: mockTasks.filter(t => t.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const wardData = WARDS.map(w => ({
    name: w.replace('Ward ', 'W').split(' - ')[0],
    tasks: mockTasks.filter(t => t.ward === w).length,
  }));

  return (
    <PoliticianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of constituency work</p>
        </div>

        <AIInsightsCard page="dashboard" title="Priority actions for today" onAskFollowUp={openChat} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assigned" value={totalTasks} icon={ClipboardList} />
          <StatCard title="In Progress" value={inProgress} icon={Clock} />
          <StatCard title="Pending Approval" value={pending} icon={AlertCircle} />
          <StatCard title="Completed" value={completed} icon={CheckCircle2} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="stat-card">
            <h3 className="font-semibold mb-4">Works by Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="font-semibold mb-4">Works by Ward</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PoliticianLayout>
  );
};

export default PoliticianDashboard;
