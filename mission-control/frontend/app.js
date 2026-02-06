/**
 * Mission Control - Kanban Dashboard
 * Application Logic with Supabase Integration
 */

// Supabase Configuration
const supabaseUrl = 'https://amaawfhjrewqqihwuifw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtYWF3ZmhqcmV3cXFpaHd1aWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwMDAwMDAsImV4cCI6MjAxOTU3NjAwMH0.example'; // Placeholder - will be set by user

// Initialize Supabase client
let supabase = null;

// Application State
let state = {
    tasks: [],
    agents: [],
    missions: [],
    intelligence: [],
    currentTask: null,
    filters: {
        priority: '',
        agent: ''
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize Supabase
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Initialize drag and drop
        initializeDragAndDrop();
        
        // Load initial data
        await Promise.all([
            loadTasks(),
            loadAgents(),
            loadIntelligence()
        ]);
        
        // Set up real-time subscriptions
        setupRealtimeSubscriptions();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update stats
        updateStats();
        
        console.log('✅ Mission Control initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Failed to initialize dashboard', 'error');
    }
});

// Initialize Drag and Drop
function initializeDragAndDrop() {
    const columns = ['backlog', 'in_progress', 'review', 'done'];
    
    columns.forEach(columnId => {
        const column = document.getElementById(`column-${columnId}`);
        if (column) {
            new Sortable(column, {
                group: 'kanban',
                animation: 150,
                ghostClass: 'task-card-ghost',
                dragClass: 'task-card-drag',
                delay: 0,
                delayOnTouchOnly: true,
                onEnd: async (evt) => {
                    const taskId = evt.item.dataset.taskId;
                    const newStatus = evt.to.dataset.status;
                    
                    if (evt.from !== evt.to) {
                        await updateTaskStatus(taskId, newStatus);
                    }
                }
            });
        }
    });
}

// Load Tasks
async function loadTasks() {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                task_assignments(
                    agent_id,
                    agents(id, name, avatar_url)
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        state.tasks = data || [];
        renderTasks();
        updateTaskCounts();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

// Load Agents
async function loadAgents() {
    try {
        const { data, error } = await supabase
            .from('agents')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        state.agents = data || [];
        renderAgents();
        populateAgentFilters();
    } catch (error) {
        console.error('Error loading agents:', error);
    }
}

// Load Intelligence
async function loadIntelligence() {
    try {
        const { data, error } = await supabase
            .from('intelligence')
            .select(`
                *,
                agents(id, name)
            `)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        state.intelligence = data || [];
        renderIntelligence();
    } catch (error) {
        console.error('Error loading intelligence:', error);
    }
}

// Setup Real-time Subscriptions
function setupRealtimeSubscriptions() {
    // Tasks subscription
    supabase
        .channel('tasks-channel')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'tasks' },
            (payload) => {
                handleTaskChange(payload);
            }
        )
        .subscribe();
    
    // Task assignments subscription
    supabase
        .channel('assignments-channel')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'task_assignments' },
            () => {
                loadTasks();
            }
        )
        .subscribe();
    
    // Intelligence subscription
    supabase
        .channel('intelligence-channel')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'intelligence' },
            (payload) => {
                handleNewIntelligence(payload.new);
            }
        )
        .subscribe();
    
    // Agents subscription
    supabase
        .channel('agents-channel')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'agents' },
            () => {
                loadAgents();
            }
        )
        .subscribe();
}

