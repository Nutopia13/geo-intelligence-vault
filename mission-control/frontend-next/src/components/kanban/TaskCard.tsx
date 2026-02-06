"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, AlertCircle, GripVertical, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TaskWithAssignees } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TaskCardProps {
  task: TaskWithAssignees
  onEdit: (task: TaskWithAssignees) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const

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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-4 rounded-lg border border-[#00d4aa]/20 bg-[#0f1419]/90 backdrop-blur-sm hover:border-[#00d4aa]/50 hover:shadow-[0_0_20px_rgba(0,212,170,0.15)] transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-[#00d4aa]/50" />
      </div>

      {/* Header: Priority & Actions */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant={priorityColors[task.priority]} className="text-[10px] uppercase tracking-wider">
          {task.priority}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3 text-[#e0e0e0]/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-[#0f1419] border-[#00d4aa]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem 
              onClick={() => onEdit(task)}
              className="text-[#e0e0e0] hover:bg-[#00d4aa]/10 hover:text-[#00d4aa] cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-red-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="font-medium text-[#e0e0e0] mb-2 pr-6 font-[family-name:var(--font-space-grotesk)]">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-[#e0e0e0]/50 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, idx) => (
            <span 
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#00d4aa]/10 text-[#00d4aa]/80 border border-[#00d4aa]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due Date & Assignees */}
      <div className="flex items-center justify-between">
        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-[#e0e0e0]/40'}`}>
            <Calendar className="w-3 h-3" />
            <span className="font-mono text-[10px]">
              {new Date(task.due_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            {isOverdue && <AlertCircle className="w-3 h-3 ml-1" />}
          </div>
        )}
        
        <div className="flex -space-x-2">
          {task.assignees?.map((agent) => (
            <Avatar key={agent.id} className="w-6 h-6 ring-1 ring-[#0f1419]">
              <AvatarImage src={agent.avatar_url} />
              <AvatarFallback className="text-[8px] bg-[#1a1f2e] text-[#00d4aa]">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00d4aa]/5 to-transparent pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
