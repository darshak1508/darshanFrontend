# Design System Documentation

A modern, enterprise-grade design system built from scratch. **NOT based on Material Design.**

Inspired by: Linear, Stripe Dashboard, Vercel, Notion, GitHub

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Layout System](#layout-system)
5. [Migration Guide](#migration-guide)
6. [Best Practices](#best-practices)

---

## Architecture Overview

### Directory Structure

```
src/design-system/
├── tokens/                 # Design tokens (colors, spacing, typography, shadows)
│   ├── colors.js
│   ├── spacing.js
│   ├── typography.js
│   ├── shadows.js
│   └── index.js
├── styles/                 # Global CSS and utilities
│   └── globals.css
├── components/             # React components
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Table/
│   ├── Layout/
│   └── index.js
└── index.js               # Main entry point
```

### Key Principles

1. **No Material UI Dependencies** - Pure CSS/React components
2. **Design Tokens First** - All visual properties defined as tokens
3. **CSS Custom Properties** - Dark mode and theming via CSS variables
4. **Accessibility Built-in** - WCAG 2.1 AA compliance
5. **Performance Optimized** - Minimal runtime overhead

---

## Design Tokens

### Colors

```javascript
import { colors, semanticColors } from '@/design-system/tokens';

// Raw color values
colors.brand[500]     // #06B6D4 - Primary brand color
colors.neutral[900]   // #18181B - Text primary
colors.success[600]   // #16A34A - Success states

// Semantic colors (prefer these)
semanticColors.text.primary     // For main text
semanticColors.bg.primary       // For backgrounds
semanticColors.border.default   // For borders
```

### Spacing

Based on a 4px grid system:

```javascript
import { spacing, space } from '@/design-system/tokens';

spacing[4]    // 16px (4 * 4px)
spacing[6]    // 24px (6 * 4px)
space(8)      // '2rem' (32px as rem)
```

### Typography

```javascript
import { textStyles, getFontStyle } from '@/design-system/tokens';

// Pre-defined text styles
textStyles.h1       // 36px, bold
textStyles.body     // 16px, normal
textStyles.caption  // 12px, normal

// Get CSS object
getFontStyle('h3')  // Returns { fontSize: '24px', fontWeight: 600, ... }
```

### Shadows

```javascript
import { shadows, radius } from '@/design-system/tokens';

shadows.card      // Standard card shadow
shadows.cardHover // Elevated hover state
shadows.focus     // Focus ring (accessibility)

radius.lg         // 8px border radius
radius.xl         // 12px border radius
```

---

## Components

### Button

```jsx
import { Button } from '@/design-system/components';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>
```

### Card

```jsx
import { Card, StatCard } from '@/design-system/components';

// Basic card
<Card padding="md" hover>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description text</Card.Description>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
  <Card.Footer>
    Footer content
  </Card.Footer>
</Card>

// Stat card (for metrics)
<StatCard
  icon={<BusinessIcon />}
  iconColor="brand"      // brand | success | warning | error | violet
  title="Total Firms"
  value={150}
  trend="up"             // up | down
  trendValue="+12%"
  subtitle="Active partners"
/>
```

### Input

```jsx
import { Input, Textarea, Select } from '@/design-system/components';

// Text input
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  helperText="We'll never share your email"
  required
/>

// With validation
<Input
  label="Password"
  type="password"
  error
  helperText="Password is required"
/>

// With icons
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>

// Textarea
<Textarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>

// Select
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>
```

### Table

```jsx
import { Table } from '@/design-system/components';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => <Badge variant={value}>{value}</Badge>
  },
  { key: 'amount', label: 'Amount', align: 'right' },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', amount: '$1,200' },
  // ...
];

<Table
  columns={columns}
  data={data}
  sortable
  pagination
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

---

## Layout System

### App Structure

```jsx
import { 
  AppLayout, 
  Sidebar, 
  SidebarProvider, 
  MainContent,
  PageHeader 
} from '@/design-system/components';

function App() {
  return (
    <SidebarProvider>
      <AppLayout>
        <Sidebar
          brand="App Name"
          brandIcon={<Logo />}
          routes={navigationRoutes}
        />
        <MainContent>
          <PageHeader
            title="Dashboard"
            subtitle="Welcome back!"
            actions={<Button>Action</Button>}
          />
          {/* Page content */}
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}
```

### Navigation Routes Format

```javascript
const routes = [
  {
    title: 'Main',  // Section title (optional)
    items: [
      { 
        key: 'dashboard', 
        name: 'Dashboard', 
        route: '/dashboard',
        icon: <DashboardIcon />,
        badge: '5',      // Optional badge
        hidden: false,   // Hide from nav
      },
    ],
  },
];
```

### Grid Utilities

```jsx
// Stats grid (responsive 4-column)
<div className="stats-grid">
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
</div>

// Content grid
<div className="content-grid content-grid--2">
  <Card>Left</Card>
  <Card>Right</Card>
</div>
```

---

## Migration Guide

### From Material Dashboard

#### Step 1: Import Global Styles

Add to your main entry file (index.js or App.js):

```javascript
import './design-system/styles/globals.css';
```

#### Step 2: Replace Components Gradually

| Old (Material) | New (Design System) |
|----------------|---------------------|
| `<MDBox>` | `<div>` with CSS classes |
| `<MDButton>` | `<Button>` |
| `<MDTypography>` | `<h1-h6>`, `<p>`, `<span>` with CSS |
| `<MDInput>` | `<Input>` |
| `<Card>` (MUI) | `<Card>` (design system) |
| `<Grid>` (MUI) | CSS Grid classes |
| `<Sidenav>` | `<Sidebar>` |
| `<DashboardLayout>` | `<AppLayout>` + `<MainContent>` |

#### Step 3: Update Theme Context

Replace:
```javascript
// Old
import { useMaterialUIController } from "context";
```

With:
```javascript
// New
import { useSidebar } from '@/design-system/components';
```

#### Step 4: Remove MUI Dependencies (Optional)

Once migration is complete:

```bash
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
```

---

## Best Practices

### 1. Use Semantic Colors

```jsx
// ❌ Avoid
<div style={{ color: '#18181B' }}>

// ✅ Prefer
<div className="text-primary">
// or use CSS custom properties
<div style={{ color: 'var(--text-primary)' }}>
```

### 2. Use CSS Classes Over Inline Styles

```jsx
// ❌ Avoid
<div style={{ padding: 24, marginBottom: 32 }}>

// ✅ Prefer
<div className="p-6 mb-8">
```

### 3. Leverage Component Composition

```jsx
// ❌ Avoid
<div className="custom-card">
  <h3 className="custom-title">Title</h3>
  <p className="custom-desc">Description</p>
</div>

// ✅ Prefer
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
</Card>
```

### 4. Dark Mode Support

All components automatically support dark mode. Enable via:

```javascript
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Or in React
const [theme, setTheme] = useState('light');
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

### 5. Accessibility

- All interactive elements have focus states
- Use `aria-label` for icon-only buttons
- Ensure color contrast ratios meet WCAG 2.1 AA
- Support keyboard navigation

```jsx
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>
```

---

## CSS Custom Properties Reference

```css
/* Colors */
--bg-primary: #FFFFFF;
--bg-secondary: #FAFAFA;
--text-primary: #18181B;
--text-secondary: #52525B;
--border-default: #E4E4E7;
--color-brand-500: #06B6D4;

/* Spacing */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Layout */
--sidebar-width: 260px;
--sidebar-collapsed: 72px;
--header-height: 64px;

/* Shadows */
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
--shadow-focus: 0 0 0 3px rgba(6, 182, 212, 0.4);
```

---

## File Size Comparison

| Item | Material Dashboard | New Design System |
|------|-------------------|-------------------|
| Components CSS | ~150KB | ~25KB |
| Components JS | ~300KB (MUI) | ~15KB |
| Total Dependencies | ~2MB | ~100KB |

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## Questions?

This design system is built for:
- Enterprise dashboards
- Admin panels
- Business applications
- Data-heavy interfaces

It prioritizes:
- Performance
- Accessibility
- Developer experience
- Visual consistency
