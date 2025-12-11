# C.O.R.E. Workflow - Manual Testing Guide

## Quick Start

1. Open `index.html` in your browser
2. The app loads with sample data
3. Test each feature below

---

## 🧪 Testing Checklist

### 1. Capture Panel ✓

#### A. Basic Capture
- [ ] Fill in "Title" field
- [ ] Select "Type" (task, idea, note, media)
- [ ] Fill in "Details"
- [ ] Click "Capture"
- [ ] See green success notification "Item captured successfully"
- [ ] Item appears in Organize → Inbox

#### B. Advanced Fields
- [ ] Click "Advanced Options" toggle
- [ ] Toggle arrow should rotate
- [ ] Fields expand smoothly
- [ ] Due date has date picker
- [ ] Effort has number input
- [ ] Energy has dropdown
- [ ] Area and Project dropdowns populate from PARA data
- [ ] Tags split by commas
- [ ] Next Action accepts text

#### C. Validation Tests
- [ ] **Empty title** - Submit without title → Red error "Title is required"
- [ ] **Past date** - Enter yesterday's date → Red error "cannot be in the past"
- [ ] **Invalid effort** - Enter "999" → Red error "between 1 and 480 minutes"
- [ ] **Negative effort** - Enter "-5" → Red error
- [ ] **Valid data** - All fields filled → Green success

#### D. Form Behavior
- [ ] Form resets after successful capture
- [ ] Can capture multiple items in sequence
- [ ] Advanced fields stay open/closed between captures

---

### 2. Organize Panel ✓

#### A. Inbox
- [ ] New captures appear in "Inbox" section
- [ ] Each item shows as card with title, details
- [ ] Type pill shows (task/idea/note/media) with correct color
- [ ] Status pill shows "inbox"

#### B. PARA Tree
- [ ] Areas display (Personal Optimization, Work and Career)
- [ ] Projects list under each area
- [ ] Project cards show count of active items
- [ ] Clicking project filters organized list
- [ ] "All" filter activates when clicking project

#### C. Context Filters
- [ ] "All" button active by default
- [ ] Clicking "Tasks" shows only tasks
- [ ] Clicking "Ideas" shows only ideas
- [ ] Clicking "Notes" shows only notes
- [ ] Clicking "Media" shows only media
- [ ] Active button highlights
- [ ] Search clears when changing filters

#### D. Search (NEW)
- [ ] Search box visible below filters
- [ ] Type to filter in real-time
- [ ] **Search by title:** "first" shows items with "first" in title
- [ ] **Search by tags:** Type tag name shows items with that tag
- [ ] **Search by body:** Type text from description shows results
- [ ] Case-insensitive search
- [ ] "No items match your search" when nothing found
- [ ] Clear search shows all items again

#### E. Organized List
- [ ] Shows filtered items based on type and search
- [ ] Each item card shows:
  - Type pill (task/idea/note/media)
  - Status pill (inbox/next/active/done)
  - Title
  - Description
  - Details (Area, Project, Due/Priority, Tags)
  - Action buttons

---

### 3. Project Assignment Modal (NEW) ✓

#### A. Open Modal
- [ ] Click "Assign Project" on inbox item
- [ ] Modal appears centered with overlay
- [ ] Title says "Assign Project"
- [ ] X button in top-right
- [ ] Modal has smooth slide-up animation

#### B. Project Dropdown
- [ ] Dropdown organized by area (optgroup)
- [ ] Each area shows its projects
- [ ] Default text "-- Choose a project --"

#### C. Interaction
- [ ] Click Cancel → Modal closes
- [ ] Click X → Modal closes
- [ ] Click outside → Modal closes
- [ ] Select project → Click Confirm → Modal closes
- [ ] Item moves to organized list with new project
- [ ] Item status changes to "active"

#### D. Validation
- [ ] Try confirming without selecting → Error state on select
- [ ] Select valid project → Works correctly

