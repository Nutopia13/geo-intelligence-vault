"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Zap, Shield, Globe, Terminal, Activity } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Intelligence } from '@/types'

interface IntelligenceFeedProps {
  intelligence: Intelligence[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  threat: <Shield className="w-3 h-3" />,
  opportunity: <Zap className="w-3 h-3" />,
  news: <Globe className="w-3 h-3" />,
  system: <Terminal className="w-3 h-3" />,
  default: <Activity className="w-3 h-3" />,
}

const categoryColors: Record<string, string> = {
  threat: 'text-red-400 bg-red-500/10 border-red-500/20',
  opportunity: 'text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20',
  news: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  system: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  default: 'text-[#e0e0e0] bg-[#e0e0e0]/10 border-[#e0e0e0]/20',
}

export function IntelligenceFeed({ intelligence }: IntelligenceFeedProps) {
  const [newAlert, setNewAlert] = useState(false)

  useEffect(() => {
    if (intelligence.length > 0) {
      setNewAlert(true)
      const timer = setTimeout(() => setNewAlert(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [intelligence[0]?.id])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00d4aa]/10">
        <div className="flex items-center gap-2">
          <Radio className={cn(
            "w-4 h-4",
            newAlert && "text-red-500 animate-pulse"
          )} />
          <h3 className="font-semibold text-[#e0e0e0] uppercase tracking-wider text-sm font-[family-name:var(--font-space-grotesk)]">
            Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4aa]"></span>
          </span>
          <span className="text-[10px] text-[#00d4aa] uppercase">Live</span>
        </div>
      </div>

      {/* Feed */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          <AnimatePresence initial={false}>
            {intelligence.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.3,
                  delay: index === 0 ? 0 : 0,
                }}
                className={cn(
                  "group p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer",
                  "bg-[#0f1419]/50 border-[#00d4aa]/10 hover:border-[#00d4aa]/30",
                  index === 0 && newAlert && "border-[#00d4aa]/50 shadow-[0_0_15px_rgba(0,212,170,0.2)]"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border",
                    categoryColors[item.category] || categoryColors.default
                  )}>
                    {categoryIcons[item.category] || categoryIcons.default}
                    <span>{item.category}</span>
                  </div>
                  <span className="text-[10px] text-[#e0e0e0]/30 font-mono">
                    {new Date(item.created_at).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {/* Content */}
                <h4 className="text-sm font-medium text-[#e0e0e0] mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#e0e0e0]/50 line-clamp-2 mb-2">
                  {item.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#e0e0e0]/30 uppercase">
                    src: {item.source}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#e0e0e0]/40">confidence</span>
                    <div className="w-12 h-1 rounded-full bg-[#00d4aa]/20 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          item.confidence_score > 0.8 ? "bg-[#00d4aa]" :
                          item.confidence_score > 0.5 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${item.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#e0e0e0]/60">
                      {Math.round(item.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {intelligence.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-[#e0e0e0]/20">
              <Radio className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs uppercase tracking-wider">No signals</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
