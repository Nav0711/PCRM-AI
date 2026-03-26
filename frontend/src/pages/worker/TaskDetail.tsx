import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkerLayout } from '@/layouts/WorkerLayout';
import { mockTasks } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { FileUpload } from '@/components/FileUpload';
import { Slider } from '@/components/ui/slider';
import { MapPin, Calendar, ArrowLeft, Play, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Task, ActivityLogEntry, FileAttachment } from '@/types';
import { useAIChat } from '@/contexts/AIChatContext';
import { apiClient } from '@/services/apiClient';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { openChat } = useAIChat();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (taskId && taskId.length > 5) {
          const res = await apiClient.getComplaintDetail(taskId);
          if (res.data) {
             const c = res.data as any;
             const loadedTask = {
               id: c.id,
               title: c.ticket_id,
               description: c.summary || c.raw_text,
               status: c.status?.toLowerCase() || 'new',
               progress: c.progress || 0,
               ward: c.ward_id || 'Unknown',
               location: c.location || 'Unknown',
               deadline: c.deadline || '2026-04-01',
               priority: 'medium' as const,
               activityLog: c.activity_log || [],
               assignedWorker: c.assigned_to,
               assignedWorkerName: 'You',
               category: c.category || 'Maintenance',
               createdAt: c.created_at || new Date().toISOString(),
               updatedAt: c.updated_at || new Date().toISOString(),
               images: c.images || [],
               publishedToPublic: false
             };
             setTask(loadedTask);
             setProgress(loadedTask.progress || 0);
             setActivityLog(loadedTask.activityLog);
          }
        } else {
          const taskData = mockTasks.find(t => t.id === taskId);
          if (taskData) {
            setTask({ ...taskData });
            setProgress(taskData.progress || 0);
            setActivityLog(taskData.activityLog || []);
          }
        }
      } catch (e) {
         console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  if (loading) {
    return (
      <WorkerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground animate-pulse">Loading task details...</p>
        </div>
      </WorkerLayout>
    );
  }

  if (!task) {
    return (
      <WorkerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Task not found</p>
          <button onClick={() => navigate('/worker/dashboard')} className="text-primary text-sm mt-2 underline">Go back</button>
        </div>
      </WorkerLayout>
    );
  }

  const handleStartWork = () => {
    setTask({ ...task, status: 'in-progress' });
    setProgress(10);
    const entry: ActivityLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      note: 'Work started',
      progress: 10,
    };
    setActivityLog(prev => [...prev, entry]);
    toast.success('Work started!');
  };

  const handleAddUpdate = () => {
    if (!notes.trim()) {
      toast.error('Please add a note before saving');
      return;
    }
    const entry: ActivityLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      note: notes,
      progress,
    };
    setActivityLog(prev => [...prev, entry]);
    setTask({ ...task, progress });
    setNotes('');
    toast.success(`Update added at ${progress}%`);
  };

  const handleComplete = async () => {
    if (!notes.trim()) {
      toast.error('Please add completion notes');
      return;
    }
    try {
      if (task.id && task.id.length > 5) {
        await apiClient.updateComplaint(task.id, {
          status: 'Awaiting Approval'
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit approval appeal');
      return;
    }
    const entry: ActivityLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      note: notes,
      progress: 100,
    };
    setActivityLog(prev => [...prev, entry]);
    setTask({ ...task, status: 'awaiting-approval', progress: 100 });
    setProgress(100);
    setNotes('');
    toast.success('Task appealed for approval. Awaiting politician review.');
  };

  const canStart = task.status === 'new' || task.status === 'rejected';
  const canUpdate = task.status === 'in-progress';
  const isFinalized = task.status === 'awaiting-approval' || task.status === 'completed';

  const launchAIWithContext = (prompt: string) => {
    openChat(
      `You are assisting a worker on a field task. Task: ${task.title}. Status: ${task.status}. Progress: ${task.progress}%. Location: ${task.location}. Ward: ${task.ward}. Deadline: ${task.deadline}. Prompt: ${prompt}`
    );
  };

  return (
    <WorkerLayout>
      <div className="space-y-4">
        <button onClick={() => navigate('/worker/dashboard')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </button>

        <div className="stat-card">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{task.title}</h1>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{task.location} · {task.ward}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Due: {task.deadline}</span>
          </div>
          <PriorityBadge priority={task.priority} className="mt-2" />
          <p className="mt-4 text-sm">{task.description}</p>

          {/* Progress with Slider */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-lg">{canUpdate ? progress : task.progress}%</span>
            </div>
            {canUpdate ? (
              <Slider
                value={[progress]}
                onValueChange={v => setProgress(v[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            ) : (
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* Politician feedback for rejected tasks */}
        {task.politicianFeedback && (
          <div className="stat-card border-destructive/30 bg-destructive/5">
            <p className="text-xs font-medium text-destructive mb-1">Feedback from Politician:</p>
            <p className="text-sm">{task.politicianFeedback}</p>
          </div>
        )}

        {/* Start Work */}
        {canStart && (
          <button onClick={handleStartWork} className="w-full stat-card flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            <Play className="h-4 w-4" />
            {task.status === 'rejected' ? 'Restart Work' : 'Start Work'}
          </button>
        )}

        {/* Update Progress */}
        {canUpdate && (
          <div className="stat-card space-y-4">
            <h3 className="font-semibold">Update Progress</h3>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notes</label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe what you've done..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Upload Proof</label>
              <FileUpload files={files} onChange={setFiles} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddUpdate} className="flex-1 border bg-card py-2.5 rounded-md font-medium text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Add Update
              </button>
              <button onClick={handleComplete} className="flex-1 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-primary-foreground" style={{ backgroundColor: 'hsl(152, 60%, 40%)' }}>
                <CheckCircle2 className="h-4 w-4" />
                Appeal for approval
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => launchAIWithContext('Draft a concise progress update I can paste including work done, blockers, and next steps.')}
                className="text-xs px-3 py-2 rounded-md border hover:bg-secondary"
              >
                AI: Draft update
              </button>
              <button
                onClick={() => launchAIWithContext('Suggest proof/evidence items I should upload for this task.')}
                className="text-xs px-3 py-2 rounded-md border hover:bg-secondary"
              >
                AI: Proof suggestions
              </button>
            </div>
          </div>
        )}

        {isFinalized && (
          <div className="stat-card text-center py-6">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-2" style={{ color: 'hsl(152, 60%, 40%)' }} />
            <p className="font-medium">
              {task.status === 'awaiting-approval' ? 'Submitted for approval' : 'Task completed'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {task.status === 'awaiting-approval' ? 'Waiting for politician review' : 'This task has been approved'}
            </p>
          </div>
        )}

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <div className="stat-card">
            <h3 className="font-semibold mb-4">Activity Log</h3>
            <div className="space-y-3">
              {activityLog.map((entry, i) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {i < activityLog.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                      <span className="font-medium text-foreground">{entry.progress}%</span>
                    </div>
                    <p className="text-sm mt-0.5">{entry.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Helper quick actions */}
        <div className="stat-card space-y-3">
          <h3 className="font-semibold">AI assistant</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => launchAIWithContext('Give me the next 3 steps to move this task forward today.')}
              className="text-xs px-3 py-2 rounded-md border hover:bg-secondary"
            >
              Next steps
            </button>
            <button
              onClick={() => launchAIWithContext('Draft a message to the supervisor requesting approval for completion.')}
              className="text-xs px-3 py-2 rounded-md border hover:bg-secondary"
            >
              Approval request
            </button>
            <button
              onClick={() => launchAIWithContext('Summarize current status into 3 bullet points for a standup update.')}
              className="text-xs px-3 py-2 rounded-md border hover:bg-secondary"
            >
              Standup summary
            </button>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
};

export default TaskDetail;
