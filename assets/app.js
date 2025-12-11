const STORAGE_KEY = 'core.objects';
const REVIEW_KEY = 'core.reviewLog';

const DEFAULT_OBJECTS = [
  {
    id: 'seed-task-1',
    type: 'task',
    title: 'Draft automation brief for Apps Script',
    body: 'Outline triggers for capture, organize, and review flows.',
    areaId: 'work',
    projectId: 'core-workflow',
    status: 'next',
    priorityScore: 82,
    energyLevel: 'medium',
    estimatedEffortMins: 45,
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    capturedAt: new Date().toISOString(),
    tags: ['automation', 'design'],
    nextAction: 'Draft blueprint doc',
    reviewCadence: 'daily'
  },
  {
    id: 'seed-note-1',
    type: 'note',
    title: 'Weekly sync highlights',
    body: 'Focus on GitHub Pages MVP and Drive automation connector.',
    areaId: 'work',
    projectId: 'core-workflow',
    status: 'active',
    priorityScore: 55,
    energyLevel: 'low',
    estimatedEffortMins: 15,
    dueAt: null,
    capturedAt: new Date().toISOString(),
    tags: ['meeting'],
    nextAction: 'Link to tasks',
    reviewCadence: 'weekly'
  },
  {
    id: 'seed-idea-1',
    type: 'idea',
    title: 'Notion AI templates',
    body: 'Auto-generate meeting briefs from captured notes.',
    areaId: 'work',
    projectId: 'thought-leadership',
    status: 'inbox',
    priorityScore: 40,
    energyLevel: 'low',
    estimatedEffortMins: 20,
    dueAt: null,
    capturedAt: new Date().toISOString(),
    tags: ['ai', 'template'],
    nextAction: 'Brainstorm outline',
    reviewCadence: 'weekly'
  }
];

class CoreStore {
  constructor() {
    this.objects = [];
    this.reviewLog = { daily: null, weekly: null };
  }

  load() {
    if (typeof window === 'undefined') {
      this.objects = DEFAULT_OBJECTS;
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      this.objects = raw ? JSON.parse(raw) : DEFAULT_OBJECTS;
    } catch (error) {
      console.error('Failed to load objects from localStorage:', error);
      this.objects = DEFAULT_OBJECTS;
      this.showStorageError('Failed to load data from storage. Using default data.');
    }

    try {
      const ritualRaw = window.localStorage.getItem(REVIEW_KEY);
      this.reviewLog = ritualRaw ? JSON.parse(ritualRaw) : { daily: null, weekly: null };
    } catch (error) {
      console.error('Failed to load review log from localStorage:', error);
      this.reviewLog = { daily: null, weekly: null };
    }
  }

  save() {
    try {
      const serialized = JSON.stringify(this.objects);
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        this.showStorageError('Storage quota exceeded. Your data may not be saved. Try exporting your data and clearing old items.');
      } else {
        this.showStorageError('Failed to save data. Please check your browser storage settings.');
      }
    }
  }

  saveReviewLog() {
    try {
      const serialized = JSON.stringify(this.reviewLog);
      window.localStorage.setItem(REVIEW_KEY, serialized);
    } catch (error) {
      console.error('Failed to save review log to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        this.showStorageError('Storage quota exceeded when saving review log.');
      }
    }
  }

  showStorageError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'storage-error-notification';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  add(object) {
    this.objects = [object, ...this.objects];
    this.save();
  }

  update(id, changes) {
    this.objects = this.objects.map((obj) => (obj.id === id ? { ...obj, ...changes } : obj));
    this.save();
  }

  replaceAll(objects) {
    this.objects = objects;
    this.save();
  }

  getInbox() {
    return this.objects.filter((obj) => obj.status === 'inbox');
  }

  getActive(filter = 'all') {
    return this.objects.filter((obj) => obj.status !== 'inbox' && (filter === 'all' || obj.type === filter));
  }

  getByType(type) {
    return this.objects.filter((obj) => obj.type === type);
  }

  markReview(type) {
    this.reviewLog[type] = new Date().toISOString();
    this.saveReviewLog();
  }
}

