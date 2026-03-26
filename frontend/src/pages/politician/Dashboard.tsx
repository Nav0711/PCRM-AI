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
          const tasks = (response.data || []) as any[];
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
      <div className="space-y-4">
        <div className="bg-muted/40 rounded-lg p-3 relative overflow-hidden border border-border/40">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#138808]/8 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-xs text-muted-foreground font-medium">Intelligence Panel for Constituency Management</h2>
          </div>

          {/* Top Stats Retained for Quick Look */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 relative z-10">
            <StatCard title="Total Assigned Works" value={tasksCount.total} icon={ClipboardList} description="Lifetime tracked" iconClassName="bg-[#FF9933]/10" />
            <StatCard title="In Progress" value={tasksCount.inProgress} icon={Clock} iconClassName="bg-blue-500/10" description="Active now" />
            <StatCard title="Pending Approval" value={tasksCount.pending} icon={AlertCircle} iconClassName="bg-[#FF9933]/10" description="Awaiting action" />
            <StatCard title="Completed" value={tasksCount.completed} icon={CheckCircle2} iconClassName="bg-[#138808]/10" description="Successfully resolved" />
          </div>
        </div>

        {/* The Core AI Panel - fixed height, internal scroll */}
        <div className="mt-0 h-[60vh] lg:h-[65vh] min-h-[320px] overflow-hidden">
          <AIPanel />
        </div>
      </div>
    </PoliticianLayout>
  );
};

export default PoliticianDashboard;
