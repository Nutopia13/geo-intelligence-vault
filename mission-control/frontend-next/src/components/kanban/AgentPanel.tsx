"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle, Brain } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Agent } from '@/types'

interface AgentPanelProps {
  agents: Agent[]
}

const statusConfig = {
  online: { 
    color: 'bg-[#00d4aa]', 
    icon: Wifi,
    label: 'Online'
  },
  busy: { 
    color: 'bg-yellow-500', 
    icon: AlertTriangle,
    label: 'Busy'
  },
  offline: { 
    color: 'bg-red-500', 
    icon: WifiOff,
    label: 'Offline'
  },
}

export function AgentPanel({ agents }: AgentPanelProps) {
  const [onlineCount, setOnlineCount] = useState(0)
  const [busyCount, setBusyCount] = useState(0)

  useEffect(() => {
    setOnlineCount(agents.filter(a => a.status === 'online').length)
    setBusyCount(agents.filter(a => a.status === 'busy').length)
  }, [agents])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00d4aa]/10">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#00d4aa]" />
          <h3 className="font-semibold text-[#e0e0e0] uppercase tracking-wider text-sm font-[family-name:var(--font-space-grotesk)]">
            Agents
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-[10px]">
            {onlineCount} Online
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#00d4aa]/10">
        <div className="text-center p-2 rounded-lg bg-[#00d4aa]/5 border border-[#00d4aa]/10">
          <div className="text-lg font-bold text-[#00d4aa] font-mono">{onlineCount}</div>
          <div className="text-[10px] text-[#e0e0e0]/50 uppercase">Online</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
          <div className="text-lg font-bold text-yellow-500 font-mono">{busyCount}</div>
          <div className="text-[10px] text-[#e0e0e0]/50 uppercase">Busy</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-500/5 border border-red-500/10">
          <div className="text-lg font-bold text-red-500 font-mono">
            {agents.length - onlineCount - busyCount}
          </div>
          <div className="text-[10px] text-[#e0e0e0]/50 uppercase">Offline</div>
        </div>
      </div>

      {/* Agent List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {agents.map((agent, index) => {
              const StatusIcon = statusConfig[agent.status].icon
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-[#00d4aa]/5 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={agent.avatar_url} />
                      <AvatarFallback className="text-[10px] bg-[#1a1f2e] text-[#00d4aa]">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0e12]",
                      statusConfig[agent.status].color
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#e0e0e0] truncate">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-[#e0e0e0]/40 uppercase tracking-wider">
                      {agent.role}
                    </div>
                  </div>

                  <StatusIcon className={cn(
                    "w-3 h-3",
                    agent.status === 'online' && "text-[#00d4aa]",
                    agent.status === 'busy' && "text-yellow-500",
                    agent.status === 'offline' && "text-red-500"
                  )} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

// Helper for cn function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
