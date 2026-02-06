# Mission Control Kanban Dashboard

A modern, dark-themed Kanban dashboard for managing intelligence operations and multi-agent task coordination.

## Features

- **4-Column Kanban Board**: Backlog, In Progress, Review, Done
- **Real-time Updates**: Live sync via Supabase subscriptions
- **Drag & Drop**: Move tasks between columns with SortableJS
- **Task Management**: Create, view, edit, and delete tasks
- **Agent Status Panel**: Monitor agent availability in real-time
- **Intelligence Feed**: Track latest signals and updates
- **Filtering**: Filter by priority, agent, and status
- **Dark Theme**: Professional dark UI with glassmorphism effects

## Tech Stack

- **HTML5** + **Tailwind CSS** (CDN)
- **Vanilla JavaScript** (no frameworks)
- **Supabase** for backend and real-time
- **SortableJS** for drag-and-drop
- **Lucide Icons** for iconography

## Setup

1. Clone or navigate to the project:
   ```bash
   cd mission-control/frontend
   ```

2. Open `index.html` in a browser, or serve locally:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```

3. The app will automatically connect to Supabase and load data.

## Supabase Configuration

The app connects to:
- **URL**: `https://amaawfhjrewqqihwuifw.supabase.co`
- **Database**: Mission Control schema with 5 tables
  - `agents` - Agent registry
  - `missions` - High-level objectives
  - `tasks` - Kanban task cards
  - `task_assignments` - Task-agent relationships
  - `intelligence` - Raw intelligence feed

## Database Schema

See `/backend/mission_control_schema.sql` for complete schema including:
- Table definitions
- Indexes for performance
- Triggers for auto-updates
- RLS policies
- Sample data

## Usage

### Creating Tasks
1. Click "New Task" button in header
2. Fill in title, description, priority, status
3. Assign to an agent (optional)
4. Add tags (comma-separated)
5. Click "Create Task"

### Moving Tasks
- Drag and drop task cards between columns
- Status updates automatically in database

### Viewing Details
- Click any task card to open detail modal
- Shows full description, assigned agent, due date, tags

### Filtering
- Use dropdown filters in the filter bar
- Filter by priority (Critical, High, Medium, Low)
- Filter by assigned agent

## File Structure

```
frontend/
├── index.html      # Main dashboard UI
├── app.js          # Application logic and Supabase integration
├── styles.css      # Custom styles and glassmorphism
└── README.md       # This file
```

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --navy-900: #0a0e1a;
    --teal: #00d4aa;
    /* ... */
}
```

### Supabase Config
Edit in `app.js`:
```javascript
const supabaseUrl = 'https://amaawfhjrewqqihwuifw.supabase.co'
const supabaseKey = 'your-anon-key'
```

## Real-time Features

The dashboard automatically updates when:
- Tasks are created, updated, or deleted
- Agents change status
- New intelligence arrives

Powered by Supabase real-time subscriptions.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires ES6+ support.

## License

Internal use only - Part of GEO Intelligence Vault project.
