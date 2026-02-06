import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Agent configuration from openclaw.json
const AGENT_CONFIG: Record<string, { name: string; role: string; model: string; emoji: string }> = {
  'main': { name: 'Crabic-Main', role: 'coordinator', model: 'Kimi', emoji: '👑' },
  'crabic-research': { name: 'Crabic-Research', role: 'research', model: 'Gemini-Lite', emoji: '🔬' },
  'crabic-scout': { name: 'Crabic-Scout', role: 'scout', model: 'Gemini-Lite', emoji: '👁️' },
  'crabic-analyst': { name: 'Crabic-Analyst', role: 'analyst', model: 'GPT-4o', emoji: '🧩' },
}

export async function GET(request: NextRequest) {
  try {
    // Check OpenClaw agent status via CLI
    const agentStatuses = await checkAgentStatuses()
    
    // Check gateway health
    const gatewayHealth = await checkGatewayHealth()
    
    // Get recent activity from system
    const recentActivity = await getRecentActivity()

    // Build enhanced agent data
    const agents = Object.entries(AGENT_CONFIG).map(([id, config]) => {
      const status = agentStatuses[id] || { status: 'offline', lastActive: null, currentTask: null }
      const activity = recentActivity[id] || { tasksToday: 0, tokensUsed: 0 }
      
      return {
        id,
        ...config,
        status: status.status,
        isOnline: status.status === 'online' || status.status === 'busy',
        isBusy: status.status === 'busy',
        lastActive: status.lastActive,
        currentTask: status.currentTask,
        tasksToday: activity.tasksToday,
        tokensUsed: activity.tokensUsed,
        uptime: status.uptime || '0h',
      }
    })

    // Calculate stats
    const stats = {
      total: agents.length,
      online: agents.filter(a => a.isOnline).length,
      busy: agents.filter(a => a.isBusy).length,
      offline: agents.filter(a => !a.isOnline).length,
      tasksToday: agents.reduce((sum, a) => sum + a.tasksToday, 0),
      totalTokens: agents.reduce((sum, a) => sum + a.tokensUsed, 0),
    }

    return NextResponse.json({
      agents,
      stats,
      gateway: gatewayHealth,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent health check failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent health', details: String(error) },
      { status: 500 }
    )
  }
}

async function checkAgentStatuses(): Promise<Record<string, any>> {
  const statuses: Record<string, any> = {}
  
  try {
    // Check if openclaw CLI is available and get session info
    // This is a simplified version - in production you'd query the OpenClaw API
    
    // For now, simulate status checks based on filesystem activity
    for (const agentId of Object.keys(AGENT_CONFIG)) {
      try {
        // Check for recent activity in agent workspace
        const { stdout } = await execAsync(
          `find /home/clawd/.openclaw/agents/${agentId}/workspace -type f -mtime -0.01 2>/dev/null | wc -l`,
          { timeout: 5000 }
        )
        
        const recentFiles = parseInt(stdout.trim()) || 0
        
        if (agentId === 'main') {
          // Main agent is always considered online if we're running
          statuses[agentId] = {
            status: 'online',
            lastActive: new Date().toISOString(),
            currentTask: 'Active coordination',
            uptime: '24h',
          }
        } else if (recentFiles > 0) {
          statuses[agentId] = {
            status: 'busy',
            lastActive: new Date().toISOString(),
            currentTask: `Processing ${recentFiles} files`,
            uptime: '2h',
          }
        } else {
          statuses[agentId] = {
            status: 'offline',
            lastActive: new Date(Date.now() - 86400000).toISOString(),
            currentTask: null,
            uptime: '0h',
          }
        }
      } catch {
        statuses[agentId] = {
          status: 'offline',
          lastActive: null,
          currentTask: null,
          uptime: '0h',
        }
      }
    }
  } catch (error) {
    console.error('Failed to check agent statuses:', error)
  }
  
  return statuses
}

async function checkGatewayHealth(): Promise<{ status: string; uptime: string; version?: string }> {
  try {
    // Check if gateway port is responding
    const { stdout } = await execAsync(
      'curl -s -o /dev/null -w "%{http_code}" http://localhost:18789/status 2>/dev/null || echo "000"',
      { timeout: 3000 }
    )
    
    const statusCode = stdout.trim()
    
    if (statusCode === '200') {
      return { status: 'online', uptime: '99.9%', version: '2026.2.3' }
    } else if (statusCode === '401' || statusCode === '403') {
      return { status: 'online', uptime: '99.9%', version: '2026.2.3' }
    } else {
      return { status: 'offline', uptime: '0%' }
    }
  } catch {
    return { status: 'unknown', uptime: 'unknown' }
  }
}

async function getRecentActivity(): Promise<Record<string, any>> {
  // This would query your database or log files for actual task counts
  // For now, return placeholder data
  return {
    'main': { tasksToday: 12, tokensUsed: 125000 },
    'crabic-research': { tasksToday: 3, tokensUsed: 15000 },
    'crabic-scout': { tasksToday: 0, tokensUsed: 0 },
    'crabic-analyst': { tasksToday: 0, tokensUsed: 0 },
  }
}
