import { useState } from 'react';
import { PoliticianLayout } from '@/layouts/PoliticianLayout';
import { POLITICIAN } from '@/data/mock';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Globe, Bell } from 'lucide-react';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: POLITICIAN.name,
    constituency: POLITICIAN.constituency,
  });
  const [notifications, setNotifications] = useState({
    taskCompletion: true,
    newWorkerRegistration: false,
  });
  const [publicDashboard, setPublicDashboard] = useState({
    enabled: true,
    welcomeMessage: 'Welcome to our constituency transparency portal. Track development work in real-time.',
  });

  const inputClass = "w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <PoliticianLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* Profile */}
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Politician Name</label>
            <input className={inputClass} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Constituency Name</label>
            <input className={inputClass} value={profile.constituency} onChange={e => setProfile({ ...profile, constituency: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Upload Photo</label>
            <div className="border-2 border-dashed rounded-md p-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
              Click to upload profile photo
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Notification Preferences</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notify on task completion</p>
              <p className="text-xs text-muted-foreground">Get notified when workers complete tasks</p>
            </div>
            <Switch checked={notifications.taskCompletion} onCheckedChange={v => setNotifications({ ...notifications, taskCompletion: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notify on new worker registration</p>
              <p className="text-xs text-muted-foreground">Get notified when new workers join</p>
            </div>
            <Switch checked={notifications.newWorkerRegistration} onCheckedChange={v => setNotifications({ ...notifications, newWorkerRegistration: v })} />
          </div>
        </div>

        {/* Public Dashboard */}
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Public Dashboard</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable public dashboard</p>
              <p className="text-xs text-muted-foreground">Allow citizens to view the transparency portal</p>
            </div>
            <Switch checked={publicDashboard.enabled} onCheckedChange={v => setPublicDashboard({ ...publicDashboard, enabled: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Welcome Message</label>
            <textarea className={inputClass + ' min-h-[80px]'} value={publicDashboard.welcomeMessage} onChange={e => setPublicDashboard({ ...publicDashboard, welcomeMessage: e.target.value })} />
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
          Save Settings
        </button>
      </div>
    </PoliticianLayout>
  );
};

export default Settings;
