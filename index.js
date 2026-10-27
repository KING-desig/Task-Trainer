#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the JSON file that stores tasks
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// ── Helper Functions ───────────────────────────────────────────────

/**
 * Load tasks from the JSON file.
 * Returns an empty array if the file doesn't exist or is invalid.
 */
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading tasks file:', err.message);
  }
  return [];
}

/**
 * Save tasks array to the JSON file.
 */
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving tasks file:', err.message);
  }
}

/**
 * Generate a unique ID for a new task.
 */
function generateId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map(t => t.id)) + 1;
}

/**
 * Format a task for display.
 */
function formatTask(task) {
  const statusIcon =
    task.status === 'done' ? '✅' :
    task.status === 'in progress' ? '🔄' : '📋';

  return `[${task.id}] ${statusIcon} ${task.description} (${task.status}) - Created: ${task.createdAt}`;
}

// ─── Command Handlers ───────────────────────────────────────────────

/**
 * Add a new task.
 * Usage: node index.js add "Buy groceries"
 */
function addTask(description) {
  if (!description) {
    console.error('❌ Please provide a task description.');
    console.log('Usage: node index.js add "<description>"');
    return;
  }

  const tasks = loadTasks();
  const newTask = {
    id: generateId(tasks),
    description: description,
    status: 'todo',
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`✅ Task added successfully!`);
  console.log(`   ${formatTask(newTask)}`);
}

/**
 * Update an existing task's description.
 * Usage: node index.js update 1 "New description"
 */
function updateTask(id, newDescription) {
  if (!id || !newDescription) {
    console.error('❌ Please provide a task ID and a new description.');
    console.log('Usage: node index.js update <id> "<new description>"');
    return;
  }

  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

  if (taskIndex === -1) {
    console.error(`❌ Task with ID ${id} not found.`);
    return;
  }

  tasks[taskIndex].description = newDescription;
  tasks[taskIndex].updatedAt = new Date().toLocaleString();
  saveTasks(tasks);

  console.log(`✅ Task updated successfully!`);
  console.log(`   ${formatTask(tasks[taskIndex])}`);
}

/**
 * Delete a task by ID.
 * Usage: node index.js delete 1
 */
function deleteTask(id) {
  if (!id) {
    console.error('❌ Please provide a task ID.');
    console.log('Usage: node index.js delete <id>');
    return;
  }

  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

  if (taskIndex === -1) {
    console.error(`❌ Task with ID ${id} not found.`);
    return;
  }

  const deleted = tasks.splice(taskIndex, 1)[0];
  saveTasks(tasks);

  console.log(`️  Task deleted successfully!`);
  console.log(`   ${formatTask(deleted)}`);
}

/**
 * Mark a task as "in progress" or "done".
 * Usage: node index.js mark 1 in-progress
 * Usage: node index.js mark 1 done
 */
function markTask(id, status) {
  if (!id || !status) {
    console.error('❌ Please provide a task ID and a status.');
    console.log('Usage: node index.js mark <id> <in-progress|done|todo>');
    return;
  }

  const validStatuses = ['todo', 'in-progress', 'in progress', 'done'];
  if (!validStatuses.includes(status.toLowerCase())) {
    console.error(` Invalid status. Use: todo, in-progress, or done`);
    return;
  }

  const normalizedStatus = status.toLowerCase() === 'in-progress' ? 'in progress' : status.toLowerCase();

  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

  if (taskIndex === -1) {
    console.error(`❌ Task with ID ${id} not found.`);
    return;
  }

  tasks[taskIndex].status = normalizedStatus;
  tasks[taskIndex].updatedAt = new Date().toLocaleString();
  saveTasks(tasks);

  console.log(`✅ Task marked as "${normalizedStatus}"!`);
  console.log(`   ${formatTask(tasks[taskIndex])}`);
}

/**
 * List all tasks, optionally filtered by status.
 * Usage: node index.js list
 * Usage: node index.js list done
 * Usage: node index.js list in-progress
 */
function listTasks(filterStatus) {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log('📭 No tasks found. Add one with: node index.js add "<description>"');
    return;
  }

  let filtered = tasks;
  if (filterStatus) {
    const normalized = filterStatus.toLowerCase() === 'in-progress' ? 'in progress' : filterStatus.toLowerCase();
    filtered = tasks.filter(t => t.status === normalized);
  }

  if (filtered.length === 0) {
    console.log(` No tasks found with status "${filterStatus}".`);
    return;
  }

  console.log(`\n📋 Task List (${filtered.length} task${filtered.length !== 1 ? 's' : ''}):\n`);
  filtered.forEach(task => {
    console.log(`   ${formatTask(task)}`);
  });
  console.log('');
}

/**
 * Show help information.
 */
function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════╗
║           📋 Task Tracker CLI                    ║
══════════════════════════════════════════════════╝

Usage: node index.js <command> [arguments]

Commands:
  add <description>          Add a new task
  update <id> <description>  Update a task's description
  delete <id>                Delete a task
  mark <id> <status>         Mark task as todo|in-progress|done
  list [status]              List all tasks (optionally filter by status)
  help                       Show this help message

Examples:
  node index.js add "Buy groceries"
  node index.js update 1 "Buy organic groceries"
  node index.js mark 1 in-progress
  node index.js mark 1 done
  node index.js list
  node index.js list done
  node index.js delete 1
`);
}

// ─── Main Entry Point ───────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

switch (command) {
  case 'add':
    addTask(args.slice(1).join(' '));
    break;
  case 'update':
    updateTask(args[1], args.slice(2).join(' '));
    break;
  case 'delete':
    deleteTask(args[1]);
    break;
  case 'mark':
    markTask(args[1], args[2]);
    break;
  case 'list':
    listTasks(args[1]);
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    showHelp();
    break;
  default:
    console.error(`❌ Unknown command: "${command}"`);
    showHelp();
    break;
}