const store = new CoreStore();
const state = {
  para: { areas: [] },
  activeFilter: 'all',
  searchQuery: ''
};

const dom = {};

document.addEventListener('DOMContentLoaded', async () => {
  assignDomRefs();
  await loadParaMetadata();
  store.load();
  populateAreaProjectSelects();
  bindEvents();
  renderAll();
});

function assignDomRefs() {
  dom.captureForm = document.getElementById('capture-form');
  dom.areaSelect = document.getElementById('entry-area');
  dom.projectSelect = document.getElementById('entry-project');
  dom.inboxList = document.getElementById('inbox-list');
  dom.paraTree = document.getElementById('para-tree');
  dom.organizedList = document.getElementById('organized-list');
  dom.dailyReview = document.getElementById('daily-review');
  dom.weeklyReview = document.getElementById('weekly-review');
  dom.filterButtons = document.querySelectorAll('.filters button');
  dom.exportButton = document.getElementById('export-data');
  dom.importInput = document.getElementById('import-data');
  dom.completeDaily = document.getElementById('complete-daily');
  dom.completeWeekly = document.getElementById('complete-weekly');
  dom.searchInput = document.getElementById('search-input');

  // Tab navigation elements
  dom.tabButtons = document.querySelectorAll('.tab-btn');
  dom.panels = document.querySelectorAll('[data-panel]');

  // New Engage panel elements
  dom.toggleAdvanced = document.getElementById('toggle-advanced');
  dom.advancedFields = document.getElementById('advanced-fields');
  dom.toggleIcon = document.getElementById('toggle-icon');
  dom.currentFocus = document.getElementById('current-focus');
  dom.pickFocus = document.getElementById('pick-focus');
  dom.nextActions = document.getElementById('next-actions');
  dom.completedToday = document.getElementById('completed-today');
}

async function loadParaMetadata() {
  try {
    const response = await fetch('assets/data/para.json');
    if (!response.ok) throw new Error('Failed to load PARA metadata');
    state.para = await response.json();
  } catch (error) {
    console.warn('Failed to fetch para.json, using fallback data:', error);
    // Fallback data for local file:// protocol (works locally and on GitHub Pages)
    state.para = {
      "areas": [
        {
          "id": "personal",
          "name": "Personal Optimization",
          "cadence": "weekly",
          "keywords": ["wellness", "fitness", "habits"],
          "projects": [
            {
              "id": "habit-tune-up",
              "name": "Habit Tune-Up",
              "goal": "Refresh routines for sleep, movement, mindfulness",
              "deadline": null
            }
          ],
          "resources": [
            {
              "id": "health-library",
              "name": "Health Library"
            }
          ]
        },
        {
          "id": "work",
          "name": "Work and Career",
          "cadence": "weekly",
          "keywords": ["clients", "deliverables", "team"],
          "projects": [
            {
              "id": "core-workflow",
              "name": "C.O.R.E. System Build",
              "goal": "Ship MVP automation stack",
              "deadline": "2024-12-31"
            },
            {
              "id": "thought-leadership",
              "name": "Thought Leadership",
              "goal": "Publish monthly insight pieces",
              "deadline": null
            }
          ],
          "resources": [
            {
              "id": "templates",
              "name": "Templates"
            },
            {
              "id": "research",
              "name": "Research Vault"
            }
          ]
        }
      ]
    };
  }
}

function populateAreaProjectSelects() {
  const areaOptions = ['<option value="">Unassigned</option>'];
  const projectOptions = ['<option value="">Unassigned</option>'];
  state.para.areas.forEach((area) => {
    areaOptions.push(`<option value="${area.id}">${area.name}</option>`);
    area.projects.forEach((project) => {
      projectOptions.push(`<option value="${project.id}">${project.name}</option>`);
    });
  });
  dom.areaSelect.innerHTML = areaOptions.join('');
  dom.projectSelect.innerHTML = projectOptions.join('');
}

