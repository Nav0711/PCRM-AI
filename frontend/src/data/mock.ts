import { Task, Worker, Update } from '@/types';

export const WARDS = ['Ward 1 - Central', 'Ward 2 - North', 'Ward 3 - South', 'Ward 4 - East', 'Ward 5 - West'];
export const CATEGORIES = ['Road Repair', 'Water Supply', 'Sanitation', 'Street Lighting', 'Park Development', 'Drainage', 'Public Health', 'Education'];

export const POLITICIAN = {
  name: 'Shri Rajesh Kumar',
  constituency: 'Vidhya Nagar Constituency',
  logo: '',
};

export const mockWorkers: Worker[] = [
  { id: 'w1', name: 'Amit Sharma', email: 'amit@example.com', phone: '9876543210', ward: 'Ward 1 - Central', activeTasks: 3, completedTasks: 12, avgCompletionDays: 8 },
  { id: 'w2', name: 'Priya Patel', email: 'priya@example.com', phone: '9876543211', ward: 'Ward 2 - North', activeTasks: 2, completedTasks: 18, avgCompletionDays: 5 },
  { id: 'w3', name: 'Suresh Reddy', email: 'suresh@example.com', phone: '9876543212', ward: 'Ward 3 - South', activeTasks: 4, completedTasks: 9, avgCompletionDays: 12 },
  { id: 'w4', name: 'Lakshmi Devi', email: 'lakshmi@example.com', phone: '9876543213', ward: 'Ward 4 - East', activeTasks: 1, completedTasks: 22, avgCompletionDays: 6 },
  { id: 'w5', name: 'Rajiv Singh', email: 'rajiv@example.com', phone: '9876543214', ward: 'Ward 5 - West', activeTasks: 2, completedTasks: 15, avgCompletionDays: 9 },
];

