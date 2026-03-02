import { useState } from 'react';
import { WorkerLayout } from '@/layouts/WorkerLayout';
import { mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task } from '@/types';

const WorkerDashboard = () => {
  // In real app, filter by logged-in worker
  const workerTasks = mockTasks.filter(t => t.assignedWorker === 'w1');

  return (
    <WorkerLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">My Tasks</h1>
          <p className="text-sm text-muted-foreground">{workerTasks.length} assigned tasks</p>
        </div>

        {workerTasks.length === 0 ? (
          <div className="stat-card text-center py-12">
            <p className="text-muted-foreground">No tasks assigned</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workerTasks.map(task => (
              <Link key={task.id} to={`/worker/task/${task.id}`} className="block">
                <div className="stat-card hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{task.title}</h3>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {task.deadline}</span>
                      </div>
                      <PriorityBadge priority={task.priority} className="mt-2" />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold">{task.progress}%</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-secondary rounded-full">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
};

export default WorkerDashboard;
