export interface Agent {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'busy'
  avatar_url?: string
  created_at: string
}

export interface Mission {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  start_date: string
  end_date?: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'backlog' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  mission_id?: string
  due_date?: string
  tags: string[]
  created_at: string
  updated_at: string
  agents?: { name: string }
}

export interface TaskAssignment {
  id: string
  task_id: string
  agent_id: string
  assigned_at: string
}

export interface Intelligence {
  id: string
  title: string
  content: string
  source: string
  confidence_score: number
  category: string
  created_at: string
}

export interface TaskWithAssignees extends Task {
  assignees: Agent[]
}
