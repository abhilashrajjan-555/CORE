# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - heading "C.O.R.E. Workflow" [level=1] [ref=e4]
      - paragraph [ref=e5]: Capture · Organize · Review · Engage
    - navigation [ref=e6]:
      - button "Engage - Execute tasks" [ref=e7] [cursor=pointer]: 🎯 Engage
      - button "Capture - Add new items" [ref=e8] [cursor=pointer]: 📥 Capture
      - button "Organize - Process inbox" [ref=e9] [cursor=pointer]:
        - text: 📂 Organize
        - generic [ref=e10]: "1"
      - button "Review - Daily and weekly rituals" [ref=e11] [cursor=pointer]: 📊 Review
    - generic [ref=e12]:
      - button "Export JSON" [ref=e13] [cursor=pointer]
      - generic "Import data from JSON" [ref=e14] [cursor=pointer]:
        - text: Import JSON
        - button "Import JSON" [ref=e15]
  - main [ref=e16]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Engage" [level=2] [ref=e19]
        - paragraph [ref=e20]: Execute & do
      - generic [ref=e21]:
        - heading "Today's Focus" [level=3] [ref=e22]
        - generic [ref=e24]:
          - paragraph [ref=e25]: No active focus
          - button "Pick a Task" [ref=e26] [cursor=pointer]
      - generic [ref=e27]:
        - heading "Up Next" [level=3] [ref=e28]
        - paragraph [ref=e30]: No tasks due today. Great job!
      - generic [ref=e31]:
        - heading "Completed Today" [level=3] [ref=e32]
        - paragraph [ref=e34]: No tasks completed yet today.
```