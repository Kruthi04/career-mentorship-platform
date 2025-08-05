# CSS Structure and Organization

This directory contains all the custom CSS files for the CareerHub project, organized by functionality.

## File Structure

```
src/styles/
├── theme.css          # Custom color palette and theme variables
├── components.css     # Reusable component styles (buttons, forms, cards, etc.)
├── session.css        # Session management modal and UI styles
└── README.md         # This documentation file
```

## CSS Files

### `theme.css`

- **Purpose**: Custom color palette and CSS variables
- **Colors**: Sail (#C0D7FB), Mariner (#1E3A8A), Royal Blue (#1E40AF), Lynch (#64748B)
- **Features**:
  - CSS custom properties (variables)
  - Utility classes for colors
  - Hover and focus states
  - Gradient classes
  - Button and form styles with custom colors

### `components.css`

- **Purpose**: Reusable component styles
- **Components**:
  - Buttons (primary, secondary, success, danger, outline)
  - Forms (inputs, labels, error states)
  - Cards (header, body, footer)
  - Alerts (success, error, warning, info)
  - Modals
  - Badges
  - Loading spinners
  - Utility classes

### `session.css`

- **Purpose**: Session management UI styles
- **Features**:
  - Modal overlays
  - Warning and error modals
  - Session status indicators
  - Animations for session warnings

## Usage Guidelines

### 1. Use CSS Classes Instead of Inline Styles

```css
/* ✅ Good */
<div className="btn btn-primary">Click me</div>

/* ❌ Avoid */
<div style={{ background: '#3b82f6', color: 'white' }}>Click me</div>
```

### 2. Use Custom Color Classes

```css
/* ✅ Good */
<div className="bg-sail text-mariner">Content</div>
<button className="btn-mariner">Submit</button>

/* ❌ Avoid */
<div style={{ background: '#C0D7FB', color: '#1E3A8A' }}>Content</div>
```

### 3. Use Component Classes

```css
/* ✅ Good */
<div className="card">
  <div className="card-header">Title</div>
  <div className="card-body">Content</div>
</div>

/* ❌ Avoid */
<div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
  Content
</div>
```

### 4. Use Utility Classes

```css
/* ✅ Good */
<div className="text-center font-bold mb-4 p-3 rounded-lg">
  Centered bold text with margin and padding
</div>
```

## Adding New Styles

### For New Components

1. Add styles to `components.css`
2. Use semantic class names
3. Include hover and focus states
4. Add responsive variants if needed

### For New Colors

1. Add CSS variables to `theme.css`
2. Create utility classes
3. Add hover and focus states
4. Update documentation

### For New Features

1. Create a new CSS file if the feature is large
2. Import it in `index.css`
3. Follow the existing naming conventions
4. Document the new styles

## Best Practices

1. **Maintainability**: Use semantic class names
2. **Consistency**: Follow existing patterns
3. **Performance**: Minimize CSS specificity conflicts
4. **Accessibility**: Include focus states and proper contrast
5. **Responsiveness**: Use mobile-first approach
6. **Documentation**: Comment complex CSS rules

## Color Palette

| Color      | Hex Code | Usage                    |
| ---------- | -------- | ------------------------ |
| Sail       | #C0D7FB  | Backgrounds, highlights  |
| Mariner    | #1E3A8A  | Primary actions, text    |
| Royal Blue | #1E40AF  | Secondary actions, links |
| Lynch      | #64748B  | Neutral text, borders    |

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties (variables)
- Flexbox and Grid
- CSS animations and transitions