// Tab Navigation Management
function initTabNavigation() {
  // Restore active tab from localStorage
  const savedTab = window.localStorage.getItem('core.activeTab') || 'engage';
  switchTab(savedTab);

  // Add click handlers to tab buttons
  dom.tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
    });
  });

  // Keyboard shortcuts: 1-4 for tabs (e, c, o, r)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'k' || e.key === 'K') {
        // Ctrl+K for quick capture modal - will implement next
        e.preventDefault();
      }
    } else {
      // Number keys 1-4 for tab switching
      const keyMap = { '1': 'engage', '2': 'capture', '3': 'organize', '4': 'review' };
      if (keyMap[e.key]) {
        e.preventDefault();
        switchTab(keyMap[e.key]);
      }
      // Also support e, c, o, r keys
      const keyLetterMap = { 'e': 'engage', 'c': 'capture', 'o': 'organize', 'r': 'review' };
      if (keyLetterMap[e.key.toLowerCase()]) {
        switchTab(keyLetterMap[e.key.toLowerCase()]);
      }
    }
  });
}

function switchTab(tabName) {
  // Validate tab name
  const validTabs = ['engage', 'capture', 'organize', 'review'];
  if (!validTabs.includes(tabName)) {
    console.warn(`Invalid tab name: ${tabName}`);
    return;
  }

  // Hide all panels
  dom.panels.forEach((panel) => {
    panel.classList.remove('active');
  });

  // Show selected panel
  const activePanel = document.querySelector(`[data-panel="${tabName}"]`);
  if (activePanel) {
    activePanel.classList.add('active');
  }

  // Update tab button states
  dom.tabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Save to localStorage
  window.localStorage.setItem('core.activeTab', tabName);

  // Update organize badge on tab switch
  if (tabName === 'organize') {
    updateOrganizeBadge();
  }
}

function updateOrganizeBadge() {
  const badge = document.getElementById('organize-badge');
  if (!badge) return;

  const inboxCount = store.objects.filter((obj) => obj.status === 'inbox').length;
  if (inboxCount > 0) {
    badge.textContent = inboxCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function bindEvents() {
  if (!dom.captureForm) {
    console.error('dom.captureForm is undefined!');
    return;
  }

  // Tab navigation
  initTabNavigation();

  dom.captureForm.addEventListener('submit', handleCaptureSubmit);

  dom.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      dom.filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      dom.searchInput.value = '';
      renderOrganizedList();
    });
  });

  // Search functionality with debounce
  if (dom.searchInput) {
    let searchTimeout;
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      state.searchQuery = e.target.value.toLowerCase();
      searchTimeout = setTimeout(() => renderOrganizedList(), 150);
    });
  }

  dom.exportButton.addEventListener('click', exportData);
  dom.importInput.addEventListener('change', importData);
  dom.completeDaily.addEventListener('click', () => {
    store.markReview('daily');
    renderReview();
  });
  dom.completeWeekly.addEventListener('click', () => {
    store.markReview('weekly');
    renderReview();
  });

  // Toggle advanced fields
  dom.toggleAdvanced.addEventListener('click', () => {
    const isExpanded = dom.advancedFields.classList.toggle('show');
    dom.toggleIcon.classList.toggle('expanded', isExpanded);
    dom.advancedFields.style.display = isExpanded ? 'flex' : 'none';
  });

  // Pick focus functionality
  dom.pickFocus.addEventListener('click', pickFocusTask);
}

function handleCaptureSubmit(event) {
  event.preventDefault();
  const formData = new FormData(dom.captureForm);

  // Validate required fields
  const title = formData.get('title');
  if (!title || !title.trim()) {
    showNotification('Title is required', 'error');
    return;
  }

  // Validate effort if provided
  const effort = formData.get('effort');
  if (effort) {
    const effortNum = Number(effort);
    if (isNaN(effortNum) || effortNum < 1 || effortNum > 480) {
      showNotification('Estimated effort must be between 1 and 480 minutes', 'error');
      return;
    }
  }

  // Validate due date is not in the past
  const due = formData.get('due');
  if (due) {
    const dueDate = new Date(due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      showNotification('Due date cannot be in the past', 'error');
      return;
    }
  }

  const newObject = createInformationObjectFromForm(formData);
  store.add(newObject);
  dom.captureForm.reset();
  renderAll();
  showNotification('Item captured successfully', 'success');
}

