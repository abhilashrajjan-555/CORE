# C.O.R.E. Workflow System

A beautiful, modern productivity system for managing your professional and personal information using the **C.O.R.E.** methodology: **Capture · Organize · Review · Engage**.

![C.O.R.E. Workflow](https://img.shields.io/badge/Status-Active-success)
![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-blue)

## 🌟 Features

### 📥 **Capture**
- Universal inbox for tasks, ideas, notes, and media
- Quick capture forms with smart categorization
- Automatic priority scoring
- Due dates and effort estimation

### 🗂️ **Organize**
- PARA methodology (Projects, Areas, Resources, Archives)
- Hierarchical organization system
- Context-based filtering
- Smart project assignment

### 🔍 **Review**
- Daily focus rituals
- Weekly review summaries
- Progress tracking
- Overdue task alerts

### 🚀 **Engage**
- Frictionless execution
- Quick-win identification
- Status management
- Data export/import (JSON)

## 🎨 Design

Built with a premium dark mode UI featuring:
- **Glassmorphism** effects
- **Vibrant gradients** and animations
- **Modern typography** (Inter & Space Grotesk)
- **Smooth micro-interactions**
- **Responsive design** for all devices

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks, no build process
- **LocalStorage** - All data stored locally in your browser
- **Progressive Enhancement** - Works offline
- **GitHub Pages** - Free hosting

## 🚀 Getting Started

### Live Demo
Visit the live application: [Your GitHub Pages URL]

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/core-workflow.git
cd core-workflow
```

2. Open `index.html` in your browser:
```bash
open index.html
```

That's it! No build process required.

## 📁 Project Structure

```
C.O.R.E. Workflow/
├── index.html              # Main application
├── assets/
│   ├── styles.css         # Premium UI styles
│   ├── app.js            # Application logic
│   └── data/
│       └── para.json     # PARA structure metadata
├── core.md               # System documentation
└── README.md            # This file
```

## 📊 Data Management

### Export Data
Click "Export JSON" to download your complete database including:
- All tasks, ideas, notes, and media
- Review logs and completion history
- Timestamps and metadata

### Import Data
Click "Import JSON" to restore from a previous export or migrate data.

## 🎯 Usage

### Capturing Information
1. Fill in the capture form with your task/idea/note
2. Select type, area, and project
3. Add tags and next actions
4. Click "Capture" to add to inbox

### Organizing
1. Review items in your inbox
2. Assign to projects using the PARA tree
3. Use context filters to view specific types
4. Move items to "Next" or "Active" status

### Reviewing
1. Check "Daily Focus" for top 3 priorities
2. Review "Quick Wins" for easy completions
3. Weekly review shows inbox items and project progress
4. Mark rituals as complete to track consistency

## 🌐 Deployment to GitHub Pages

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: C.O.R.E. Workflow System"
```

2. Create a new repository on GitHub

3. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/core-workflow.git
git branch -M main
git push -u origin main
```

4. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select "main" branch as source
   - Click "Save"

5. Your site will be live at: `https://yourusername.github.io/core-workflow/`

## 🔒 Privacy

All data is stored locally in your browser's LocalStorage. Nothing is sent to any server. Your information stays on your device.

## 📝 Customization

### Modify PARA Structure
Edit `assets/data/para.json` to customize your areas and projects:

```json
{
  "areas": [
    {
      "id": "your-area",
      "name": "Your Area Name",
      "cadence": "weekly",
      "projects": [...]
    }
  ]
}
```

### Styling
All styles are in `assets/styles.css`. Customize colors, gradients, and animations to match your preferences.

## 🤝 Contributing

This is a personal productivity system, but feel free to fork and customize for your own needs!

## 📄 License

MIT License - Feel free to use and modify as needed.

## 🙏 Acknowledgments

Based on productivity methodologies by:
- Tiago Forte (PARA Method)
- David Allen (GTD)
- Building a Second Brain principles

---

**Built with ❤️ for frictionless productivity**
