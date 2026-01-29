/**
 * Design System Components - Central Export
 * 
 * Import all components from this single entry point.
 * 
 * Usage:
 * import { Button, Card, Input, Table, Sidebar } from '@/design-system/components';
 */

// Button
export { default as Button } from './Button';
export { Button as ButtonComponent } from './Button';

// Card
export { 
  default as Card,
  StatCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

// Input
export { 
  default as Input,
  Input as InputComponent,
  Textarea,
  Select,
} from './Input';

// Table
export { default as Table } from './Table';

// Modal
export { default as Modal } from './Modal';

// Badge
export { default as Badge } from './Badge';

// Layout
export {
  Sidebar,
  SidebarProvider,
  useSidebar,
  AppLayout,
  MainContent,
  PageHeader,
  PageContent,
  TopNav,
  SearchInput,
  Breadcrumbs,
  BreadcrumbItem,
} from './Layout';
