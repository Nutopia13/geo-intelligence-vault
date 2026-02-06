-- Mission Control Kanban Database Schema
-- Created: 2025-02-06
-- Description: Multi-agent task management system with kanban board

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================
-- TABLE: agents
-- Agent registry for tracking all system agents
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'busy', 'offline')),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    capabilities JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE agents IS 'Registry of all agents in the Mission Control system';
COMMENT ON COLUMN agents.capabilities IS 'JSON array of agent capabilities/skills';
COMMENT ON COLUMN agents.metadata IS 'Flexible metadata for agent-specific data';

-- ============================================
-- TABLE: missions
-- High-level objectives that contain tasks
-- ============================================
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=Critical, 5=Low
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    created_by UUID REFERENCES agents(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE missions IS 'High-level objectives containing multiple tasks';
COMMENT ON COLUMN missions.priority IS 'Priority from 1 (Critical) to 5 (Low)';

-- ============================================
-- TABLE: tasks
-- Kanban task cards
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'in-progress', 'review', 'done', 'blocked')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=Critical, 5=Low
    assigned_to UUID REFERENCES agents(id) ON DELETE SET NULL,
    mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    source TEXT, -- Which agent/tool created this task
    metadata JSONB DEFAULT '{}'::jsonb,
    estimated_hours INTEGER,
    actual_hours INTEGER
);

COMMENT ON TABLE tasks IS 'Kanban task cards with workflow status tracking';
COMMENT ON COLUMN tasks.status IS 'Current workflow status: backlog, in-progress, review, done, blocked';
COMMENT ON COLUMN tasks.source IS 'Identifier of agent/tool that created this task';
COMMENT ON COLUMN tasks.tags IS 'Array of labels/tags for categorization';

-- ============================================
-- TABLE: task_assignments
-- Detailed tracking of task-to-agent assignments
-- ============================================
CREATE TABLE IF NOT EXISTS task_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES agents(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(task_id, agent_id)
);

COMMENT ON TABLE task_assignments IS 'Historical tracking of task assignments to agents';

-- ============================================
-- TABLE: intelligence
-- Raw intelligence and data storage
-- ============================================
CREATE TABLE IF NOT EXISTS intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL, -- e.g., 'web_search', 'agent_report', 'system_alert'
    content JSONB NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence BETWEEN 0.0 AND 1.0),
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES agents(id) ON DELETE SET NULL,
    related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    related_mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE intelligence IS 'Raw intelligence data from various sources';
COMMENT ON COLUMN intelligence.confidence IS 'Confidence score 0.0-1.0';
COMMENT ON COLUMN intelligence.processed IS 'Whether this intel has been reviewed/processed';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_mission_id ON tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tasks_source ON tasks(source);
CREATE INDEX IF NOT EXISTS idx_tasks_title_trgm ON tasks USING GIN(title gin_trgm_ops);

-- Mission indexes
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_created_by ON missions(created_by);
CREATE INDEX IF NOT EXISTS idx_missions_due_date ON missions(due_date);

-- Agent indexes
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_last_active ON agents(last_active DESC);

-- Task assignment indexes
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_agent_id ON task_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_completed_at ON task_assignments(completed_at);

-- Intelligence indexes
CREATE INDEX IF NOT EXISTS idx_intelligence_processed ON intelligence(processed);
CREATE INDEX IF NOT EXISTS idx_intelligence_source ON intelligence(source);
CREATE INDEX IF NOT EXISTS idx_intelligence_created_at ON intelligence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intelligence_confidence ON intelligence(confidence);
CREATE INDEX IF NOT EXISTS idx_intelligence_content_gin ON intelligence USING GIN(content);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to agents
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to missions
DROP TRIGGER IF EXISTS update_missions_updated_at ON missions;
CREATE TRIGGER update_missions_updated_at
    BEFORE UPDATE ON missions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ADDITIONAL TRIGGERS
-- ============================================

-- Auto-update agent last_active when task status changes
CREATE OR REPLACE FUNCTION update_agent_last_active()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_to IS NOT NULL THEN
        UPDATE agents SET last_active = NOW() WHERE id = NEW.assigned_to;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_agent_on_task_change ON tasks;
CREATE TRIGGER update_agent_on_task_change
    AFTER INSERT OR UPDATE OF status ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_last_active();

-- Update mission progress when tasks change
CREATE OR REPLACE FUNCTION update_mission_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_tasks INTEGER;
    completed_tasks INTEGER;
    new_progress INTEGER;
BEGIN
    IF NEW.mission_id IS NOT NULL THEN
        SELECT COUNT(*) INTO total_tasks FROM tasks WHERE mission_id = NEW.mission_id;
        SELECT COUNT(*) INTO completed_tasks FROM tasks WHERE mission_id = NEW.mission_id AND status = 'done';
        
        IF total_tasks > 0 THEN
            new_progress := (completed_tasks::FLOAT / total_tasks::FLOAT * 100)::INTEGER;
            UPDATE missions SET progress_percentage = new_progress WHERE id = NEW.mission_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_mission_on_task_done ON tasks;