---

### 4. Snooze Modal (NEW) ✓

#### A. Open Modal
- [ ] Move item to "next" or "active" status first
- [ ] Click "Snooze" button
- [ ] Modal appears with title "Snooze Task"

#### B. Date Picker
- [ ] Date input visible
- [ ] Has "min" attribute set to today
- [ ] Can't select past dates

#### C. Interaction
- [ ] Select future date
- [ ] Click Confirm
- [ ] Item's status changes to "waiting"
- [ ] Item appears in organized list

---

### 5. Review Panel ✓

#### A. Daily Focus
- [ ] Shows "Top Focus" - top 3 tasks by due date and priority
- [ ] Shows "Quick Wins" - tasks under 5 minutes effort
- [ ] Shows "Overdue" - tasks past due date
- [ ] "Mark Done" button to complete daily review

#### B. Weekly Radar
- [ ] Shows "Inbox To Triage" - unprocessed items
- [ ] Shows "Project Progress" - completion % by project
- [ ] "Mark Done" button to complete weekly review

#### C. Review Completion
- [ ] Click "Mark Done" on daily
- [ ] Button text changes to "Done [time]" (e.g., "Done Today", "Done 1d ago")
- [ ] Same for weekly review

---

### 6. Engage Panel ✓

#### A. Today's Focus
- [ ] Empty state: "No active focus"
- [ ] "Pick a Task" button available

#### B. Pick Focus
- [ ] Click "Pick a Task"
- [ ] Highest priority task with due today appears
- [ ] Shows task title and details
- [ ] "✓ Complete" and "Cancel" buttons visible

#### C. Complete from Focus
- [ ] Click "✓ Complete"
- [ ] Task marked as done
- [ ] Focus clears back to "No active focus"
- [ ] Task appears in "Completed Today" section

#### D. Up Next
- [ ] Shows top 5 tasks due today
- [ ] Sorted by priority
- [ ] Each shows Start and Done buttons

#### E. Completed Today
- [ ] Shows tasks completed today only
- [ ] Not from yesterday
- [ ] Counts include tasks completed via focus panel

---

### 7. Notifications (NEW) ✓

#### A. Success Notifications
- [ ] Green gradient
- [ ] Bottom-right corner
- [ ] Auto-dismiss after 4 seconds
- [ ] Slide-in animation

#### B. Error Notifications
- [ ] Red gradient
- [ ] Shows validation error messages
- [ ] Auto-dismiss after 4 seconds

#### C. Storage Notifications
- [ ] Orange gradient
- [ ] Appears if localStorage fails
- [ ] Shows helpful error message

---

### 8. Data Persistence ✓

#### A. LocalStorage
- [ ] Add item
- [ ] Refresh page (Cmd+R or F5)
- [ ] Item still there
- [ ] Check browser DevTools:
  - Open DevTools (F12)
  - Application → LocalStorage
  - Find `core.objects` key
  - Should contain JSON array of items

#### B. Export
- [ ] Click "Export JSON"
- [ ] File downloads as `core-database-[timestamp].json`
- [ ] Open file in text editor
- [ ] Contains valid JSON with objects and reviewLog

#### C. Import
- [ ] Click "Import JSON"
- [ ] Select previously exported file
- [ ] All data restored
- [ ] Items appear in inbox

---

### 9. Accessibility Features ✓

#### A. Keyboard Navigation
- [ ] Tab through form fields
- [ ] Tab through buttons (Organize filters, action buttons)
- [ ] Enter/Space on buttons triggers action
- [ ] Focus visible with purple outline

#### B. Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Modal buttons have clear focus states
- [ ] Form inputs have clear focus states

#### C. Reduced Motion
- [ ] Go to macOS System Preferences → Accessibility → Display
- [ ] Enable "Reduce Motion"
- [ ] Refresh app
- [ ] Animations should be gone/minimal
- [ ] App still fully functional

