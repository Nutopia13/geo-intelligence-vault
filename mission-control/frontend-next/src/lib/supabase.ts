import { createClient } from '@supabase/supabase-js'
import { Agent, Mission, Task, Intelligence, TaskAssignment, TaskWithAssignees } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amaawfhjrewqqihwuifw.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Agents
export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data || []
}

export async function updateAgentStatus(id: string, status: Agent['status']) {
  const { error } = await supabase
    .from('agents')
    .update({ status })
    .eq('id', id)
  
  if (error) throw error
}

// Missions
export async function getMissions(): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createMission(mission: Partial<Mission>) {
  const { data, error } = await supabase
    .from('missions')
    .insert(mission)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Tasks
export async function getTasks(): Promise<TaskWithAssignees[]> {
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (tasksError) throw tasksError
  
  const { data: assignments, error: assignError } = await supabase
    .from('task_assignments')
    .select('*, agent:agents(*)')
  
  if (assignError) throw assignError
  
  return (tasks || []).map(task => ({
    ...task,
    assignees: (assignments || [])
      .filter(a => a.task_id === task.id)
      .map(a => a.agent),
  }))
}

export async function createTask(task: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function assignTask(taskId: string, agentId: string) {
  const { error } = await supabase
    .from('task_assignments')
    .insert({ task_id: taskId, agent_id: agentId })
  
  if (error) throw error
}

export async function unassignTask(taskId: string, agentId: string) {
  const { error } = await supabase
    .from('task_assignments')
    .delete()
    .eq('task_id', taskId)
    .eq('agent_id', agentId)
  
  if (error) throw error
}

// Intelligence
export async function getIntelligence(limit: number = 10): Promise<Intelligence[]> {
  const { data, error } = await supabase
    .from('intelligence')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// Realtime subscriptions
export function subscribeToTasks(callback: (payload: any) => void) {
  return supabase
    .channel('tasks-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe()
}

export function subscribeToAgents(callback: (payload: any) => void) {
  return supabase
    .channel('agents-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, callback)
    .subscribe()
}

export function subscribeToIntelligence(callback: (payload: any) => void) {
  return supabase
    .channel('intelligence-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'intelligence' }, callback)
    .subscribe()
}