CREATE TRIGGER update_mission_on_task_done
    AFTER INSERT OR UPDATE OF status ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_mission_progress();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence ENABLE ROW LEVEL SECURITY;

-- Create policies (open for now - can be restricted later)
-- Allow all operations (for API/authenticated usage)
CREATE POLICY "Allow all operations on agents" ON agents
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on missions" ON missions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on task_assignments" ON task_assignments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on intelligence" ON intelligence
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- VIEWS FOR CONVENIENCE
-- ============================================

-- Active tasks view with agent details
CREATE OR REPLACE VIEW active_tasks AS
SELECT 
    t.*,
    a.name as assigned_agent_name,
    a.role as assigned_agent_role,
    m.title as mission_title
FROM tasks t
LEFT JOIN agents a ON t.assigned_to = a.id
LEFT JOIN missions m ON t.mission_id = m.id
WHERE t.status NOT IN ('done', 'cancelled')
ORDER BY t.priority ASC, t.due_date ASC NULLS LAST;

-- Agent workload view
CREATE OR REPLACE VIEW agent_workload AS
SELECT 
    a.id as agent_id,
    a.name,
    a.role,
    a.status,
    COUNT(t.id) FILTER (WHERE t.status = 'in-progress') as tasks_in_progress,
    COUNT(t.id) FILTER (WHERE t.status = 'review') as tasks_in_review,
    COUNT(t.id) FILTER (WHERE t.status = 'backlog') as tasks_backlog
FROM agents a
LEFT JOIN tasks t ON t.assigned_to = a.id AND t.status != 'done'
GROUP BY a.id, a.name, a.role, a.status;

-- Mission summary view
CREATE OR REPLACE VIEW mission_summary AS
SELECT 
    m.*,
    COUNT(t.id) as total_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'done') as completed_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'in-progress') as in_progress_tasks,
    COUNT(t.id) FILTER (WHERE t.status = 'backlog') as backlog_tasks
FROM missions m
LEFT JOIN tasks t ON t.mission_id = m.id
GROUP BY m.id, m.title, m.description, m.status, m.priority, m.progress_percentage, m.created_by, m.due_date, m.metadata, m.created_at, m.updated_at;

-- Unprocessed intelligence view
CREATE OR REPLACE VIEW unprocessed_intelligence AS
SELECT 
    i.*,
    t.title as related_task_title,
    m.title as related_mission_title
FROM intelligence i
LEFT JOIN tasks t ON i.related_task_id = t.id
LEFT JOIN missions m ON i.related_mission_id = m.id
WHERE i.processed = FALSE
ORDER BY i.confidence DESC, i.created_at DESC;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample agents
INSERT INTO agents (name, role, status, capabilities) VALUES
('Alpha', 'System Orchestrator', 'active', '["orchestration", "task_management", "monitoring"]'),
('Beta', 'Data Processor', 'idle', '["data_processing", "analysis", "reporting"]'),
('Gamma', 'Research Agent', 'busy', '["web_search", "research", "summarization"]'),
('Delta', 'Code Assistant', 'active', '["coding", "debugging", "architecture"]'),
('Epsilon', 'Communication Agent', 'idle', '["messaging", "notifications", "alerts"]');

-- Insert sample missions
INSERT INTO missions (title, description, status, priority, progress_percentage, due_date) VALUES
('Launch Mission Control Dashboard', 'Build the main kanban dashboard UI for Mission Control', 'active', 1, 35, NOW() + INTERVAL '7 days'),
('Agent Communication Protocol', 'Establish standardized communication between agents', 'active', 2, 60, NOW() + INTERVAL '14 days'),
('Knowledge Base Integration', 'Connect agents to shared knowledge repository', 'draft', 3, 0, NOW() + INTERVAL '30 days'),
('Performance Monitoring System', 'Implement metrics and monitoring for agent performance', 'paused', 2, 25, NOW() + INTERVAL '21 days');

-- Insert sample tasks
WITH agent_ids AS (SELECT id, name FROM agents),
     mission_ids AS (SELECT id, title FROM missions)
