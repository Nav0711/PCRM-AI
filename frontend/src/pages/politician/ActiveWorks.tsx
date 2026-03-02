import { useState } from 'react';
import { PoliticianLayout } from '@/layouts/PoliticianLayout';
import { mockTasks, WARDS } from '@/data/mock';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Search, MapPin, Calendar, User, X } from 'lucide-react';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { useAIChat } from '@/contexts/AIChatContext';

const ActiveWorks = () => {
  const { openChat } = useAIChat();
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const hasFilters = search || wardFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setWardFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const filtered = mockTasks.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.assignedWorkerName.toLowerCase().includes(q)) return false;
    }
    if (wardFilter !== 'all' && t.ward !== wardFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <PoliticianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Active Works</h1>
          <p className="text-sm text-muted-foreground">All tasks across the constituency</p>
        </div>

        <AIInsightsCard page="active-works" title="Overdue or stalled task alerts" onAskFollowUp={openChat} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search by title or worker name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={wardFilter} onChange={e => setWardFilter(e.target.value)}>
            <option value="all">All Wards</option>
            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="awaiting-approval">Awaiting Approval</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-2 transition-colors">
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filtered.map(task => (
            <div key={task.id} className="stat-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{task.title}</h3>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.assignedWorkerName}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.ward}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {task.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{task.progress}%</p>
                    <div className="w-20 h-1.5 bg-secondary rounded-full mt-1">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No tasks found.</p>
          )}
        </div>
      </div>
    </PoliticianLayout>
  );
};

export default ActiveWorks;
