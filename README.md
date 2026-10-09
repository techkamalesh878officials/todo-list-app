# 📋 To-Do List App

A modern, polished to-do list application with local storage, dark mode, and keyboard shortcuts.

## ✨ Features

- ✅ **Add, complete, and delete tasks** - Manage your tasks with ease
- 💾 **Local storage** - Your tasks are automatically saved in your browser
- 🌙 **Dark mode** - Toggle between light and dark themes
- 🎯 **Filter tasks** - View all, pending, or completed tasks
- ⌨️ **Keyboard shortcuts** - Quick access to common actions
- 📊 **Statistics** - See total, pending, and completed task counts
- 💾 **Export tasks** - Download your tasks as a JSON file
- 📱 **Fully responsive** - Works perfectly on desktop, tablet, and mobile
- ♿ **Accessible** - Built with accessibility standards in mind
- 🚀 **Fast and lightweight** - No dependencies, pure vanilla JavaScript

## 🚀 Quick Start

### Option 1: Open directly in browser
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding tasks!

### Option 2: Use a local server

**Python 3:**
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (with http-server):**
```bash
npx http-server
```

**Live Server (VS Code):**
1. Install the "Live Server" extension
2. Right-click `index.html` and select "Open with Live Server"

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Add a new task |
| `Ctrl + D` | Toggle dark mode |
| `Ctrl + K` | Clear completed tasks |
| `Ctrl + Shift + E` | Export tasks |
| `?` | Show help/shortcuts |
| `Letter/Number` | Focus on input field |

## 📁 File Structure

```
todo-list-app/
├── index.html      # Main HTML file
├── styles.css      # Styling and themes
├── script.js       # JavaScript logic
└── README.md       # This file
```

## 🎨 Features in Detail

### Dark Mode
- Toggle between light and dark themes using the theme button in the header
- Your preference is saved automatically
- Keyboard shortcut: `Ctrl + D`

### Task Management
- **Add**: Type your task and press Enter or click "Add"
- **Complete**: Click the checkbox to mark a task as done
- **Delete**: Click "Delete" button to remove a task
- **Filter**: View all, pending, or completed tasks

### Statistics
- **Total**: All tasks in your list
- **Pending**: Incomplete tasks
- **Completed**: Finished tasks

### Export & Backup
- Export all tasks as a JSON file
- Perfect for backing up your data
- Can be imported into other apps

### Data Storage
- All data is stored locally in your browser's localStorage
- No internet required
- No accounts needed
- Your data stays private on your device

## 🛠️ Troubleshooting

### Tasks not saving?
- Check if localStorage is enabled in your browser
- Try clearing browser cache and reloading
- Check browser console for errors (F12)

### Dark mode not working?
- Clear browser cache
- Refresh the page (Ctrl + R)
- Check if JavaScript is enabled

### Icons not displaying?
- The app uses emoji for icons
- Make sure your browser supports emoji rendering
- Try opening in a different browser

## 🔐 Privacy & Security

- ✅ No data is sent to any server
- ✅ No analytics or tracking
- ✅ No advertisements
- ✅ Completely offline
- ✅ Open source

## 📝 Browser Support

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share feedback

## 📜 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Priority levels
- [ ] Cloud sync
- [ ] Collaborative tasks
- [ ] Rich text formatting
- [ ] Voice input

## 📧 Support

Have questions? Issues? Suggestions?
- Open an issue on GitHub
- Check the FAQ section
- Review the keyboard shortcuts (Press `?`)

---

**Made with ❤️ for productivity**

Version 2.0.0