function createInformationObjectFromForm(formData) {
  const now = new Date().toISOString();
  const type = formData.get('type');
  const due = formData.get('due');
  const effort = Number(formData.get('effort') || 0);
  const tags = (formData.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const areaId = formData.get('area') || null;
  const projectId = formData.get('project') || null;
  return {
    id: crypto.randomUUID(),
    type,
    title: formData.get('title'),
    body: formData.get('body') || '',
    areaId,
    projectId,
    status: 'inbox',
    priorityScore: calculatePriority({ due, effort, type }),
    energyLevel: formData.get('energy') || 'medium',
    estimatedEffortMins: effort || null,
    dueAt: due ? new Date(due).toISOString() : null,
    capturedAt: now,
    tags,
    nextAction: formData.get('nextAction') || '',
    reviewCadence: type === 'task' ? 'daily' : 'weekly'
  };
}

function calculatePriority({ due, effort, type }) {
  let score = 30;
  if (due) {
    const daysUntilDue = (new Date(due) - new Date()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 40 - daysUntilDue * 5);
  }
  if (effort && effort <= 5) score += 10;
  if (type === 'task') score += 5;
  return Math.min(100, Math.max(20, Math.round(score)));
}

function renderAll() {
  renderInbox();
  renderParaTree();
  renderOrganizedList();
  renderReview();
  renderEngage();
  updateOrganizeBadge();
}

function renderInbox() {
  dom.inboxList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  store.getInbox().forEach((object) => fragment.appendChild(buildCard(object, { showAssign: true })));
  dom.inboxList.appendChild(fragment);
}

function renderParaTree() {
  if (!state.para.areas.length) {
    dom.paraTree.textContent = 'Add PARA metadata to start organizing.';
    return;
  }
  dom.paraTree.innerHTML = '';
  state.para.areas.forEach((area) => {
    const areaBlock = document.createElement('div');
    areaBlock.className = 'area-block';
    const header = document.createElement('div');
    header.className = 'area-header';
    const name = document.createElement('h4');
    name.textContent = area.name;
    const cadence = document.createElement('small');
    cadence.textContent = `${area.cadence} review`;
    header.append(name, cadence);
    areaBlock.appendChild(header);

    const projects = document.createElement('div');
    projects.className = 'project-list';
    area.projects.forEach((project) => {
      const count = store.objects.filter((obj) => obj.projectId === project.id && obj.status !== 'done').length;
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = `${project.name} (${count})`;
      item.addEventListener('click', () => {
        state.activeFilter = 'all';
        dom.filterButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === 'all'));
        renderOrganizedList(project.id);
        scrollToSection(dom.organizedList);
      });
      projects.appendChild(item);
    });
    areaBlock.appendChild(projects);
    dom.paraTree.appendChild(areaBlock);
  });
}

function renderOrganizedList(projectFilter = null) {
  dom.organizedList.innerHTML = '';
  let list = store
    .getActive(state.activeFilter)
    .filter((obj) => (projectFilter ? obj.projectId === projectFilter : true));

  // Apply search filter
  if (state.searchQuery) {
    list = list.filter((obj) => {
      const titleMatch = obj.title.toLowerCase().includes(state.searchQuery);
      const bodyMatch = obj.body.toLowerCase().includes(state.searchQuery);
      const tagsMatch = obj.tags?.some((tag) => tag.toLowerCase().includes(state.searchQuery));
      return titleMatch || bodyMatch || tagsMatch;
    });
  }

  if (!list.length) {
    dom.organizedList.textContent = state.searchQuery ? 'No items match your search.' : 'Nothing here yet.';
    return;
  }
  const fragment = document.createDocumentFragment();
  list.forEach((object) => fragment.appendChild(buildCard(object)));
  dom.organizedList.appendChild(fragment);
}

function renderReview() {
  const { daily, weekly } = calculateReviewData();
  renderReviewSection(dom.dailyReview, daily.cards);
  renderReviewSection(dom.weeklyReview, weekly.cards);
  updateRitualButtons(daily.completedAt, weekly.completedAt);
}

