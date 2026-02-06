"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Tag, Calendar, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TaskWithAssignees, Agent } from '@/types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Partial<TaskWithAssignees>) => void
  task?: TaskWithAssignees | null
  agents: Agent[]
}

const priorities = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
]

const statuses = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

export function TaskModal({ isOpen, onClose, onSubmit, task, agents }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('backlog')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
      setTags(task.tags || [])
      setSelectedAgents(task.assignees?.map(a => a.id) || [])
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('backlog')
      setDueDate('')
      setTags([])
      setTagInput('')
      setSelectedAgents([])
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: task?.id,
      title,
      description,
      priority: priority as any,
      status: status as any,
      due_date: dueDate || undefined,
      tags,
      assignees: agents.filter(a => selectedAgents.includes(a.id)),
    })
    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0f1419] border-[#00d4aa]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#00d4aa]">
            <AlertCircle className="w-5 h-5" />
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0] placeholder:text-[#e0e0e0]/30"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0] placeholder:text-[#e0e0e0]/30 min-h-[100px]"
            />
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60">
                Priority
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1419] border-[#00d4aa]/30">
                  {priorities.map((p) => (
                    <SelectItem 
                      key={p.value} 
                      value={p.value}
                      className="text-[#e0e0e0] focus:bg-[#00d4aa]/10 focus:text-[#00d4aa]"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${p.color}-500`} />
                        {p.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1419] border-[#00d4aa]/30">
                  {statuses.map((s) => (
                    <SelectItem 
                      key={s.value} 
                      value={s.value}
                      className="text-[#e0e0e0] focus:bg-[#00d4aa]/10 focus:text-[#00d4aa]"
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60 flex items-center gap-2">
              <Tag className="w-3 h-3" />
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="bg-transparent border-[#00d4aa]/30 text-[#e0e0e0] placeholder:text-[#e0e0e0]/30"
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#e0e0e0]/60">
              Assignees
            </label>
            <div className="flex flex-wrap gap-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs transition-all border",
                    selectedAgents.includes(agent.id)
                      ? "bg-[#00d4aa]/20 border-[#00d4aa] text-[#00d4aa]"
                      : "bg-transparent border-[#00d4aa]/20 text-[#e0e0e0]/60 hover:border-[#00d4aa]/50"
                  )}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#00d4aa]/10">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
