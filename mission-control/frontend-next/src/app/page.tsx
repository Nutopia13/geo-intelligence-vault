'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { TaskCard } from '@/components/kanban/TaskCard';
import { AgentPanel } from '@/components/kanban/AgentPanel';
import { IntelligenceFeed } from '@/components/kanban/IntelligenceFeed';
import { TaskModal } from '@/components/kanban/TaskModal';
import { Button } from '@/components/ui/button';
import { Plus, Target, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Task, Agent, Intelligence } from '@/types';

export default function MissionControl() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [intelligence, setIntelligence] = useState<Intelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
    setupRealtimeSubscriptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });
    
    // Fetch agents
    const { data: agentsData } = await supabase
      .from('agents')
      .select('*')
      .order('name');
    
    // Fetch intelligence
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
    // Subscribe to task changes
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchData();
      })
      .subscribe();

    // Subscribe to agent changes
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

    // Find the task being dragged
    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    // Check if dropped on a column
    const columns: Task['status'][] = ['backlog', 'in_progress', 'review', 'done'];
    if (columns.includes(overId as Task['status']) && task.status !== overId) {
      const newStatus = overId as Task['status'];
      // Update task status
      await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', activeId);
      
      // Update local state
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
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-teal-400 text-xl">Loading Mission Control...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800 bg-[#0f1419]/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-400/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Mission Control</h1>
                <p className="text-xs text-gray-400">Kanban Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-400">{stats.activeAgents}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{stats.totalTasks - stats.completedTasks}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.completedTasks}</p>
                  <p className="text-xs text-gray-500">Done</p>
                </div>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-teal-500 hover:bg-teal-600 text-black font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex gap-6 h-full min-w-max">
              <KanbanColumn
                id="backlog"
                title="Backlog"
                tasks={tasksByStatus.backlog}
                onEditTask={handleEditTask}
              />
              <KanbanColumn
                id="in_progress"
                title="In Progress"
                tasks={tasksByStatus.in_progress}
                onEditTask={handleEditTask}
              />
              <KanbanColumn
                id="review"
                title="Review"
                tasks={tasksByStatus.review}
                onEditTask={handleEditTask}
              />
              <KanbanColumn
                id="done"
                title="Done"
                tasks={tasksByStatus.done}
                onEditTask={handleEditTask}
              />
            </div>
          </div>
        </DndContext>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-gray-800 bg-[#0f1419]/60 backdrop-blur-md flex flex-col">
        <AgentPanel agents={agents} />
        <IntelligenceFeed intelligence={intelligence} />
      </aside>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        agents={agents}
        onTaskSaved={fetchData}
      />
    </div>
  );
}