function calculateReviewData() {
  const tasks = store.getByType('task');
  const today = new Date();
  const focus = tasks
    .filter((task) => ['inbox', 'next', 'active'].includes(task.status))
    .sort((a, b) => {
      const dueA = a.dueAt ? new Date(a.dueAt) : null;
      const dueB = b.dueAt ? new Date(b.dueAt) : null;
      if (dueA && dueB) return dueA - dueB;
      if (dueA) return -1;
      if (dueB) return 1;
      return b.priorityScore - a.priorityScore;
    })
    .slice(0, 3);

  const quickWins = tasks.filter((task) => task.estimatedEffortMins && task.estimatedEffortMins <= 5);
  const overdue = tasks.filter((task) => task.dueAt && new Date(task.dueAt) < today && task.status !== 'done');

  const weeklyUnsorted = store.objects.filter((obj) => obj.status === 'inbox');
  const projectProgress = state.para.areas.flatMap((area) =>
    area.projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      const done = projectTasks.filter((task) => task.status === 'done').length;
      const total = projectTasks.length || 1;
      return {
        title: project.name,
        pct: Math.round((done / total) * 100)
      };
    })
  );

  return {
    daily: {
      completedAt: store.reviewLog.daily,
      cards: [
        {
          title: 'Top Focus',
          lines: focus.map((task) => `${task.title} (${formatStatus(task.status)})`)
        },
        {
          title: 'Quick Wins',
          lines: quickWins.map((task) => `${task.title} · ${task.estimatedEffortMins} mins`)
        },
        {
          title: 'Overdue',
          lines: overdue.map((task) => `${task.title} · Due ${formatDate(task.dueAt)}`)
        }
      ]
    },
    weekly: {
      completedAt: store.reviewLog.weekly,
      cards: [
        {
          title: 'Inbox To Triage',
          lines: weeklyUnsorted.map((obj) => `${obj.title} (${obj.type})`)
        },
        {
          title: 'Project Progress',
          lines: projectProgress.map((proj) => `${proj.title}: ${proj.pct}%`)
        }
      ]
    }
  };
}

function renderReviewSection(container, cards) {
  container.innerHTML = '';
  cards.forEach((card) => {
    const el = document.createElement('article');
    el.className = 'object-card';
    const title = document.createElement('h4');
    title.textContent = card.title;
    el.appendChild(title);
    if (!card.lines.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No items 🎉';
      el.appendChild(empty);
    } else {
      const list = document.createElement('ul');
      card.lines.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        list.appendChild(li);
      });
      el.appendChild(list);
    }
    container.appendChild(el);
  });
}

function updateRitualButtons(daily, weekly) {
  dom.completeDaily.textContent = daily ? `Done ${formatRelative(daily)}` : 'Mark Done';
  dom.completeWeekly.textContent = weekly ? `Done ${formatRelative(weekly)}` : 'Mark Done';
}

