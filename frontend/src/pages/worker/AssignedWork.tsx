import { Link } from 'react-router-dom';
import { WorkerLayout } from '@/layouts/WorkerLayout';
import { mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { MapPin, Calendar, ChevronRight, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useAIChat } from '@/contexts/AIChatContext';
import { apiClient } from '@/services/apiClient';
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AssignedWork = () => {
  const { openChat } = useAIChat();
  const [workerTasks, setWorkerTasks] = useState<Task[]>([]);
  const [appealingTask, setAppealingTask] = useState<Task | null>(null);
  const [appealNotes, setAppealNotes] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiClient.getComplaints();
        const liveTasks = ((res.data as any[]) || [])
          .filter((c: any) => c.status?.toLowerCase() !== 'done')
          .map((c: any) => ({
             id: c.id,
             title: c.ticket_id,
             description: c.summary || c.raw_text,
             status: c.status?.toLowerCase() || 'new',
             progress: c.progress || 0,
             ward: c.ward_id || 'Unknown',
             location: c.location || 'Unknown',
             deadline: c.deadline || '2026-04-01',
             priority: 'medium' as const,
             assignedWorker: c.assigned_to,
             assignedWorkerName: 'You',
             category: c.category || 'Maintenance',
             createdAt: c.created_at || new Date().toISOString(),
             updatedAt: c.updated_at || new Date().toISOString(),
             images: c.images || [],
             publishedToPublic: false
        }));
        setWorkerTasks([...liveTasks, ...mockTasks.filter(t => t.assignedWorker === 'w1')]);
      } catch (err) {
        setWorkerTasks(mockTasks.filter(t => t.assignedWorker === 'w1'));
      }
    };
    fetchTasks();
  }, []);

  const launchApprovalHelper = (taskId: string) => {
    const task = workerTasks.find(t => t.id === taskId);
    if (!task) return;
    openChat(
      `Help me draft a concise completion approval note for task "${task.title}". Status: ${task.status}. Progress: ${task.progress}%. Location: ${task.location}. Deadline: ${task.deadline}. Mention any required proof and thank the approver.`
    );
  };

  const handleAppealSubmit = async () => {
    if (!appealingTask) return;
    if (!appealNotes.trim()) {
      toast.error('Please add completion notes/proof details');
      return;
    }
    try {
      if (appealingTask.id && appealingTask.id.length > 5) {
        await apiClient.updateComplaint(appealingTask.id, {
          status: 'Awaiting Approval',
          resolution_note: appealNotes
        });
      }
      setWorkerTasks(prev => prev.map(t => 
        t.id === appealingTask.id ? { ...t, status: 'awaiting-approval' } : t
      ));
      toast.success('Task appealed for approval successfully!');
      setAppealingTask(null);
      setAppealNotes('');
    } catch (e) {
      toast.error('Failed to submit appeal');
    }
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
                  <button
                    onClick={() => { setAppealingTask(task); setAppealNotes(''); }}
                    className="w-full border rounded-md px-3 py-2 text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Submit Progress / Appeal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!appealingTask} onOpenChange={(open) => !open && setAppealingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task Update / Appeal for Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Task: {appealingTask?.title}</label>
              <textarea
                value={appealNotes}
                onChange={(e) => setAppealNotes(e.target.value)}
                placeholder="Describe the work completed or updates made..."
                className="w-full mt-2 px-3 py-2 border rounded-md bg-background min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* Minimal UI for attachments, ignoring the complex generic FileUpload temporarily or could add it */}
            <p className="text-xs text-muted-foreground mt-2">
              By submitting this, the status will change to Awaiting Approval and your notes will be passed directly to the Politician for review.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={handleAppealSubmit}
              className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full flex items-center justify-center m-0"
            >
              Submit Appeal
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WorkerLayout>
  );
};

export default AssignedWork;