#### D. Screen Reader (if available)
- [ ] Modal has `role="dialog"`
- [ ] Modal has `aria-modal="true"`
- [ ] All buttons have accessible labels
- [ ] Form inputs have labels

#### E. High Contrast
- [ ] All text readable against background
- [ ] Pill badges have sufficient contrast
- [ ] Check in DevTools: Lighthouse → Accessibility

---

### 10. Edge Cases & Error Handling ✓

#### A. Empty States
- [ ] No items in inbox → "Nothing here yet"
- [ ] Search returns nothing → "No items match your search"
- [ ] No completed tasks today → "No tasks completed yet today"

#### B. Corrupt Data
- [ ] Open DevTools Console
- [ ] Run: `localStorage.setItem('core.objects', 'invalid json')`
- [ ] Refresh page
- [ ] App doesn't crash
- [ ] Shows error notification
- [ ] Uses default data fallback

#### C. Missing Dates
- [ ] Tasks without due dates don't show in "Up Next"
- [ ] "Quick Wins" without effort don't show

#### D. Large Data Sets
- [ ] Add 20+ items
- [ ] Search still performs smoothly
- [ ] No lag or freezing
- [ ] Filters work quickly

---

### 11. UI/UX Polish ✓

#### A. Animations
- [ ] Modal slides up smoothly
- [ ] Notifications slide in from right
- [ ] Buttons have hover effects
- [ ] Cards respond to interaction

#### B. Responsiveness
- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Panels stack vertically on mobile
- [ ] All buttons accessible on mobile

#### C. Colors & Contrast
- [ ] Purple gradient on buttons
- [ ] Pink/red gradient for secondary actions
- [ ] Green for success
- [ ] Red for errors
- [ ] All text readable

---

## 🐛 Bug Testing Scenarios

### Scenario 1: Large Amount of Data
1. Add 50 items to the system
2. Test search performance
3. Test filter performance
4. Export should work smoothly
5. ✅ Should not freeze or lag

### Scenario 2: Rapid Captures
1. Capture 5 items in succession without pausing
2. Each should add successfully
3. Notifications should appear/dismiss correctly
4. ✅ All items should appear in inbox

### Scenario 3: Multiple Filters
1. Capture mix of task/idea/note/media
2. Filter to "Tasks" → Shows only tasks
3. Search while filtered → Search works
4. Change to "Ideas" → Clears search, shows ideas
5. ✅ Filters and search work together

### Scenario 4: Modal During Capture
1. Start capturing an item
2. Don't fill all fields
3. Before completing, click to assign another item
4. First capture still pending?
5. ✅ Should handle gracefully

### Scenario 5: Rapid Project Assignment
1. Add items to inbox
2. Quickly assign multiple items
3. Each should show success
4. All should move to organized list
5. ✅ No race conditions

---

## ✅ Sign-Off Checklist

Before declaring "production ready", verify:

- [ ] All 11 sections tested
- [ ] No console errors (F12 → Console)
- [ ] No visual glitches
- [ ] All animations smooth
- [ ] Search works on title, body, tags
- [ ] Modals open/close properly
- [ ] Data persists after refresh
- [ ] Export/Import works
- [ ] Responsive on mobile
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Error messages clear
- [ ] No broken links or missing assets

---

## 📝 Notes

- If you find any issues, note them with:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Browser/OS version

- To reset all data:
  - DevTools → Application → LocalStorage
  - Right-click `core.objects` → Delete

- To test localStorage error:
  - DevTools Console
  - `localStorage.setItem('core.objects', 'bad data')`
  - Refresh page

---

## 🎯 Expected Results

After testing, you should feel confident that:

✅ The system is reliable
✅ Errors are handled gracefully
✅ User experience is smooth
✅ Data is safe
✅ App is accessible
✅ Performance is good
✅ All features work as intended

**Estimated Testing Time:** 30-45 minutes for complete checklist