function buildCard(object, options = {}) {
  const template = document.getElementById('object-card-template');
  const card = template.content.firstElementChild.cloneNode(true);
  const typePill = card.querySelector('.type-pill');
  const statusPill = card.querySelector('.status-pill');
  typePill.textContent = object.type;
  typePill.classList.add(object.type);
  statusPill.textContent = formatStatus(object.status);
  card.querySelector('.object-title').textContent = object.title;
  card.querySelector('.object-body').textContent = object.body || 'No description yet.';

  const detailMap = {
    Area: lookupAreaName(object.areaId) || 'Inbox',
    Project: lookupProjectName(object.projectId) || 'Unassigned',
    'Due / Priority': `${object.dueAt ? formatDate(object.dueAt) : '—'} / ${object.priorityScore}`,
    Tags: object.tags?.length ? object.tags.join(', ') : '—'
  };
  const dl = card.querySelector('.object-details');
  Object.entries(detailMap).forEach(([key, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dl.append(dt, dd);
  });

  const actions = card.querySelector('.card-actions');
  actions.appendChild(actionButton('Complete', () => markComplete(object.id)));
  if (object.status === 'inbox') {
    actions.appendChild(actionButton('Move to Next', () => updateStatus(object.id, 'next')));
  } else if (object.status !== 'done') {
    actions.appendChild(actionButton('Snooze', () => snoozeObject(object.id)));
  }
  if (options.showAssign) {
    actions.appendChild(actionButton('Assign Project', () => promptAssign(object.id)));
  }
  return card;
}

function actionButton(label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

function markComplete(id) {
  store.update(id, { status: 'done', completedAt: new Date().toISOString() });
  renderAll();
}

function updateStatus(id, status) {
  store.update(id, { status });
  renderAll();
}

function snoozeObject(id) {
  showSnoozeModal(id);
}

function promptAssign(id) {
  showAssignModal(id);
}

function showSnoozeModal(id) {
  const modal = createModal('Snooze Task', (resolve) => {
    const formGroup = document.createElement('div');
    formGroup.className = 'modal-form-group';

    const label = document.createElement('label');
    label.textContent = 'Snooze until:';

    const input = document.createElement('input');
    input.type = 'date';
    input.min = new Date().toISOString().split('T')[0];

    formGroup.append(label, input);

    const handleConfirm = () => {
      const snoozeUntil = input.value;
      if (!snoozeUntil) {
        input.classList.add('error');
        return;
      }
      store.update(id, { snoozeUntil, status: 'waiting' });
      renderAll();
      resolve();
    };

    return { content: formGroup, onConfirm: handleConfirm };
  });

  document.body.appendChild(modal);
  document.querySelector('.modal-overlay').focus();
}

function showAssignModal(id) {
  const modal = createModal('Assign Project', (resolve) => {
    const formGroup = document.createElement('div');
    formGroup.className = 'modal-form-group';

    const label = document.createElement('label');
    label.textContent = 'Select Project:';

    const select = document.createElement('select');
    select.innerHTML = '<option value="">-- Choose a project --</option>';

    state.para.areas.forEach((area) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = area.name;
      area.projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });

    formGroup.append(label, select);

    const handleConfirm = () => {
      const projectId = select.value;
      if (!projectId) {
        select.classList.add('error');
        return;
      }
      const project = findProject(projectId);
      if (!project) {
        showNotification('Project not found.', 'error');
        return;
      }
      store.update(id, { projectId, areaId: findAreaByProject(projectId)?.id, status: 'active' });
      renderAll();
      resolve();
    };

    return { content: formGroup, onConfirm: handleConfirm };
  });

  document.body.appendChild(modal);
  document.querySelector('.modal-overlay').focus();
}

function createModal(title, contentBuilder) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(modal);
  });

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'modal-title');

  const header = document.createElement('div');
  header.className = 'modal-header';

  const dialogTitle = document.createElement('h3');
  dialogTitle.id = 'modal-title';
  dialogTitle.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close dialog');
  closeBtn.addEventListener('click', () => closeModal(modal));

  header.append(dialogTitle, closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';

  const { content, onConfirm } = contentBuilder(() => closeModal(modal));
  body.appendChild(content);

  const footer = document.createElement('div');
  footer.className = 'modal-footer';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => closeModal(modal));

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'primary';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', onConfirm);

  footer.append(cancelBtn, confirmBtn);

  dialog.append(header, body, footer);
  overlay.appendChild(dialog);
  modal.appendChild(overlay);

  return modal;
}

