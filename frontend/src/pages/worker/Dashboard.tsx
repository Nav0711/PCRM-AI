import { WorkerLayout } from '@/layouts/WorkerLayout';
import { mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { MapPin, Calendar, ChevronRight, MessageCircle, CheckCircle2, Clock3, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAIChat } from '@/contexts/AIChatContext';
import { apiClient } from '@/services/apiClient';
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Worker dashboard shows assigned tasks and AI shortcuts tailored to worker workflows.

const WorkerDashboard = () => {
  const { openChat } = useAIChat();
  const [workerTasks, setWorkerTasks] = useState<Task[]>([]);
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [proposeTitle, setProposeTitle] = useState('');
  const [proposeDesc, setProposeDesc] = useState('');

  useEffect(() => {
        const fetchTasks = async () => {
      try {
        const res = await apiClient.getComplaints();
        const liveTasks = ((res.data as any[]) || [])
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

  const inProgress = workerTasks.filter(t => t.status === 'in-progress');
  const awaitingApproval = workerTasks.filter(t => t.status === 'awaiting-approval' || (t.status as string) === 'awaiting approval');
  const dueSoon = workerTasks.filter(t => t.status !== 'completed').slice(0, 3);

  const launchAI = (message: string) => {
    const context = workerTasks.slice(0, 5).map(t => `${t.title} (${t.status}, ${t.progress}%)`).join(' | ');
    openChat(`You are assisting a field worker. Current tasks: ${context || 'No tasks assigned.'}. ${message}`);
  };

  const handleProposeSubmit = async () => {
    if (!proposeTitle || !proposeDesc) {
      toast.error('Please fill in both title and description');
      return;
    }
    try {
      const newCmpt = await apiClient.createComplaint({
        citizen_phone: 'worker_0000000',
        raw_text: `${proposeTitle}\n\n${proposeDesc}`,
        category: 'Worker Proposal'
      });
      // Mark it immediately as Awaiting Approval
      await apiClient.updateComplaint((newCmpt.data as any).id, {
        status: 'Awaiting Approval'
      });
      toast.success('Proposal submitted for Politician approval!');
      setIsProposeOpen(false);
      setProposeTitle('');
      setProposeDesc('');
      // Optimistically add it to UI if needed, but the Pol side will definitely see it.
    } catch (e) {
      toast.error('Failed to submit proposal');
    }
  };

  return (
    <WorkerLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">My Tasks</h1>
            <p className="text-sm text-muted-foreground">{workerTasks.length} assigned tasks</p>
          </div>
          
          <Dialog open={isProposeOpen} onOpenChange={setIsProposeOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                + Propose Work
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Propose Task for Approval</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Proposal Title</label>
                  <input
                    type="text"
                    value={proposeTitle}
                    onChange={(e) => setProposeTitle(e.target.value)}
                    placeholder="e.g. Repair damaged street light in Ward 10"
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Details / Justification</label>
                  <textarea
                    value={proposeDesc}
                    onChange={(e) => setProposeDesc(e.target.value)}
                    placeholder="Describe why this needs attention..."
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={handleProposeSubmit}
                  className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full flex items-center justify-center m-0"
                >
                  Submit Proposal
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* AI helpers */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => launchAI('Give me a short plan for today prioritized by deadlines. Focus on due dates and high priority tasks.')}
            className="stat-card flex items-start gap-3 text-left hover:border-primary/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Clock3 className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold">AI Day Plan</p>
              <p className="text-sm text-muted-foreground">Generate a quick plan ordered by urgency.</p>
            </div>
          </button>
          <button
            onClick={() => launchAI('Draft an update to request completion approval. Mention proof files and remaining blockers if any.')}
            className="stat-card flex items-start gap-3 text-left hover:border-primary/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold">Request Approval</p>
              <p className="text-sm text-muted-foreground">AI drafts a clean approval note.</p>
            </div>
          </button>
        </div>

        {/* Assigned work */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold">Assigned work</h2>
              <p className="text-xs text-muted-foreground">What you need to work on</p>
            </div>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{workerTasks.length} tasks</span>
          </div>

          {workerTasks.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6">No tasks assigned</div>
          ) : (
            <div className="space-y-3">
              {workerTasks.map(task => (
                <Link key={task.id} to={`/worker/task/${task.id}`} className="block">
                  <div className="border rounded-lg p-3 hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{task.title}</h3>
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

        {/* Approvals and in-progress highlights */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Awaiting approval</p>
                <p className="text-xs text-muted-foreground">Submitted for review</p>
              </div>
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{awaitingApproval.length}</span>
            </div>
            {awaitingApproval.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing pending approval</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {awaitingApproval.map(t => (
                  <li key={t.id} className="flex items-center justify-between">
                    <span className="truncate">{t.title}</span>
                    <Link to={`/worker/task/${t.id}`} className="text-primary text-xs hover:underline">View</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">In progress</p>
                <p className="text-xs text-muted-foreground">Actively working</p>
              </div>
              <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">{inProgress.length}</span>
            </div>
            {inProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active tasks</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {inProgress.map(t => (
                  <li key={t.id} className="flex items-center justify-between">
                    <span className="truncate">{t.title}</span>
                    <Link to={`/worker/task/${t.id}`} className="text-primary text-xs hover:underline">Update</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
};

export default WorkerDashboard;
