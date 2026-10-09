// Configuration
const STORAGE_KEY = 'todo-list-data';
const THEME_KEY = 'todo-list-theme';
const VERSION = '2.0.0';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const exportBtn = document.getElementById('export-btn');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');
const helpModal = document.getElementById('help-modal');
const closeModal = document.getElementById('close-modal');
const toast = document.getElementById('toast');

// State
let tasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadTasks();
    initTheme();
    renderTasks();
    setupEventListeners();
    setupKeyboardShortcuts();
  } catch (error) {
    console.error('Initialization error:', error);
    showToast('Failed to load tasks', 'error');
  }
});

// ==================== Storage ====================
function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
    
    // Validate tasks structure
    if (!Array.isArray(tasks)) {
      tasks = [];
    }
    
    tasks = tasks.filter(task => task && typeof task === 'object' && task.id && task.text);
  } catch (error) {
    console.error('Error loading tasks:', error);
    tasks = [];
    showToast('Could not load tasks', 'error');
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
    showToast('Failed to save tasks', 'error');
  }
}

// ==================== Theme ====================
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(`${theme}-mode`);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ==================== Rendering ====================
function renderTasks() {
  const filteredTasks = getFilteredTasks();
  
  // Update stats
  updateStats();
  
  // Show/hide empty state
  emptyState.classList.toggle('hidden', filteredTasks.length > 0);
  
  if (filteredTasks.length === 0) {
    todoList.innerHTML = '';
    return;
  }
  
  todoList.innerHTML = filteredTasks
    .map(task => createTaskElement(task))
    .join('');
  
  // Re-attach event listeners
  attachTaskEventListeners();
}

function createTaskElement(task) {
  const createdDate = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown';
  
  return `
    <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${escapeHtml(task.id)}" role="listitem">
      <input
        type="checkbox"
        class="todo-checkbox"
        ${task.completed ? 'checked' : ''}
        aria-label="Mark '${escapeHtml(task.text)}' as complete"
      />
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(task.text)}</span>
        <span class="todo-meta">Added: ${createdDate}</span>
      </div>
      <div class="todo-actions">
        <button class="delete-btn" type="button" aria-label="Delete task">
          🗑️ Delete
        </button>
      </div>
    </li>
  `;
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

function getFilteredTasks() {
  switch (currentFilter) {
    case 'active':
      return tasks.filter(t => !t.completed);
    case 'completed':
      return tasks.filter(t => t.completed);
    default:
      return [...tasks];
  }
}

// ==================== Task Operations ====================
function addTask(text) {
  const trimmed = text.trim();
  
  if (!trimmed) {
    showToast('Task cannot be empty', 'error');
    todoInput.focus();
    return;
  }
  
  if (trimmed.length > 200) {
    showToast('Task is too long (max 200 characters)', 'error');
    return;
  }
  
  const newTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  todoInput.value = '';
  todoInput.focus();
  showToast('Task added! ✓', 'success');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  showToast(
    task.completed ? 'Task completed! 🎉' : 'Task marked as pending',
    'success'
  );
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return;
  
  const taskText = tasks[taskIndex].text;
  tasks.splice(taskIndex, 1);
  saveTasks();
  renderTasks();
  showToast(`Task deleted: "${taskText.substring(0, 30)}..."`, 'success');
}

function clearCompleted() {
  const completedCount = tasks.filter(t => t.completed).length;
  
  if (completedCount === 0) {
    showToast('No completed tasks to clear', 'error');
    return;
  }
  
  if (!confirm(`Clear ${completedCount} completed task(s)?`)) {
    return;
  }
  
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  showToast(`${completedCount} task(s) cleared`, 'success');
}

function resetAll() {
  if (tasks.length === 0) {
    showToast('No tasks to reset', 'error');
    return;
  }
  
  if (!confirm('Reset all tasks? This action cannot be undone.')) {
    return;
  }
  
  tasks = [];
  saveTasks();
  renderTasks();
  showToast('All tasks cleared', 'success');
}

// ==================== Export ====================
function exportTasks() {
  if (tasks.length === 0) {
    showToast('No tasks to export', 'error');
    return;
  }
  
  const exportData = {
    version: VERSION,
    exportedAt: new Date().toISOString(),
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    tasks: tasks
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast(`Exported ${tasks.length} task(s)`, 'success');
}

// ==================== Utilities ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ==================== Event Listeners ====================
function setupEventListeners() {
  // Form
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(todoInput.value);
  });
  
  // Filters
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle('active', b === btn));
      renderTasks();
    });
  });
  
  // Actions
  clearCompletedBtn.addEventListener('click', clearCompleted);
  resetBtn.addEventListener('click', resetAll);
  exportBtn.addEventListener('click', exportTasks);
  themeToggle.addEventListener('click', toggleTheme);
  
  // Modal
  closeModal.addEventListener('click', () => {
    helpModal.classList.add('hidden');
  });
  
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.classList.add('hidden');
    }
  });
}

function attachTaskEventListeners() {
  const checkboxes = document.querySelectorAll('.todo-checkbox');
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const item = checkbox.closest('.todo-item');
      const taskId = item.dataset.id;
      toggleTask(taskId);
    });
  });
  
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.todo-item');
      const taskId = item.dataset.id;
      deleteTask(taskId);
    });
  });
}

// ==================== Keyboard Shortcuts ====================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+D: Toggle dark mode
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
    
    // Ctrl+K: Clear completed
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      clearCompleted();
    }
    
    // Ctrl+Shift+E: Export
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      exportTasks();
    }
    
    // ?: Show help
    if (e.key === '?' && !e.ctrlKey) {
      e.preventDefault();
      helpModal.classList.toggle('hidden');
    }
    
    // Focus input on any letter/number
    if (/^[a-z0-9]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && document.activeElement !== todoInput) {
      todoInput.focus();
    }
  });
}