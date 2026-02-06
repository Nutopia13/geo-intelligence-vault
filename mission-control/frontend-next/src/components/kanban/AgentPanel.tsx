"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle, Bot, Cpu, Radio } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Agent } from '@/types'
import { cn } from '@/lib/utils'

interface AgentPanelProps {
  agents: Agent[]
}

const statusConfig = {
  online: { 
    dot: 'mc-status-online',
    label: 'ONLINE',
    textColor: 'text-[var(--accent-green)]'
  },
  busy: { 
    dot: 'mc-status-busy',
    label: 'BUSY',
    textColor: 'text-[var(--accent-amber)]'
  },
  offline: { 
    dot: 'mc-status-offline',
    label: 'OFFLINE',
    textColor: 'text-[var(--text-muted)]'
  },
}

const roleIcons: Record<string, React.ReactNode> = {
  'research': <Cpu className="w-3 h-3" />,
  'scout': <Radio className="w-3 h-3" />,
  'analyst': <Wifi className="w-3 h-3" />,
  'coordinator': <Bot className="w-3 h-3" />,
}

export function AgentPanel({ agents }: AgentPanelProps) {
  const onlineCount = agents.filter(a => a.status === 'online').length
  const busyCount = agents.filter(a => a.status === 'busy').length

  return (
    <div className="h-full flex flex-col">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1 p-2 border-b border-[var(--border-subtle)]">
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--accent-green)]">
            {onlineCount.toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Online</div>
        </div>
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--accent-amber)]">
            {busyCount.toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Busy</div>
        </div>
        <div className="text-center py-2 bg-[var(--bg-tertiary)] rounded">
          <div className="mc-data text-lg text-[var(--text-muted)]">
            {(agents.length - onlineCount - busyCount).toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Offline</div>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence>
          {agents.map((agent, index) => {
            const status = statusConfig[agent.status]
            const roleIcon = roleIcons[agent.role?.toLowerCase()] || <Bot className="w-3 h-3" />
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="mc-agent-card group cursor-pointer"
              >
                {/* Status Dot */}
                <div className={cn("mc-status-dot flex-shrink-0", status.dot)} />
                
                {/* Avatar */}
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback className="text-[9px] bg-[var(--bg-elevated)] text-[var(--accent-cyan)] border border-[var(--border-subtle)]">
                    {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {agent.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                    <span className="opacity-70">{roleIcon}</span>
                    <span className="uppercase tracking-wider">{agent.role}</span>
                  </div>
                </div>

                {/* Status Label (on hover) */}
                <div className="hidden group-hover:block text-[9px] mc-data">
                  <span className={status.textColor}>{status.label}</span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {agents.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No agents online</p>
          </div>
        )}
      </div>
    </div>
  )
}
