"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, WifiOff, Activity, Bot, Cpu, Radio, 
  Zap, Server, Clock, TrendingUp, AlertCircle 
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AgentHealth {
  id: string
  name: string
  role: string
  model: string
  emoji: string
  status: 'online' | 'busy' | 'offline'
  isOnline: boolean
  isBusy: boolean
  lastActive: string | null
  currentTask: string | null
  tasksToday: number
  tokensUsed: number
  uptime: string
}

interface AgentStats {
  total: number
  online: number
  busy: number
  offline: number
  tasksToday: number
  totalTokens: number
}

interface GatewayHealth {
  status: string
  uptime: string
  version?: string
}

interface AgentHealthResponse {
  agents: AgentHealth[]
  stats: AgentStats
  gateway: GatewayHealth
  timestamp: string
}

const roleIcons: Record<string, React.ReactNode> = {
  'research': <Cpu className="w-3 h-3" />,
  'scout': <Radio className="w-3 h-3" />,
  'analyst': <Wifi className="w-3 h-3" />,
  'coordinator': <Bot className="w-3 h-3" />,
}

export function AgentPanel() {
  const [data, setData] = useState<AgentHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchAgentHealth = async () => {
    try {
      const response = await fetch('/api/agents/health')
      if (!response.ok) throw new Error('Failed to fetch agent health')
      const data = await response.json()
      setData(data)
      setLastRefresh(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to fetch agent status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentHealth()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAgentHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const formatTokens = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
        <Activity className="w-8 h-8 animate-pulse mb-2" />
        <span className="text-xs">Scanning fleet...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--accent-red)]">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span className="text-xs">{error || 'Connection failed'}</span>
      </div>
    )
  }

  const { agents, stats, gateway } = data

  return (
    <div className="h-full flex flex-col">
      {/* Gateway Status Bar */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]",
        gateway.status === 'online' ? "bg-[var(--accent-green-dim)]" : "bg-[var(--accent-red-dim)]"
      )}>
        <div className="flex items-center gap-2">
          <Server className={cn(
            "w-4 h-4",
            gateway.status === 'online' ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
          )} />
          <span className="text-xs font-medium">
            Gateway {gateway.status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">
          {gateway.uptime} uptime
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-1 p-2 border-b border-[var(--border-subtle)]">
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--accent-green)]">
            {stats.online.toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Online</div>
        </div>
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--accent-amber)]">
            {stats.busy.toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Busy</div>
        </div>
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--accent-cyan)]">
            {stats.tasksToday}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Tasks Today</div>
        </div>
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--text-secondary)]">
            {formatTokens(stats.totalTokens)}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Tokens</div>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {agents.map((agent, index) => {
            const roleIcon = roleIcons[agent.role] || <Bot className="w-3 h-3" />
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "mc-agent-card group cursor-pointer",
                  agent.isOnline && "mc-glow-green",
                  agent.isBusy && "mc-glow-amber"
                )}
              >
                {/* Status Indicator with Pulse */}
                <div className="relative flex-shrink-0">
                  <div className={cn(
                    "mc-status-dot",
                    agent.isOnline ? "mc-status-online" : "mc-status-offline"
                  )} />
                  {agent.isBusy && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--accent-amber)] rounded-full animate-pulse" />
                  )}
                </div>
                
                {/* Avatar */}
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-[var(--bg-elevated)] text-[var(--accent-cyan)] border border-[var(--border-subtle)]">
                    {agent.emoji}
                  </AvatarFallback>
                </Avatar>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {agent.name}
                    </span>
                    {agent.tasksToday > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] rounded">
                        {agent.tasksToday}
                      </span>
                    )}
                  </div>
                  
                  {/* Current Task or Status */}
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                    <span className="opacity-70">{roleIcon}</span>
                    {agent.currentTask ? (
                      <span className="text-[var(--accent-amber)] truncate">{agent.currentTask}</span>
                    ) : (
                      <span className="uppercase tracking-wider">{agent.status}</span>
                    )}
                  </div>
                  
                  {/* Activity Bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          agent.isOnline ? "bg-[var(--accent-green)]" : "bg-[var(--text-muted)]"
                        )}
                        style={{ width: agent.isOnline ? '100%' : '20%' }}
                      />
                    </div>
                    <span className="text-[9px] text-[var(--text-muted)]">
                      {formatTimeAgo(agent.lastActive)}
                    </span>
                  </div>
                </div>

                {/* Hover Details */}
                <div className="hidden group-hover:flex flex-col items-end gap-1 text-[9px] text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{agent.model}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatTokens(agent.tokensUsed)} tokens</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {agents.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No agents in fleet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {formatTimeAgo(lastRefresh.toISOString())}</span>
          </div>
          <button 
            onClick={fetchAgentHealth}
            className="hover:text-[var(--accent-cyan)] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}
