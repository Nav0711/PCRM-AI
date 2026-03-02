import { useState } from 'react';
import { PoliticianLayout } from '@/layouts/PoliticianLayout';
import { mockWorkers, mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { Phone, Mail, MapPin, ClipboardList, CheckCircle2, Clock, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Worker } from '@/types';

const Workers = () => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const getWorkerStats = (worker: Worker) => {
    const total = worker.activeTasks + worker.completedTasks;
    const rate = total > 0 ? Math.round((worker.completedTasks / total) * 100) : 0;
    return { total, rate };
  };

  const getRateColor = (rate: number) => {
    if (rate >= 70) return 'hsl(152, 60%, 40%)';
    if (rate >= 40) return 'hsl(33, 90%, 55%)';
    return 'hsl(0, 72%, 51%)';
  };

  const workerTasks = selectedWorker
    ? mockTasks.filter(t => t.assignedWorker === selectedWorker.id)
    : [];

  return (
    <PoliticianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Workers</h1>
          <p className="text-sm text-muted-foreground">{mockWorkers.length} field workers</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockWorkers.map(worker => {
            const { total, rate } = getWorkerStats(worker);
            return (
              <div
                key={worker.id}
                className="stat-card cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setSelectedWorker(worker)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{worker.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{worker.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />{worker.ward}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />{worker.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />{worker.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <ClipboardList className="h-4 w-4" style={{ color: 'hsl(210, 80%, 52%)' }} />
                      <span className="font-medium">{worker.activeTasks}</span>
                      <span className="text-muted-foreground">active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="h-4 w-4" style={{ color: 'hsl(152, 60%, 40%)' }} />
                      <span className="font-medium">{worker.completedTasks}</span>
                      <span className="text-muted-foreground">done</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Avg: {worker.avgCompletionDays || '—'} days</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${getRateColor(rate)}20`, color: getRateColor(rate) }}
                    >
                      {rate}% rate
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worker Task History Modal */}
      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedWorker?.name} — Task History</DialogTitle>
          </DialogHeader>
          {workerTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No tasks found for this worker.</p>
          ) : (
            <div className="space-y-3">
              {workerTasks.map(task => (
                <div key={task.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.ward}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {task.deadline}</span>
                  </div>
                  <div className="mt-2">
                    <div className="h-1.5 bg-secondary rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${task.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{task.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PoliticianLayout>
  );
};

export default Workers;
