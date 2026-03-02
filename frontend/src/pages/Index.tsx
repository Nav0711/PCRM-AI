import { PublicLayout } from '@/layouts/PublicLayout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockTasks, mockUpdates, WARDS, CATEGORIES } from '@/data/mock';
import { CheckCircle2, Clock, AlertCircle, Users, MapPin, Calendar, Filter, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [wardFilter, setWardFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const completed = mockTasks.filter(t => t.status === 'completed').length;
  const inProgress = mockTasks.filter(t => t.status === 'in-progress').length;
  const pending = mockTasks.filter(t => t.status === 'awaiting-approval').length;
  const total = mockTasks.length;

  // Only show published tasks on public dashboard
  const publicTasks = mockTasks.filter(t => t.publishedToPublic);
  const filteredTasks = publicTasks.filter(t => {
    if (wardFilter !== 'all' && t.ward !== wardFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <PublicLayout>
      {/* Hero stats */}
      <section className="bg-secondary/50 border-b">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Constituency at a Glance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Works Completed" value={completed} icon={CheckCircle2} />
            <StatCard title="In Progress" value={inProgress} icon={Clock} />
            <StatCard title="Pending Approval" value={pending} icon={AlertCircle} />
            <StatCard title="Total Projects" value={total} icon={Users} />
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section id="updates" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Latest Approved Updates</h2>
        {mockUpdates.length === 0 ? (
          <p className="text-muted-foreground">No updates yet.</p>
        ) : (
          <div className="space-y-4">
            {mockUpdates.map(update => (
              <div key={update.id} className="stat-card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{update.taskTitle}</h3>
                      <StatusBadge status={update.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{update.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{update.completedAt}</span>
                    </div>
                    <p className="mt-2 text-sm">{update.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium shrink-0" style={{ color: 'hsl(152, 60%, 40%)' }}>
                    <BadgeCheck className="h-4 w-4" />
                    Approved by Politician
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Projects List - only published */}
      <section id="projects" className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Published Projects</h2>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} className="rounded-md border bg-card px-2 py-1.5 text-sm">
              <option value="all">All Wards</option>
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="rounded-md border bg-card px-2 py-1.5 text-sm">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border bg-card px-2 py-1.5 text-sm">
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredTasks.map(task => (
            <div key={task.id} className="stat-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{task.title}</h3>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.ward}</span>
                <span>{task.category}</span>
                {task.completedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{task.completedAt}</span>}
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${task.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{task.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
        {filteredTasks.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No published projects match your filters.</p>
        )}
      </section>
    </PublicLayout>
  );
};

export default Index;
