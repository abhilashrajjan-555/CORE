# C.O.R.E. Workflow - Notion-Inspired Theme

## 🎨 Design Overhaul: From Vibrant to Minimalist

You requested a color scheme inspired by Notion - clean, black and white, professional. The entire UI has been redesigned with a minimalist aesthetic.

---

## Color Palette

### Backgrounds
| Element | Color | Usage |
|---------|-------|-------|
| **Primary Background** | #ffffff (white) | Main panels, body |
| **Secondary Background** | #f8f8f8 (light gray) | Cards, buttons, inputs |
| **Tertiary Background** | #efefef (medium gray) | Hover states |

### Text Colors
| Element | Color | Usage |
|---------|-------|-------|
| **Primary Text** | #37352f (dark brown) | Headers, body text |
| **Secondary Text** | #626060 (medium gray) | Subheadings |
| **Muted Text** | #787774 (light gray) | Hints, timestamps |
| **Dim Text** | #9a9795 (very light gray) | Placeholders |

### Accents
| Element | Color | Purpose |
|---------|-------|---------|
| **Primary Accent** | #37352f | Tab active state, links |
| **Dark Accent** | #191919 | Hover states, emphasis |
| **Light Accent** | #d0ccc8 | Borders, dividers |

### Type Indicators (Soft Pastels)
- **Task**: Light beige (#e5e5dc) with dark text
- **Idea**: Light purple (#ede4ff) with purple text
- **Note**: Light blue (#dbeafe) with blue text
- **Media**: Light orange (#fed7aa) with orange text

---

## Design Changes

### Buttons
**Before:**
- Vibrant purple gradient backgrounds
- Glass morphism with blur effects
- Glowing shadows

**After:**
- Flat solid colors (white or dark background)
- Simple light gray borders
- Subtle shadows on hover
- No blur or gradient effects

### Tab Navigation
**Before:**
- Purple gradient active state
- Purple glow on hover

**After:**
- Dark gray solid background for active tabs
- Light gray background on hover
- Subtle shadow, no glow

### Cards & Panels
**Before:**
- Semi-transparent glass effect with blur
- Glowing top border with gradient
- Large shadows

**After:**
- Opaque white background
- Simple gray border
- Thin colored accent line (barely visible)
- Minimal shadow

### Forms & Inputs
**Before:**
- Semi-transparent background
- Purple focus state

**After:**
- Light gray background (#f8f8f8)
- Dark gray border on focus
- Subtle shadow on focus

### Modals
**Before:**
- Dark semi-transparent overlay
- Glass-blurred background

**After:**
- Lighter overlay (40% opacity)
- Pure white background
- Clean borders
- Minimal shadow

### Notifications
**Before:**
- Gradient backgrounds

**After:**
- Solid colors (green, red, blue, orange)
- Same messages, cleaner design

---

## Color Reference

```css
/* CSS Variables Updated */
--bg-primary: #ffffff;           /* Main background */
--bg-secondary: #f8f8f8;         /* Cards, buttons */
--bg-tertiary: #efefef;          /* Hover states */

--accent-primary: #37352f;       /* Main accent - dark brown */
--accent-secondary: #626060;     /* Secondary - medium gray */
--accent-gray: #787774;          /* Light gray */
--accent-dark: #191919;          /* Very dark for emphasis */
--accent-light: #d0ccc8;         /* Light for borders */

/* Type Colors */
--accent-task: #37352f;          /* Dark brown for tasks */
--accent-idea: #a78bfa;          /* Purple for ideas */
--accent-note: #60a5fa;          /* Blue for notes */
--accent-media: #f59e0b;         /* Orange for media */
```

---

## Visual Examples

### Buttons
- **Default**: Light gray background, dark text
- **Hover**: Slightly darker gray
- **Active/Primary**: Dark background (#37352f), white text
- **Primary Hover**: Very dark background (#191919)

### Type Pills
- **Task**: Beige pill with dark text
- **Idea**: Light purple pill with purple text
- **Note**: Light blue pill with blue text
- **Media**: Light orange pill with orange text

### Panels
- Top border: 2px colored line (task=dark, idea=purple, note=blue, media=orange)
- Border color: Light gray (#dcccc8)
- Background: Pure white
- Hover: Top border appears

### Status Pills
- Background: Light gray
- Text: Dark gray
- Border: Light gray

---

## What Stayed the Same

✅ Tab-based interface (no scrolling)
✅ All functionality (capture, organize, review, engage)
✅ Responsive design
✅ Keyboard shortcuts (1-4, E/C/O/R)
✅ Accessibility features
✅ Search functionality
✅ Inbox badge count
✅ Modal dialogs

---

## What Changed

❌ Vibrant gradients → Clean solid colors
❌ Purple/pink glows → Subtle gray borders
❌ Glass morphism blur → Flat design
❌ Dark theme aesthetic → Light theme
❌ Rounded gradients → Minimal shadows
❌ Animated background → Clean white

---

## Notion Inspiration

This design draws from Notion's aesthetic:
- **Clean typography**: Inter font, clear hierarchy
- **Minimal color palette**: Black text on white background
- **Subtle accents**: Gray borders and dividers
- **Professional feel**: No unnecessary effects
- **Productivity-focused**: Reduces visual noise

---

## Browser Compatibility

All browsers that support CSS custom properties:
- ✅ Chrome 49+
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Edge 15+

---

## Future Customization

The color scheme is fully customizable via CSS variables in `assets/styles.css` root selector. To modify colors:

```css
:root {
  /* Update these variables to change the entire theme */
  --bg-primary: #ffffff;
  --accent-primary: #37352f;
  /* ... etc */
}
```

---

## Design Philosophy

> "The best design is invisible. It gets out of the way and lets users focus on their work."

This Notion-inspired theme prioritizes:
1. **Clarity** - Clear typography, unambiguous UI
2. **Simplicity** - Minimal elements, maximum function
3. **Professionalism** - Clean, trustworthy appearance
4. **Accessibility** - High contrast, readable text
5. **Productivity** - Minimal visual noise, focus on content

---

**Status:** ✅ Complete
**Theme Version:** 1.0 (Notion-Inspired)
**Date:** December 11, 2025
