import { Link } from 'react-router-dom';
import { WorkerLayout } from '@/layouts/WorkerLayout';
import { mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { MapPin, Calendar, ChevronRight, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';

const AssignedWork = () => {
  const { openChat } = useAIChat();
  const workerTasks = mockTasks.filter(t => t.assignedWorker === 'w1');

  const launchApprovalHelper = (taskId: string) => {
    const task = workerTasks.find(t => t.id === taskId);
    if (!task) return;
    openChat(
      `Help me draft a concise completion approval note for task "${task.title}". Status: ${task.status}. Progress: ${task.progress}%. Location: ${task.location}. Deadline: ${task.deadline}. Mention any required proof and thank the approver.`
    );
  };

  return (
    <WorkerLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Assigned work</h1>
            <p className="text-sm text-muted-foreground">Tasks currently assigned to you</p>
          </div>
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{workerTasks.length} tasks</span>
        </div>

        {workerTasks.length === 0 ? (
          <div className="stat-card text-center py-12">
            <p className="text-muted-foreground">No tasks assigned</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workerTasks.map(task => (
              <div key={task.id} className="stat-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {task.deadline}</span>
                    </div>
                    <PriorityBadge priority={task.priority} className="mt-2" />
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-lg font-bold">{task.progress}%</p>
                    <Link to={`/worker/task/${task.id}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                      View details <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => launchApprovalHelper(task.id)}
                    className="w-full border rounded-md px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    AI: Draft completion note
                  </button>
                  <Link
                    to={`/worker/task/${task.id}`}
                    className="w-full border rounded-md px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary transition-colors"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Add progress / proof
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
};

export default AssignedWork;