export const mockTasks: Task[] = [
  {
    id: 't1', title: 'Main Road Resurfacing', description: 'Complete resurfacing of the main road from central market to bus stand. Includes filling potholes and applying new asphalt layer.',
    location: 'Central Market Road', ward: 'Ward 1 - Central', category: 'Road Repair', priority: 'high', status: 'completed',
    deadline: '2026-02-20', assignedWorker: 'w1', assignedWorkerName: 'Amit Sharma', progress: 100,
    createdAt: '2026-01-15', updatedAt: '2026-02-18', completedAt: '2026-02-18',
    images: [], workerNotes: 'Road resurfacing completed. New drainage covers also installed.',
    proofImages: [], publishedToPublic: true,
    activityLog: [
      { id: 'a1', timestamp: '2026-01-16 09:00', note: 'Started road assessment', progress: 10 },
      { id: 'a2', timestamp: '2026-01-25 14:00', note: 'Pothole filling in progress', progress: 40 },
      { id: 'a3', timestamp: '2026-02-10 11:00', note: 'Asphalt layer applied', progress: 80 },
      { id: 'a4', timestamp: '2026-02-18 16:00', note: 'Work completed, drainage covers installed', progress: 100 },
    ],
  },
  {
    id: 't2', title: 'Water Pipeline Extension', description: 'Extend water pipeline to serve 200 additional households in the northern sector.',
    location: 'North Colony, Sector 7', ward: 'Ward 2 - North', category: 'Water Supply', priority: 'urgent', status: 'in-progress',
    deadline: '2026-03-15', assignedWorker: 'w2', assignedWorkerName: 'Priya Patel', progress: 65,
    createdAt: '2026-01-20', updatedAt: '2026-02-24',
    images: [], publishedToPublic: true,
    activityLog: [
      { id: 'a5', timestamp: '2026-01-22 10:00', note: 'Survey completed, pipeline route finalized', progress: 15 },
      { id: 'a6', timestamp: '2026-02-05 13:00', note: 'Trenching work 50% done', progress: 40 },
      { id: 'a7', timestamp: '2026-02-24 09:00', note: 'Pipeline laying in progress, 65% complete', progress: 65 },
    ],
  },
  {
    id: 't3', title: 'Community Park Development', description: 'Develop a new community park with playground equipment, walking paths, and seating areas.',
    location: 'Green Valley Area', ward: 'Ward 3 - South', category: 'Park Development', priority: 'medium', status: 'awaiting-approval',
    deadline: '2026-03-30', assignedWorker: 'w3', assignedWorkerName: 'Suresh Reddy', progress: 100,
    createdAt: '2026-01-10', updatedAt: '2026-02-22', completedAt: '2026-02-22',
    images: [], workerNotes: 'Park construction complete. Playground equipment installed and pathways paved.',
    proofImages: [], publishedToPublic: false,
    activityLog: [
      { id: 'a8', timestamp: '2026-01-12 08:00', note: 'Ground clearing started', progress: 10 },
      { id: 'a9', timestamp: '2026-02-22 17:00', note: 'All work completed, ready for review', progress: 100 },
    ],
  },
  {
    id: 't4', title: 'Street Light Installation', description: 'Install 50 new LED street lights along the eastern highway stretch.',
    location: 'Eastern Highway', ward: 'Ward 4 - East', category: 'Street Lighting', priority: 'high', status: 'in-progress',
    deadline: '2026-03-10', assignedWorker: 'w4', assignedWorkerName: 'Lakshmi Devi', progress: 40,
    createdAt: '2026-02-01', updatedAt: '2026-02-25',
    images: [], publishedToPublic: false,
    activityLog: [
      { id: 'a10', timestamp: '2026-02-03 09:00', note: 'Poles received, installation starting', progress: 10 },
      { id: 'a11', timestamp: '2026-02-25 15:00', note: '20 of 50 lights installed', progress: 40 },
    ],
  },
  {
    id: 't5', title: 'Drainage System Repair', description: 'Repair and unclog the main drainage system in the western residential area to prevent flooding.',
    location: 'West Residential Block', ward: 'Ward 5 - West', category: 'Drainage', priority: 'urgent', status: 'new',
    deadline: '2026-03-05', assignedWorker: 'w5', assignedWorkerName: 'Rajiv Singh', progress: 0,
    createdAt: '2026-02-20', updatedAt: '2026-02-20',
    images: [], publishedToPublic: false,
  },
  {
    id: 't6', title: 'Public Toilet Construction', description: 'Construct two new public toilet facilities near the bus stand and market area.',
    location: 'Bus Stand Area', ward: 'Ward 1 - Central', category: 'Sanitation', priority: 'medium', status: 'completed',
    deadline: '2026-02-10', assignedWorker: 'w1', assignedWorkerName: 'Amit Sharma', progress: 100,
    createdAt: '2025-12-15', updatedAt: '2026-02-08', completedAt: '2026-02-08',
    images: [], workerNotes: 'Both facilities constructed with proper water and sewage connections.',
    proofImages: [], publishedToPublic: true,
    activityLog: [
      { id: 'a12', timestamp: '2025-12-20 10:00', note: 'Foundation work started', progress: 15 },
      { id: 'a13', timestamp: '2026-01-15 12:00', note: 'Structure complete, plumbing in progress', progress: 60 },
      { id: 'a14', timestamp: '2026-02-08 14:00', note: 'Construction completed', progress: 100 },
    ],
  },
  {
    id: 't7', title: 'School Building Renovation', description: 'Renovate the government primary school building including roof repair, painting, and furniture.',
    location: 'Government School, North', ward: 'Ward 2 - North', category: 'Education', priority: 'high', status: 'in-progress',
    deadline: '2026-04-01', assignedWorker: 'w2', assignedWorkerName: 'Priya Patel', progress: 30,
    createdAt: '2026-02-05', updatedAt: '2026-02-24',
    images: [], publishedToPublic: false,
    activityLog: [
      { id: 'a15', timestamp: '2026-02-07 08:00', note: 'Roof repair initiated', progress: 10 },
      { id: 'a16', timestamp: '2026-02-24 11:00', note: 'Roof done, painting started', progress: 30 },
    ],
  },
  {
    id: 't8', title: 'Health Camp Organization', description: 'Organize a free health camp with basic screenings, vaccinations, and medicine distribution.',
    location: 'Community Hall, South', ward: 'Ward 3 - South', category: 'Public Health', priority: 'medium', status: 'rejected',
    deadline: '2026-02-28', assignedWorker: 'w3', assignedWorkerName: 'Suresh Reddy', progress: 80,
    createdAt: '2026-02-01', updatedAt: '2026-02-23',
    images: [], workerNotes: 'Venue booked and doctors confirmed.',
    politicianFeedback: 'Need to coordinate with district health office first. Please resubmit after getting their approval.',
    publishedToPublic: false,
    activityLog: [
      { id: 'a17', timestamp: '2026-02-03 09:00', note: 'Venue booked at Community Hall', progress: 20 },
      { id: 'a18', timestamp: '2026-02-15 14:00', note: 'Doctors and medicines arranged', progress: 80 },
    ],
  },
  // Extra tasks for richer analytics
  {
    id: 't9', title: 'Footpath Construction', description: 'Build new concrete footpaths along main commercial area.',
    location: 'Commercial Street', ward: 'Ward 1 - Central', category: 'Road Repair', priority: 'medium', status: 'completed',
    deadline: '2025-12-30', assignedWorker: 'w1', assignedWorkerName: 'Amit Sharma', progress: 100,
    createdAt: '2025-11-01', updatedAt: '2025-12-28', completedAt: '2025-12-28',
    images: [], publishedToPublic: true,
  },
  {
    id: 't10', title: 'Water Tank Cleaning', description: 'Clean and disinfect community water tanks in Ward 2.',
    location: 'Sector 3 Water Tank', ward: 'Ward 2 - North', category: 'Water Supply', priority: 'low', status: 'completed',
    deadline: '2025-11-15', assignedWorker: 'w2', assignedWorkerName: 'Priya Patel', progress: 100,
    createdAt: '2025-10-20', updatedAt: '2025-11-12', completedAt: '2025-11-12',
    images: [], publishedToPublic: true,
  },
  {
    id: 't11', title: 'Garbage Collection Drive', description: 'Organize ward-wide garbage collection and segregation drive.',
    location: 'Ward 4 Residential', ward: 'Ward 4 - East', category: 'Sanitation', priority: 'high', status: 'completed',
    deadline: '2025-10-30', assignedWorker: 'w4', assignedWorkerName: 'Lakshmi Devi', progress: 100,
    createdAt: '2025-10-01', updatedAt: '2025-10-28', completedAt: '2025-10-28',
    images: [], publishedToPublic: true,
  },
  {
    id: 't12', title: 'Playground Equipment Setup', description: 'Install swings and slides at west ward park.',
    location: 'West Park', ward: 'Ward 5 - West', category: 'Park Development', priority: 'low', status: 'completed',
    deadline: '2025-09-30', assignedWorker: 'w5', assignedWorkerName: 'Rajiv Singh', progress: 100,
    createdAt: '2025-09-01', updatedAt: '2025-09-25', completedAt: '2025-09-25',
    images: [], publishedToPublic: true,
  },
];

export const mockUpdates: Update[] = mockTasks
  .filter(t => t.status === 'completed' && t.publishedToPublic)
  .map(t => ({
    id: `u-${t.id}`,
    taskId: t.id,
    taskTitle: t.title,
    location: t.location,
    ward: t.ward,
    description: t.description,
    status: t.status,
    completedAt: t.completedAt || t.updatedAt,
    images: t.images,
  }));

// Monthly completed tasks data for line chart (last 6 months)
export const monthlyCompletions = [
  { month: 'Sep 2025', completed: 1 },
  { month: 'Oct 2025', completed: 1 },
  { month: 'Nov 2025', completed: 1 },
  { month: 'Dec 2025', completed: 1 },
  { month: 'Jan 2026', completed: 0 },
  { month: 'Feb 2026', completed: 2 },
];