// Handle Task Changes
async function handleTaskChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
        case 'INSERT':
            // Fetch full task with assignments
            const { data: insertedTask } = await supabase
                .from('tasks')
                .select(`
                    *,
                    task_assignments(
                        agent_id,
                        agents(id, name, avatar_url)
                    )
                `)
                .eq('id', newRecord.id)
                .single();
            
            if (insertedTask) {
                state.tasks.unshift(insertedTask);
                renderTasks();
                updateTaskCounts();
                showNotification('New task created', 'success');
            }
            break;
            
        case 'UPDATE':
            const index = state.tasks.findIndex(t => t.id === newRecord.id);
            if (index !== -1) {
                // Fetch full updated task
                const { data: updatedTask } = await supabase
                    .from('tasks')
                    .select(`
                        *,
                        task_assignments(
                            agent_id,
                            agents(id, name, avatar_url)
                        )
                    `)
                    .eq('id', newRecord.id)
                    .single();
                
                if (updatedTask) {
                    state.tasks[index] = updatedTask;
                    renderTasks();
                    updateTaskCounts();
                }
            }
            break;
            
        case 'DELETE':
            state.tasks = state.tasks.filter(t => t.id !== oldRecord.id);
            renderTasks();
            updateTaskCounts();
            break;
    }
}

// Handle New Intelligence
function handleNewIntelligence(intelligence) {
    state.intelligence.unshift(intelligence);
    if (state.intelligence.length > 20) {
        state.intelligence.pop();
    }
    renderIntelligence();
    showNotification('New intelligence received', 'info');
}

// Render Tasks
function renderTasks() {
    const columns = {
        backlog: document.getElementById('column-backlog'),
        in_progress: document.getElementById('column-in_progress'),
        review: document.getElementById('column-review'),
        done: document.getElementById('column-done')
    };
    
    // Clear columns
    Object.values(columns).forEach(col => col.innerHTML = '');
    
    // Filter tasks
    const filteredTasks = state.tasks.filter(task => {
        const priorityMatch = !state.filters.priority || task.priority === state.filters.priority;
        const agentMatch = !state.filters.agent || 
            (task.task_assignments && task.task_assignments.some(a => a.agent_id === state.filters.agent));
        return priorityMatch && agentMatch;
    });
    
    // Render filtered tasks
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        const column = columns[task.status];
        if (column) {
            column.appendChild(taskCard);
        }
    });
    
    updateTaskCounts();
}

// Create Task Card Element
function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card p-4 rounded-xl bg-navy-800/60 border border-gray-700/50 hover:border-teal/30 transition-all cursor-pointer';
    div.dataset.taskId = task.id;
    div.onclick = () => openTaskModal(task);
    
    const priorityColors = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    
    const priorityClass = priorityColors[task.priority] || priorityColors.low;
    
    const assignedAgent = task.task_assignments && task.task_assignments[0]?.agents;
    const agentName = assignedAgent ? assignedAgent.name : 'Unassigned';
    const agentInitial = agentName.charAt(0).toUpperCase();
    
    const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
    const dueDateClass = isOverdue ? 'text-red-400' : 'text-gray-500';
    
    const tags = task.tags || [];
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-2">
            <span class="px-2 py-0.5 text-xs font-semibold rounded border ${priorityClass}">
                ${task.priority}
            </span>
            ${task.status === 'done' ? '<i data-lucide="check-circle-2" class="w-4 h-4 text-green-400"></i>' : ''}
        </div>
        <h4 class="font-medium text-gray-200 mb-2 line-clamp-2">${task.title}</h4>
        ${task.description ? `<p class="text-sm text-gray-500 mb-3 line-clamp-2">${task.description}</p>` : ''}
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-teal/20 text-teal text-xs flex items-center justify-center font-medium">
                    ${agentInitial}
                </div>
                <span class="text-xs text-gray-400">${agentName}</span>
            </div>
            <div class="flex items-center gap-1 ${dueDateClass}">
                <i data-lucide="clock" class="w-3 h-3"></i>
                <span class="text-xs">${dueDate}</span>
            </div>
        </div>
        ${tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mt-3">
                ${tags.slice(0, 3).map(tag => `<span class="px-1.5 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400">${tag}</span>`).join('')}
                ${tags.length > 3 ? `<span class="px-1.5 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400">+${tags.length - 3}</span>` : ''}
            </div>
        ` : ''}
    `;
    
    // Re-initialize icons for this card
    setTimeout(() => lucide.createIcons(), 0);
    
    return div;
}

