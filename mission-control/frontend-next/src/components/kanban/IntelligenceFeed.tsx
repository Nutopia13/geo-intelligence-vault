"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Zap, Shield, Globe, Terminal, Activity, AlertTriangle, Sparkles } from 'lucide-react'
import { Intelligence } from '@/types'
import { cn } from '@/lib/utils'

interface IntelligenceFeedProps {
  intelligence: Intelligence[]
}

const categoryConfig: Record<string, { 
  icon: React.ReactNode
  color: string
  borderColor: string
  bgColor: string
}> = {
  threat: { 
    icon: <Shield className="w-3 h-3" />,
    color: 'text-[var(--accent-red)]',
    borderColor: 'border-[var(--accent-red)]/30',
    bgColor: 'bg-[var(--accent-red-dim)]'
  },
  opportunity: { 
    icon: <Zap className="w-3 h-3" />,
    color: 'text-[var(--accent-green)]',
    borderColor: 'border-[var(--accent-green)]/30',
    bgColor: 'bg-[var(--accent-green-dim)]'
  },
  news: { 
    icon: <Globe className="w-3 h-3" />,
    color: 'text-[var(--accent-cyan)]',
    borderColor: 'border-[var(--accent-cyan)]/30',
    bgColor: 'bg-[var(--accent-cyan-dim)]'
  },
  system: { 
    icon: <Terminal className="w-3 h-3" />,
    color: 'text-[var(--accent-amber)]',
    borderColor: 'border-[var(--accent-amber)]/30',
    bgColor: 'bg-[var(--accent-amber-dim)]'
  },
  breakthrough: { 
    icon: <Sparkles className="w-3 h-3" />,
    color: 'text-[var(--accent-purple)]',
    borderColor: 'border-[var(--accent-purple)]/30',
    bgColor: 'bg-[var(--accent-purple-dim)]'
  },
  default: { 
    icon: <Activity className="w-3 h-3" />,
    color: 'text-[var(--text-secondary)]',
    borderColor: 'border-[var(--border-default)]',
    bgColor: 'bg-[var(--bg-tertiary)]'
  },
}

export function IntelligenceFeed({ intelligence }: IntelligenceFeedProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence initial={false}>
          {intelligence.map((item, index) => {
            const config = categoryConfig[item.category] || categoryConfig.default
            const isNew = index === 0
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "mc-intel-item group cursor-pointer rounded-r-md",
                  isNew && "bg-[var(--bg-tertiary)] border-l-[var(--accent-cyan)]"
                )}
              >
                {/* Header: Category & Time */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className={cn(
                    "flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider border",
                    config.bgColor,
                    config.color,
                    config.borderColor
                  )}>
                    {config.icon}
                    <span>{item.category}</span>
                  </div>
                  <span className="mc-data text-[10px] text-[var(--text-muted)]">
                    {new Date(item.created_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-medium text-[var(--text-primary)] mb-1 line-clamp-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {item.title || item.content.slice(0, 50)}
                </h4>
                
                {/* Content Preview */}
                <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 mb-2 leading-relaxed">
                  {item.content}
                </p>

                {/* Footer: Source & Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                    src: {item.source}
                  </span>
                  
                  {item.confidence_score && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1 rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border-subtle)]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.confidence_score * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={cn(
                            "h-full rounded-full",
                            item.confidence_score > 0.8 ? "bg-[var(--accent-green)]" :
                            item.confidence_score > 0.5 ? "bg-[var(--accent-amber)]" : "bg-[var(--accent-red)]"
                          )}
                        />
                      </div>
                      <span className="mc-data text-[9px] text-[var(--text-secondary)]">
                        {Math.round(item.confidence_score * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {intelligence.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-[var(--text-muted)]">
            <Radio className="w-8 h-8 mb-2 opacity-30" />
            <span className="text-xs uppercase tracking-wider">No signals detected</span>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]" />
            </span>
            <span className="text-[var(--accent-green)] uppercase tracking-wider">Monitoring</span>
          </div>
          <span className="text-[var(--text-muted)] mc-data">
            {intelligence.length} items
          </span>
        </div>
      </div>
    </div>
  )
}
