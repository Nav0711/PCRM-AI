import { PublicLayout } from '@/layouts/PublicLayout';
import { InfiniteGridHero } from '@/components/ui/infinite-grid-hero';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { WARDS, CATEGORIES } from '@/data/mock';
import { CheckCircle2, Clock, AlertCircle, Users, MapPin, Calendar, Filter, BadgeCheck, FileText, ArrowRight, Shield, Eye, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComplaintForm } from "@/components/ComplaintForm";
import { apiClient } from "@/services/apiClient";
import { Task, TaskStatus } from "@/types";

const Index = () => {
  const [wardFilter, setWardFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPublicComplaints();
        console.log('[Landing] Public complaints response:', response);
        if (response.data) {
          const complaintsArray = Array.isArray(response.data) ? response.data : [];
          const mappedTasks = complaintsArray.map((c: any) => ({
            id: c.id,
            title: c.ticket_id || c.id?.slice(0, 8),
            description: c.ai_overview || c.summary || c.raw_text,
            ward: c.ward_id || 'Unknown',
            location: c.ward_id || 'Unknown',
            category: c.category || 'General',
            priority: c.priority <= 2 ? 'urgent' : c.priority <= 3 ? 'high' : 'medium',
            status: (c.status || 'new').toLowerCase().replace(/_/g, '-') as TaskStatus,
            ai_overview: c.ai_overview,
            publishedToPublic: true,
            progress: c.status?.toLowerCase() === 'completed' ? 100 : c.status?.toLowerCase() === 'in-progress' ? 50 : 10,
            completedAt: c.resolved_at ? new Date(c.resolved_at).toLocaleDateString('en-IN') : undefined,
            createdAt: c.created_at
          }));
          setTasks(mappedTasks);

          const recentUpdates = mappedTasks
            .filter((t: any) => t.status === 'completed')
            .slice(0, 5)
            .map((t: any) => ({
              id: t.id,
              taskId: t.id,
              taskTitle: t.title,
              location: t.location,
              ward: t.ward,
              description: t.description,
              status: t.status,
              completedAt: t.completedAt,
              images: []
            }));
          setUpdates(recentUpdates);
        }
      } catch (error) {
        console.error("Failed to fetch public data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => ['awaiting-approval', 'new'].includes(t.status)).length;
  const total = tasks.length;

  const landingStats = [
    {
      title: 'Resolved Complaints',
      value: completed,
      icon: CheckCircle2,
      iconClassName: 'bg-emerald-500/10',
      description: 'Completed',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: Clock,
      iconClassName: 'bg-blue-500/10',
      description: 'Active',
    },
    {
      title: 'Pending Review',
      value: pending,
      icon: AlertCircle,
      iconClassName: 'bg-amber-500/10',
      description: 'Awaiting',
    },
    {
      title: 'Total Complaints',
      value: total,
      icon: Users,
      iconClassName: 'bg-primary/10',
      description: 'All Time',
    },
  ];

  const filteredTasks = tasks.filter(t => {
    if (wardFilter !== 'all' && t.ward !== wardFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <PublicLayout>
      {/* Hero section with infinite grid background */}
      <InfiniteGridHero onFileComplaint={() => setIsDialogOpen(true)} />

      {/* Dialog for Filing Complaint */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass-panel max-h-[90vh] overflow-y-auto text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Submit a Grievance</DialogTitle>
          </DialogHeader>
          <ComplaintForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Stats section - seamlessly connected to hero */}
      <section className="relative z-10 py-8 md:py-12 -mt-16 md:-mt-20 pt-24 md:pt-32 bg-gradient-to-b from-transparent to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-3 mb-5 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Public Dashboard Snapshot</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Live stats from complaint activity</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {landingStats.map(stat => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconClassName={stat.iconClassName}
                description={stat.description}
                className="h-full border border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature promises */}
      

      {/* Latest Updates */}
      <section id="updates" className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-[#138808]" />
          <h2 className="text-2xl font-bold text-foreground">Latest Resolved Updates</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-8">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading updates from database...</span>
          </div>
        ) : updates.length === 0 ? (
          <div className="bg-muted/50 rounded-2xl p-8 text-center">
            <p className="text-muted-foreground font-medium">No completed updates yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Resolved complaints will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map(update => (
              <div key={update.id} className="stat-card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{update.taskTitle}</h3>
                      <StatusBadge status={update.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{update.location}</span>
                      {update.completedAt && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{update.completedAt}</span>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground/80 line-clamp-2">{update.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0 text-[#138808] bg-[#138808]/10 px-3 py-1.5 rounded-lg">
                    <BadgeCheck className="h-4 w-4" />
                    Resolved
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Projects List */}
      <section id="projects" className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-[#FF9933]" />
          <h2 className="text-2xl font-bold text-foreground">All Complaints</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-4">Live data from Neon database via PSRM-AI backend</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Filter:</span>
            </div>
            <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
              <option value="all">All Wards</option>
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {filteredTasks.length} complaint{filteredTasks.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 text-muted-foreground py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Fetching complaints from database...</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map(task => (
              <div key={task.id} className="stat-card group">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.ward || 'Unknown'}</span>
                  <span className="bg-muted px-2 py-0.5 rounded-md font-medium">{task.category}</span>
                  {task.completedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{task.completedAt}</span>}
                </div>
                <div className="mt-4">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#FF9933] to-[#138808] transition-all duration-700" style={{ width: `${task.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{task.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground font-medium">No complaints match your filters.</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting the filters or check back later.</p>
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

export default Index;
