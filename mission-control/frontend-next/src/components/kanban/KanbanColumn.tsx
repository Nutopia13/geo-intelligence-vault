"use client"

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { TaskCard } from './TaskCard'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask?: (id: string) => void
  color?: string
}

const columnGradients: Record<string, string> = {
  backlog: 'from-[var(--text-muted)] to-transparent',
  in_progress: 'from-[var(--accent-amber)] to-transparent',
  review: 'from-[var(--accent-cyan)] to-transparent',
  done: 'from-[var(--accent-green)] to-transparent',
}

export function KanbanColumn({ id, title, tasks, onEditTask, onDeleteTask = () => {}, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const gradientClass = columnGradients[id] || 'from-[var(--accent-cyan)] to-transparent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col h-full w-80 rounded-lg overflow-hidden",
        "bg-[var(--bg-secondary)] border border-[var(--border-subtle)]",
        "transition-all duration-200",
        isOver && "border-[var(--accent-cyan)] mc-glow-cyan"
      )}
    >
      {/* Column Header with Gradient Top Border */}
      <div className={cn(
        "mc-column-header relative overflow-hidden",
      )}>
        {/* Gradient Line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
          gradientClass
        )} />
        
        <div className="flex items-center gap-3">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color || 'var(--accent-cyan)' }}
          />
          <h3 className="mc-heading text-xs tracking-[0.15em]">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="mc-data text-lg" style={{ color: color || 'var(--accent-cyan)' }}>
            {tasks.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 space-y-3 overflow-y-auto min-h-[400px] transition-colors",
          isOver && "bg-[var(--accent-cyan-dim)]"
        )}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </motion.div>
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 border border-dashed border-[var(--border-subtle)] rounded-md text-[var(--text-muted)]">
            <span className="mc-data text-2xl mb-1 opacity-30">+</span>
            <span className="text-xs uppercase tracking-wider opacity-50">Drop tasks here</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
