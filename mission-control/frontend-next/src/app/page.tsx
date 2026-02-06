'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { TaskCard } from '@/components/kanban/TaskCard';
import { AgentPanel } from '@/components/kanban/AgentPanel';
import { IntelligenceFeed } from '@/components/kanban/IntelligenceFeed';
import { TaskModal } from '@/components/kanban/TaskModal';
import { PixelCat, FollowingPixelCat } from '@/components/PixelCat';
import { Button } from '@/components/ui/button';
import { Plus, Terminal, Activity, Clock, Zap, Shield, Radio } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Task, Agent, Intelligence } from '@/types';

export default function MissionControl() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [intelligence, setIntelligence] = useState<Intelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });
    
    const { data: agentsData } = await supabase
      .from('agents')
      .select('*')
      .order('name');
    
    const { data: intelData } = await supabase
      .from('intelligence')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setTasks(tasksData || []);
    setAgents(agentsData || []);
    setIntelligence(intelData || []);
    setLoading(false);
  };

  const setupRealtimeSubscriptions = () => {
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchData();
      })
      .subscribe();

    const agentsSubscription = supabase
      .channel('agents-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
      agentsSubscription.unsubscribe();
    };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    const columns: Task['status'][] = ['backlog', 'in_progress', 'review', 'done'];
    if (columns.includes(overId as Task['status']) && task.status !== overId) {
      const newStatus = overId as Task['status'];
      await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', activeId);
      
      setTasks(tasks.map(t => t.id === activeId ? { ...t, status: newStatus } : t));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const tasksByStatus = {
    backlog: tasks.filter(t => t.status === 'backlog'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'online').length,
    busyAgents: agents.filter(a => a.status === 'busy').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    criticalTasks: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length,
  };

  const formatTime = (date: Date) => {
    return date.toISOString().split('T')[1].split('.')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] mc-grid-bg flex items-center justify-center">
        <div className="text-center">
          <Terminal className="w-12 h-12 text-[var(--accent-cyan)] mx-auto mb-4 animate-pulse" />
          <div className="mc-heading text-[var(--accent-cyan)] text-xl">INITIALIZING MISSION CONTROL...</div>
          <div className="text-[var(--text-muted)] text-sm mt-2">Loading tactical data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col mc-grid-bg mc-scanlines">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 backdrop-blur-md flex items-center px-6">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[var(--accent-cyan)]" />
              <Terminal className="w-5 h-5 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <h1 className="mc-heading text-lg tracking-wider">MISSION CONTROL</h1>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
                <span>SYSTEM ONLINE</span>
              </div>
            </div>
          </div>

          {/* Center: Stats */}
          <div className="flex items-center gap-8">
            <div className="mc-stat">
              <div className="mc-stat-value text-[var(--accent-green)]">{stats.activeAgents}</div>
              <div className="mc-stat-label">Online</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value text-[var(--accent-amber)]">{stats.busyAgents}</div>
              <div className="mc-stat-label">Active</div>
            </div>
            <div className="mc-stat">
              <div className="mc-stat-value text-[var(--accent-cyan)]">{stats.totalTasks - stats.completedTasks}</div>
              <div className="mc-stat-label">Pending</div>
            </div>
            {stats.criticalTasks > 0 && (
              <div className="mc-stat">
                <div className="mc-stat-value text-[var(--accent-red)]">{stats.criticalTasks}</div>
                <div className="mc-stat-label">Critical</div>
              </div>
            )}
          </div>

          {/* Right: Time & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded border border-[var(--border-subtle)]">
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="mc-data text-sm text-[var(--accent-cyan)]">{formatTime(currentTime)}</span>
              <span className="text-xs text-[var(--text-muted)]">UTC</span>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mc-btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">NEW TASK</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Agent Fleet */}
        <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col">
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Radio className="w-4 h-4" />
              <span className="mc-heading text-xs uppercase tracking-wider">Agent Fleet</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <AgentPanel agents={agents} />
          </div>
        </aside>

        {/* Center: Kanban Board */}
        <main className="flex-1 flex flex-col min-w-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
              <div className="flex gap-4 h-full min-w-max">
                <KanbanColumn
                  id="backlog"
                  title="BACKLOG"
                  tasks={tasksByStatus.backlog}
                  onEditTask={handleEditTask}
                  color="var(--text-muted)"
                />
                <KanbanColumn
                  id="in_progress"
                  title="IN PROGRESS"
                  tasks={tasksByStatus.in_progress}
                  onEditTask={handleEditTask}
                  color="var(--accent-amber)"
                />
                <KanbanColumn
                  id="review"
                  title="REVIEW"
                  tasks={tasksByStatus.review}
                  onEditTask={handleEditTask}
                  color="var(--accent-cyan)"
                />
                <KanbanColumn
                  id="done"
                  title="DONE"
                  tasks={tasksByStatus.done}
                  onEditTask={handleEditTask}
                  color="var(--accent-green)"
                />
              </div>
            </div>
          </DndContext>
        </main>

        {/* Right Sidebar: Intelligence Feed */}
        <aside className="w-72 border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col">
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Activity className="w-4 h-4" />
              <span className="mc-heading text-xs uppercase tracking-wider">Intelligence Feed</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <IntelligenceFeed intelligence={intelligence} />
          </div>
        </aside>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        agents={agents}
        onTaskSaved={fetchData}
      />

      {/* Pixel Cat */}
      <PixelCat onMeow={() => console.log('Meow!')} />
      <FollowingPixelCat />
    </div>
  );
}
