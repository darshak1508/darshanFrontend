/**
 * New Routes Configuration
 * 
 * Using the new design system pages.
 * All pages use the new design system - no Material Dashboard dependencies.
 */

import React from 'react';

// New Design System Pages
import DashboardNew from './pages/DashboardNew';
import Firms from './pages/Firms';
import CreateFirm from './pages/CreateFirm';
import Vehicles from './pages/Vehicles';
import Pricing from './pages/Pricing';
import PriceEdit from './pages/Pricing/PriceEdit';
import Transactions from './pages/Transactions';
import TransactionForm from './pages/Transactions/TransactionForm';
import Notes from './pages/Notes/Notes';

// Authentication Pages
import { Login, Register } from './pages/Auth';

// Icons
import {
  DashboardIcon,
  BusinessIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
  NoteIcon,
} from './design-system/icons';

const routes = [
  // Authentication Routes (public)
  {
    type: 'auth',
    name: 'Login',
    key: 'login',
    route: '/login',
    component: <Login />,
    public: true,
  },
  {
    type: 'auth',
    name: 'Register',
    key: 'register',
    route: '/register',
    component: <Register />,
    public: true,
  },
  // Protected Routes
  {
    type: 'collapse',
    name: 'Dashboard',
    key: 'dashboard',
    icon: <DashboardIcon size={18} />,
    route: '/dashboard',
    component: <DashboardNew />,
  },
  {
    type: 'collapse',
    name: 'Firms',
    key: 'firms',
    icon: <BusinessIcon size={18} />,
    route: '/firms',
    component: <Firms />,
  },
  {
    type: 'collapse',
    name: 'Create Firm',
    key: 'create-firm',
    icon: <BusinessIcon size={18} />,
    route: '/firms/create',
    component: <CreateFirm />,
    hidden: true,
  },
  {
    type: 'collapse',
    name: 'Vehicles',
    key: 'vehicles',
    icon: <VehicleIcon size={18} />,
    route: '/vehicles',
    component: <Vehicles />,
  },
  {
    type: 'collapse',
    name: 'Pricing',
    key: 'pricing',
    icon: <PaymentIcon size={18} />,
    route: '/pricing',
    component: <Pricing />,
  },
  {
    type: 'collapse',
    name: 'Edit Price',
    key: 'price-edit',
    icon: <PaymentIcon size={18} />,
    route: '/pricing/:firmId/edit',
    component: <PriceEdit />,
    hidden: true,
  },
  {
    type: 'collapse',
    name: 'Add Price',
    key: 'price-add',
    icon: <PaymentIcon size={18} />,
    route: '/pricing/add/:firmId',
    component: <PriceEdit />,
    hidden: true,
  },
  {
    type: 'collapse',
    name: 'Transactions',
    key: 'transactions',
    icon: <ReceiptIcon size={18} />,
    route: '/transactions',
    component: <Transactions />,
  },
  {
    type: 'collapse',
    name: 'New Transaction',
    key: 'new-transaction',
    icon: <ReceiptIcon size={18} />,
    route: '/transactions/new',
    component: <TransactionForm />,
    hidden: true,
  },
  {
    type: 'collapse',
    name: 'Notes',
    key: 'notes',
    icon: <NoteIcon size={18} />,
    route: '/notes',
    component: <Notes />,
  },
];

export default routes;