// Render Agents
function renderAgents() {
    const container = document.getElementById('agent-list');
    container.innerHTML = '';
    
    state.agents.forEach(agent => {
        const statusColors = {
            online: 'bg-green-500',
            busy: 'bg-yellow-500',
            offline: 'bg-gray-500'
        };
        
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 rounded-lg bg-navy-800/30 border border-gray-700/30';
        div.innerHTML = `
            <div class="relative">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center text-white font-semibold">
                    ${agent.name.charAt(0).toUpperCase()}
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColors[agent.status] || 'bg-gray-500'} border-2 border-navy-900"></div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-200 text-sm truncate">${agent.name}</p>
                <p class="text-xs text-gray-500 capitalize">${agent.status} • ${agent.role || 'Agent'}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

// Render Intelligence Feed
function renderIntelligence() {
    const container = document.getElementById('intelligence-feed');
    container.innerHTML = '';
    
    if (state.intelligence.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i data-lucide="radio" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                <p class="text-sm">No signals yet</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    state.intelligence.forEach(item => {
        const div = document.createElement('div');
        div.className = 'intelligence-item p-3 rounded-lg bg-navy-800/30 border border-gray-700/30';
        
        const timeAgo = getTimeAgo(new Date(item.created_at));
        const typeColors = {
            alert: 'text-red-400',
            info: 'text-blue-400',
            warning: 'text-yellow-400',
            success: 'text-green-400'
        };
        
        div.innerHTML = `
            <div class="flex items-start gap-2">
                <i data-lucide="signal" class="w-4 h-4 ${typeColors[item.signal_type] || 'text-gray-400'} mt-0.5 shrink-0"></i>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-300 line-clamp-2">${item.content}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                        ${item.agents ? `<span class="text-xs text-teal">${item.agents.name}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
    
    lucide.createIcons();
}

// Update Task Counts
function updateTaskCounts() {
    const columns = ['backlog', 'in_progress', 'review', 'done'];
    
    columns.forEach(status => {
        const count = state.tasks.filter(t => t.status === status).length;
        const el = document.querySelector(`[data-column="${status}"]`);
        if (el) el.textContent = count;
    });
    
    // Update total task count in header
    document.getElementById('task-count').textContent = state.tasks.length;
}

// Update Stats
function updateStats() {
    document.getElementById('agent-count').textContent = state.agents.length;
    document.getElementById('alert-count').textContent = state.intelligence.filter(i => i.signal_type === 'alert').length;
}

// Populate Agent Filters
function populateAgentFilters() {
    const select = document.getElementById('filter-agent');
    const createSelect = document.getElementById('new-task-agent');
    
    // Clear existing options (keep first)
    while (select.children.length > 1) select.removeChild(select.lastChild);
    while (createSelect.children.length > 1) createSelect.removeChild(createSelect.lastChild);
    
    state.agents.forEach(agent => {
        const option1 = new Option(agent.name, agent.id);
        const option2 = new Option(agent.name, agent.id);
        select.add(option1);
        createSelect.add(option2);
    });
}

// Task CRUD Operations
async function updateTaskStatus(taskId, newStatus) {
    try {
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', taskId);
        
        if (error) throw error;
        
        // Update local state
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            renderTasks();
        }
        
        showNotification(`Task moved to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (error) {
        console.error('Error updating task status:', error);
        showNotification('Failed to update task status', 'error');
        renderTasks(); // Revert UI
    }
}

async function createTask(taskData) {
    try {
        // Create task
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert([{
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                status: taskData.status,
                due_date: taskData.due_date || null,
                tags: taskData.tags || [],
                mission_id: null
            }])
            .select()
            .single();
        
        if (taskError) throw taskError;
        
        // Create assignment if agent selected
        if (taskData.agent_id) {
            const { error: assignError } = await supabase
                .from('task_assignments')
                .insert([{
                    task_id: task.id,
                    agent_id: taskData.agent_id
                }]);
            
            if (assignError) throw assignError;
        }
        
        showNotification('Task created successfully', 'success');
        return task;
    } catch (error) {
        console.error('Error creating task:', error);
        showNotification('Failed to create task', 'error');
        throw error;
    }
}

async function deleteTask(taskId) {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);
        
        if (error) throw error;
        
        closeTaskModal();
        showNotification('Task deleted', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Modal Functions
function openTaskModal(task) {
    state.currentTask = task;
    
    document.getElementById('modal-title').textContent = task.title;
    document.getElementById('modal-description').textContent = task.description || 'No description';
    document.getElementById('modal-status').textContent = task.status.replace('_', ' ').toUpperCase();
    
    const priorityEl = document.getElementById('modal-priority');
    priorityEl.textContent = task.priority.toUpperCase();
    priorityEl.className = `px-3 py-1 text-xs font-semibold rounded-full ${getPriorityClass(task.priority)}`;
    
    const assignedAgent = task.task_assignments && task.task_assignments[0]?.agents;
    document.getElementById('modal-agent').querySelector('span').textContent = assignedAgent?.name || 'Unassigned';
    
    const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';
    document.getElementById('modal-due-date').querySelector('span').textContent = dueDate;
    
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    if (task.tags && task.tags.length > 0) {
        task.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'px-2 py-1 text-xs rounded bg-gray-700 text-gray-300';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    } else {
        tagsContainer.innerHTML = '<span class="text-sm text-gray-500">No tags</span>';
    }
    
    document.getElementById('task-modal').classList.remove('hidden');
    lucide.createIcons();
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.add('hidden');
    state.currentTask = null;
}

function openCreateModal() {
    document.getElementById('create-task-form').reset();
    document.getElementById('create-modal').classList.remove('hidden');
}

function closeCreateModal() {
    document.getElementById('create-modal').classList.add('hidden');
}

function editCurrentTask() {
    // TODO: Implement edit functionality
    showNotification('Edit feature coming soon', 'info');
}

function deleteCurrentTask() {
    if (state.currentTask && confirm('Are you sure you want to delete this task?')) {
        deleteTask(state.currentTask.id);
    }
}

// Event Listeners
function setupEventListeners() {
    // Filter change handlers
    document.getElementById('filter-priority').addEventListener('change', (e) => {
        state.filters.priority = e.target.value;
        renderTasks();
    });
    
    document.getElementById('filter-agent').addEventListener('change', (e) => {
        state.filters.agent = e.target.value;
        renderTasks();
    });
    
    // Create task form
    document.getElementById('create-task-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const tags = document.getElementById('new-task-tags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t);
        
        const taskData = {
            title: document.getElementById('new-task-title').value,
            description: document.getElementById('new-task-description').value,
            priority: document.getElementById('new-task-priority').value,
            status: document.getElementById('new-task-status').value,
            agent_id: document.getElementById('new-task-agent').value || null,
            due_date: document.getElementById('new-task-due').value || null,
            tags: tags
        };
        
        await createTask(taskData);
        closeCreateModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskModal();
            closeCreateModal();
        }
    });
}

function clearFilters() {
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-agent').value = '';
    state.filters.priority = '';
    state.filters.agent = '';
    renderTasks();
}

// Utility Functions
function getPriorityClass(priority) {
    const classes = {
        critical: 'bg-red-500/20 text-red-400',
        high: 'bg-orange-500/20 text-orange-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        low: 'bg-blue-500/20 text-blue-400'
    };
    return classes[priority] || classes.low;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

function showNotification(message, type = 'info') {
    // Simple notification - could be enhanced with a toast component
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create visual notification
    const notification = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    notification.className = `fixed bottom-4 right-4 ${colors[type] || colors.info} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}