INSERT INTO tasks (title, description, status, priority, assigned_to, mission_id, due_date, tags, source, estimated_hours) VALUES
-- Mission 1: Dashboard
('Design kanban board UI', 'Create wireframes and component design', 'done', 1, (SELECT id FROM agent_ids WHERE name = 'Alpha'), (SELECT id FROM mission_ids WHERE title = 'Launch Mission Control Dashboard'), NOW() + INTERVAL '2 days', ARRAY['ui', 'design'], 'Alpha', 8),
('Implement drag-and-drop', 'Add drag-and-drop functionality to task cards', 'in-progress', 1, (SELECT id FROM agent_ids WHERE name = 'Delta'), (SELECT id FROM mission_ids WHERE title = 'Launch Mission Control Dashboard'), NOW() + INTERVAL '3 days', ARRAY['frontend', 'dnd'], 'Delta', 16),
('Connect to Supabase', 'Set up real-time database connection', 'review', 2, (SELECT id FROM agent_ids WHERE name = 'Delta'), (SELECT id FROM mission_ids WHERE title = 'Launch Mission Control Dashboard'), NOW() + INTERVAL '5 days', ARRAY['backend', 'supabase'], 'Alpha', 8),
('Add task filtering', 'Implement status and priority filters', 'backlog', 3, NULL, (SELECT id FROM mission_ids WHERE title = 'Launch Mission Control Dashboard'), NOW() + INTERVAL '6 days', ARRAY['frontend', 'filters'], 'Gamma', 6),

-- Mission 2: Communication
('Define message protocol', 'Standardize agent-to-agent message format', 'done', 1, (SELECT id FROM agent_ids WHERE name = 'Alpha'), (SELECT id FROM mission_ids WHERE title = 'Agent Communication Protocol'), NOW() + INTERVAL '3 days', ARRAY['protocol', 'spec'], 'Alpha', 12),
('Implement message bus', 'Build pub/sub system for agent messages', 'in-progress', 1, (SELECT id FROM agent_ids WHERE name = 'Delta'), (SELECT id FROM mission_ids WHERE title = 'Agent Communication Protocol'), NOW() + INTERVAL '5 days', ARRAY['backend', 'redis'], 'Delta', 20),
('Add error handling', 'Graceful failure handling for comm failures', 'backlog', 3, NULL, (SELECT id FROM mission_ids WHERE title = 'Agent Communication Protocol'), NOW() + INTERVAL '10 days', ARRAY['reliability', 'error-handling'], 'Beta', 8),

-- Mission 3: Knowledge Base
('Research vector databases', 'Evaluate Pinecone vs Weaviate vs Chroma', 'backlog', 2, (SELECT id FROM agent_ids WHERE name = 'Gamma'), (SELECT id FROM mission_ids WHERE title = 'Knowledge Base Integration'), NOW() + INTERVAL '14 days', ARRAY['research', 'vectordb'], 'Gamma', 12),

-- Standalone tasks
('Fix authentication bug', 'Login tokens expiring too quickly', 'blocked', 1, (SELECT id FROM agent_ids WHERE name = 'Delta'), NULL, NOW() + INTERVAL '1 day', ARRAY['bugfix', 'auth'], 'Epsilon', 4),
('Update documentation', 'Add API docs for new endpoints', 'backlog', 4, NULL, NULL, NOW() + INTERVAL '14 days', ARRAY['docs'], 'Beta', 4);

-- Insert task assignments
INSERT INTO task_assignments (task_id, agent_id, assigned_by, notes)
SELECT t.id, t.assigned_to, (SELECT id FROM agents WHERE name = 'Alpha'), 'Initial assignment'
FROM tasks t
WHERE t.assigned_to IS NOT NULL;

-- Insert sample intelligence
INSERT INTO intelligence (source, content, confidence, related_mission_id, processed) VALUES
('web_search', '{"query": "best kanban board libraries 2025", "results": ["React DnD", "dnd-kit", "SortableJS"]}'::jsonb, 0.85, (SELECT id FROM missions WHERE title = 'Launch Mission Control Dashboard'), TRUE),
('agent_report', '{"agent": "Gamma", "report": "Vector database comparison complete", "recommendation": "Pinecone"}'::jsonb, 0.92, (SELECT id FROM missions WHERE title = 'Knowledge Base Integration'), FALSE),
('system_alert', '{"severity": "high", "message": "Database connection pool at 80% capacity"}'::jsonb, 0.75, NULL, FALSE),
('web_search', '{"query": "real-time database Supabase alternatives", "results": ["Firebase", "Convex", "Electric SQL"]}'::jsonb, 0.78, (SELECT id FROM missions WHERE title = 'Launch Mission Control Dashboard'), FALSE),
('agent_report', '{"agent": "Epsilon", "report": "Auth token refresh bug identified", "solution": "Increase TTL in settings"}'::jsonb, 0.95, NULL, TRUE);

-- Update some tasks with completion info
UPDATE tasks SET completed_at = NOW() WHERE status = 'done';
UPDATE tasks SET started_at = NOW() - INTERVAL '1 day' WHERE status = 'in-progress';
UPDATE task_assignments SET completed_at = NOW() 
WHERE task_id IN (SELECT id FROM tasks WHERE status = 'done');

-- Mark some intelligence as processed
UPDATE intelligence SET processed_at = NOW(), processed_by = (SELECT id FROM agents WHERE name = 'Alpha') 
WHERE processed = TRUE;

-- Update agent last_active to reflect task work
UPDATE agents SET last_active = NOW();

-- Refresh mission progress
UPDATE missions SET progress_percentage = 0;

SELECT 'Mission Control Kanban database setup complete!' as status;
