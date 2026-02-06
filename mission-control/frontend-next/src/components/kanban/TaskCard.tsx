"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, AlertCircle, GripVertical, MoreHorizontal, Flag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityConfig = {
  critical: { 
    border: 'mc-priority-critical',
    badge: 'bg-[var(--accent-red-dim)] text-[var(--accent-red)] border-[var(--accent-red)]/30',
    icon: 'text-[var(--accent-red)]'
  },
  high: { 
    border: 'mc-priority-high',
    badge: 'bg-[var(--accent-amber-dim)] text-[var(--accent-amber)] border-[var(--accent-amber)]/30',
    icon: 'text-[var(--accent-amber)]'
  },
  medium: { 
    border: 'mc-priority-medium',
    badge: 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30',
    icon: 'text-[var(--accent-cyan)]'
  },
  low: { 
    border: 'mc-priority-low',
    badge: 'bg-[var(--border-subtle)] text-[var(--text-muted)] border-[var(--border-default)]',
    icon: 'text-[var(--text-muted)]'
  },
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  const priority = priorityConfig[task.priority] || priorityConfig.medium

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "mc-task-card relative overflow-hidden",
        priority.border
      )}
    >
      {/* Drag Handle - Visible on Hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
      </div>

      {/* Header: Priority Badge & Actions */}
      <div className="flex items-start justify-between mb-2 pr-6">
        <Badge 
          variant="outline" 
          className={cn(
            "text-[9px] uppercase tracking-wider font-medium",
            priority.badge
          )}
        >
          <Flag className={cn("w-3 h-3 mr-1", priority.icon)} />
          {task.priority}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3 text-[var(--text-secondary)]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-[var(--bg-secondary)] border-[var(--border-default)]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <DropdownMenuItem 
              onClick={() => onEdit(task)}
              className="text-[var(--text-primary)] hover:bg-[var(--accent-cyan-dim)] hover:text-[var(--accent-cyan)] cursor-pointer text-sm"
            >
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-[var(--accent-red)] hover:bg-[var(--accent-red-dim)] hover:text-[var(--accent-red)] cursor-pointer text-sm"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="font-medium text-[var(--text-primary)] mb-2 pr-2 text-sm leading-snug">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 text-[var(--text-muted)]">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Due Date & Assignee */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        {task.due_date ? (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]'
          )}>
            <Calendar className="w-3 h-3" />
            <span className="mc-data text-[10px]">
              {new Date(task.due_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            {isOverdue && <AlertCircle className="w-3 h-3 ml-1" />}
          </div>
        ) : (
          <div />
        )}
        
        {task.agents?.name ? (
          <Avatar className="w-6 h-6 ring-1 ring-[var(--bg-secondary)]">
            <AvatarFallback className="text-[8px] bg-[var(--bg-elevated)] text-[var(--accent-cyan)]">
              {task.agents.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] border border-dashed border-[var(--border-subtle)] flex items-center justify-center">
            <span className="text-[8px] text-[var(--text-muted)]">?</span>
          </div>
        )}
      </div>

      {/* Hover Glow Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan-dim)] to-transparent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
