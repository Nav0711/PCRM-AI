import { PoliticianLayout } from '@/layouts/PoliticianLayout';
import { StatCard } from '@/components/StatCard';
import { ClipboardList, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AIPanel } from '@/components/ai/AIPanel';
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';

const PoliticianDashboard = () => {
  const [tasksCount, setTasksCount] = useState({ total: 0, inProgress: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await apiClient.getComplaints();
        if (response.data) {
          const tasks = response.data;
          setTasksCount({
            total: tasks.length,
            inProgress: tasks.filter((t: any) => t.status.toLowerCase() === 'in-progress').length,
            pending: tasks.filter((t: any) => t.status.toLowerCase() === 'awaiting-approval').length,
            completed: tasks.filter((t: any) => t.status.toLowerCase() === 'completed').length
          });
        }
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      }
    };
    
    fetchComplaints();
  }, []);

  return (
    <PoliticianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Briefing Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Your Personal Intelligence Panel for Constituency Management</p>
        </div>

        {/* Top Stats Retained for Quick Look */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assigned Works" value={tasksCount.total} icon={ClipboardList} />
          <StatCard title="In Progress" value={tasksCount.inProgress} icon={Clock} />
          <StatCard title="Pending Approval" value={tasksCount.pending} icon={AlertCircle} />
          <StatCard title="Completed" value={tasksCount.completed} icon={CheckCircle2} />
        </div>

        {/* The Core AI Panel */}
        <div className="mt-2">
          <AIPanel />
        </div>
      </div>
    </PoliticianLayout>
  );
};

export default PoliticianDashboard;
