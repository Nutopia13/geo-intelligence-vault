"use client"

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { TaskCard } from './TaskCard'
import { TaskWithAssignees } from '@/types'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  tasks: TaskWithAssignees[]
  onEditTask: (task: TaskWithAssignees) => void
  onDeleteTask: (id: string) => void
}

const columnColors: Record<string, string> = {
  backlog: 'border-t-blue-500/50',
  in_progress: 'border-t-yellow-500/50',
  review: 'border-t-orange-500/50',
  done: 'border-t-[#00d4aa]/50',
}

const columnIcons: Record<string, string> = {
  backlog: '◆',
  in_progress: '◈',
  review: '◇',
  done: '✓',
}

export function KanbanColumn({ id, title, tasks, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col h-full min-h-[500px] rounded-xl border border-[#00d4aa]/10 bg-[#0a0e12]/50 backdrop-blur-sm",
        "border-t-4",
        columnColors[id] || 'border-t-[#00d4aa]/50'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00d4aa]/10">
        <div className="flex items-center gap-2">
          <span className="text-[#00d4aa]/60 text-sm">{columnIcons[id] || '◆'}</span>
          <h3 className="font-semibold text-[#e0e0e0] uppercase tracking-wider text-sm font-[family-name:var(--font-space-grotesk)]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#e0e0e0]/40 font-mono">
            {tasks.length}
          </span>
          <div className={cn(
            "w-2 h-2 rounded-full",
            tasks.length > 0 ? 'bg-[#00d4aa]/60' : 'bg-[#00d4aa]/20'
          )} />
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 space-y-3 overflow-y-auto min-h-[400px] transition-colors",
          isOver && "bg-[#00d4aa]/5 rounded-b-xl"
        )}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-[#e0e0e0]/20 border-2 border-dashed border-[#00d4aa]/10 rounded-lg">
            <span className="text-2xl mb-2">+</span>
            <span className="text-xs uppercase tracking-wider">Drop here</span>
          </div>
        )}
      </div>

      {/* Glow Effect on Drag Over */}
      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-xl bg-[#00d4aa]/5 pointer-events-none"
        />
      )}
    </motion.div>
  )
}