function closeModal(modal) {
  modal.remove();
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

function exportData() {
  const payload = {
    generatedAt: new Date().toISOString(),
    objects: store.objects,
    reviewLog: store.reviewLog
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `core-database-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const payload = JSON.parse(e.target.result);
      if (!payload.objects) throw new Error('Invalid file');
      store.replaceAll(payload.objects);
      store.reviewLog = payload.reviewLog || store.reviewLog;
      store.saveReviewLog();
      renderAll();
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function lookupAreaName(id) {
  return state.para.areas.find((area) => area.id === id)?.name || null;
}

function lookupProjectName(id) {
  for (const area of state.para.areas) {
    const project = area.projects.find((proj) => proj.id === id);
    if (project) return project.name;
  }
  return null;
}

function findProject(id) {
  for (const area of state.para.areas) {
    const project = area.projects.find((proj) => proj.id === id);
    if (project) return project;
  }
  return null;
}

function findAreaByProject(projectId) {
  return state.para.areas.find((area) => area.projects.some((proj) => proj.id === projectId));
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatRelative(value) {
  if (!value) return 'Never';
  const elapsed = Date.now() - new Date(value).getTime();
  const days = Math.round(elapsed / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function scrollToSection(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Engage Panel Functions
function renderEngage() {
  // Get today's tasks (active tasks with due date today or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = store.objects.filter(obj => {
    if (obj.status === 'done' || obj.status === 'archived') return false;
    if (!obj.dueAt) return false;
    const dueDate = new Date(obj.dueAt);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  // Render "Up Next" - top 5 priority tasks
  dom.nextActions.innerHTML = '';
  todayTasks.slice(0, 5).forEach(task => {
    const card = buildCard(task, {
      actions: [
        actionButton('Start', () => setCurrentFocus(task.id)),
        actionButton('Done', () => markComplete(task.id))
      ]
    });
    dom.nextActions.appendChild(card);
  });

  if (todayTasks.length === 0) {
    dom.nextActions.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No tasks due today. Great job!</p>';
  }

  // Render "Completed Today"
  const completedToday = store.objects.filter(obj => {
    if (obj.status !== 'done') return false;
    const completedDate = new Date(obj.completedAt || obj.capturedAt);
    const completedDateOnly = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
    return completedDateOnly.getTime() === today.getTime();
  });

  dom.completedToday.innerHTML = '';
  completedToday.forEach(task => {
    const card = buildCard(task, { hideActions: true });
    dom.completedToday.appendChild(card);
  });

  if (completedToday.length === 0) {
    dom.completedToday.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No tasks completed yet today.</p>';
  }
}

function pickFocusTask() {
  // Get the highest priority task from "Up Next"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = store.objects.filter(obj => {
    if (obj.status === 'done' || obj.status === 'archived') return false;
    if (!obj.dueAt) return false;
    const dueDate = new Date(obj.dueAt);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  if (todayTasks.length > 0) {
    setCurrentFocus(todayTasks[0].id);
  } else {
    alert('No tasks available to focus on. Add some tasks with due dates!');
  }
}

function setCurrentFocus(taskId) {
  const task = store.objects.find(obj => obj.id === taskId);
  if (!task) return;

  // Create buttons as DOM elements instead of using innerHTML
  const focusContainer = document.createElement('div');
  focusContainer.className = 'focus-content';

  const title = document.createElement('h3');
  title.className = 'focus-task-title';
  title.textContent = task.title;

  const details = document.createElement('p');
  details.className = 'focus-task-details';
  details.textContent = task.body || 'No details';

  const actions = document.createElement('div');
  actions.className = 'focus-actions';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'primary';
  completeBtn.textContent = '✓ Complete';
  completeBtn.addEventListener('click', () => completeCurrentFocus(taskId));

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', clearCurrentFocus);

  actions.append(completeBtn, cancelBtn);
  focusContainer.append(title, details, actions);

  dom.currentFocus.innerHTML = '';
  dom.currentFocus.appendChild(focusContainer);

  // Store current focus in state
  state.currentFocusId = taskId;
}

function completeCurrentFocus(taskId) {
  markComplete(taskId);
  clearCurrentFocus();
}

function clearCurrentFocus() {
  state.currentFocusId = null;

  const focusContainer = document.createElement('div');
  focusContainer.className = 'focus-content';

  const label = document.createElement('p');
  label.className = 'focus-label';
  label.textContent = 'No active focus';

  const pickBtn = document.createElement('button');
  pickBtn.className = 'primary';
  pickBtn.textContent = 'Pick a Task';
  pickBtn.addEventListener('click', pickFocusTask);

  focusContainer.append(label, pickBtn);

  dom.currentFocus.innerHTML = '';
  dom.currentFocus.appendChild(focusContainer);
}

// Placeholder hooks for Google Drive / Apps Script sync.
export async function pushToDrive(object) {
  console.log('Sync placeholder', object);
  // Replace with fetch to Apps Script endpoint once ready.
}
