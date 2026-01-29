/**
 * Dashboard Page - Premium Design
 * 
 * Modern, professional dashboard with real-time data.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';

// Design System Components
import {
  AppLayout,
  MainContent,
  PageHeader,
  Sidebar,
  SidebarProvider,
} from '../../design-system/components/Layout';
import Button from '../../design-system/components/Button';

// Styles
import '../../design-system/styles/globals.css';
import './DashboardNew.css';

// Icons
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Business: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-4m-14 4H3m2 0v-4m0-5h14M5 7h14M5 11h14" />
    </svg>
  ),
  Vehicle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9" />
    </svg>
  ),
  Payment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  Receipt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  TrendDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-7-7l7 7-7 7" />
    </svg>
  ),
};

// Navigation routes
const navigationRoutes = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', name: 'Dashboard', route: '/dashboard', icon: <Icons.Dashboard /> },
      { key: 'firms', name: 'Firms', route: '/firms', icon: <Icons.Business /> },
      { key: 'vehicles', name: 'Vehicles', route: '/vehicles', icon: <Icons.Vehicle /> },
    ],
  },
  {
    title: 'Business',
    items: [
      { key: 'pricing', name: 'Pricing', route: '/pricing', icon: <Icons.Payment /> },
      { key: 'transactions', name: 'Transactions', route: '/transactions', icon: <Icons.Receipt /> },
    ],
  },
];

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + `, ${time}`;
};

function DashboardNew() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFirms: 0,
    todayTonnage: 0,
    todayRevenue: 0,
    totalTransactions: 0,
    roTon: 0,
    openTon: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch firms count
      const firmResponse = await fetch(API.FIRM.COUNT_TOTAL);
      if (firmResponse.ok) {
        const data = await firmResponse.json();
        setStats(prev => ({ ...prev, totalFirms: data.totalFirms || 0 }));
      }

      // Fetch today's stats
      const todayResponse = await fetch(API.TRANSACTION.TODAY_TOTAL);
      if (todayResponse.ok) {
        const data = await todayResponse.json();
        setStats(prev => ({ 
          ...prev, 
          todayRevenue: Number(data.totalAmount || 0),
          totalTransactions: data.transactionCount || 0,
        }));
      }

      // Fetch today's tonnage
      const tonnageResponse = await fetch(API.TRANSACTION.TOTAL_TON_TODAY);
      if (tonnageResponse.ok) {
        const data = await tonnageResponse.json();
        setStats(prev => ({ 
          ...prev, 
          todayTonnage: Number(data.totalTon || 0),
          roTon: Number(data.roTon || 0),
          openTon: Number(data.openTon || 0),
        }));
      }

      // Fetch recent transactions
      const transResponse = await fetch(API.TRANSACTION.GET_ALL);
      if (transResponse.ok) {
        const data = await transResponse.json();
        setRecentTransactions(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <AppLayout>
        <Sidebar
          brand="Business Manager"
          brandIcon={<Icons.Business />}
          routes={navigationRoutes}
        />

        <MainContent>
          {/* Hero Header */}
          <div className="dashboard-hero">
            <div className="dashboard-hero__content">
              <h1 className="dashboard-hero__title">Dashboard</h1>
              <p className="dashboard-hero__subtitle">
                Welcome back! Here&apos;s what&apos;s happening with your business today.
              </p>
            </div>
            <div className="dashboard-hero__actions">
              <button 
                className={`dashboard-hero__refresh ${isRefreshing ? 'dashboard-hero__refresh--spinning' : ''}`}
                onClick={fetchData}
                title="Refresh data"
              >
                <Icons.Refresh />
              </button>
              <Button
                variant="primary"
                leftIcon={<Icons.Plus />}
                onClick={() => navigate('/transactions/new')}
              >
                New Transaction
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats">
            <div className="stat-card stat-card--brand">
              <div className="stat-card__icon">
                <Icons.Business />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value">{stats.totalFirms}</span>
                <span className="stat-card__label">Total Firms</span>
              </div>
              <div className="stat-card__badge">
                <Icons.TrendUp />
                <span>Active</span>
              </div>
            </div>

            <div className="stat-card stat-card--violet">
              <div className="stat-card__icon">
                <Icons.Vehicle />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value">{stats.todayTonnage.toFixed(2)}</span>
                <span className="stat-card__label">Today&apos;s Tonnage (T)</span>
              </div>
              <div className="stat-card__breakdown">
                <span>RO: {stats.roTon.toFixed(2)} T</span>
                <span>Open: {stats.openTon.toFixed(2)} T</span>
              </div>
            </div>

            <div className="stat-card stat-card--success">
              <div className="stat-card__icon">
                <Icons.Payment />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value">₹{stats.todayRevenue.toLocaleString('en-IN')}</span>
                <span className="stat-card__label">Today&apos;s Revenue</span>
              </div>
            </div>

            <div className="stat-card stat-card--warning">
              <div className="stat-card__icon">
                <Icons.Receipt />
              </div>
              <div className="stat-card__content">
                <span className="stat-card__value">{stats.totalTransactions}</span>
                <span className="stat-card__label">Today&apos;s Transactions</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="dashboard-grid">
            {/* Recent Transactions */}
            <div className="dashboard-card dashboard-card--transactions">
              <div className="dashboard-card__header">
                <div>
                  <h2 className="dashboard-card__title">Recent Transactions</h2>
                  <p className="dashboard-card__subtitle">Latest business activity</p>
                </div>
                <button 
                  className="dashboard-card__link"
                  onClick={() => navigate('/transactions')}
                >
                  View All <Icons.ArrowRight />
                </button>
              </div>

              <div className="dashboard-card__body">
                {recentTransactions.length > 0 ? (
                  <div className="transaction-list">
                    {recentTransactions.map((t) => (
                      <div key={t.TransactionID} className="transaction-item">
                        <div className="transaction-item__avatar">
                          <Icons.Receipt />
                        </div>
                        <div className="transaction-item__info">
                          <span className="transaction-item__firm">{t.Firm?.FirmName || 'Unknown'}</span>
                          <span className="transaction-item__details">
                            {t.Vehicle?.VehicleNo || '-'} • {Number(t.TotalTon || 0).toFixed(2)} T
                          </span>
                        </div>
                        <div className="transaction-item__amount">
                          <span className="transaction-item__price">₹{Number(t.TotalPrice || 0).toLocaleString('en-IN')}</span>
                          <span className="transaction-item__date">{formatDate(t.TransactionDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dashboard-empty">
                    <Icons.Receipt />
                    <p>No transactions yet</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/transactions/new')}
                    >
                      Create First Transaction
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card dashboard-card--actions">
              <div className="dashboard-card__header">
                <div>
                  <h2 className="dashboard-card__title">Quick Actions</h2>
                  <p className="dashboard-card__subtitle">Common tasks</p>
                </div>
              </div>

              <div className="dashboard-card__body">
                <div className="quick-actions">
                  <button className="quick-action" onClick={() => navigate('/transactions/new')}>
                    <div className="quick-action__icon quick-action__icon--brand">
                      <Icons.Plus />
                    </div>
                    <span className="quick-action__label">New Transaction</span>
                  </button>

                  <button className="quick-action" onClick={() => navigate('/firms/create')}>
                    <div className="quick-action__icon quick-action__icon--violet">
                      <Icons.Business />
                    </div>
                    <span className="quick-action__label">Add Firm</span>
                  </button>

                  <button className="quick-action" onClick={() => navigate('/vehicles')}>
                    <div className="quick-action__icon quick-action__icon--success">
                      <Icons.Vehicle />
                    </div>
                    <span className="quick-action__label">Add Vehicle</span>
                  </button>

                  <button className="quick-action" onClick={() => navigate('/pricing/add/new')}>
                    <div className="quick-action__icon quick-action__icon--warning">
                      <Icons.Payment />
                    </div>
                    <span className="quick-action__label">Set Pricing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="dashboard-cta">
            <div className="dashboard-cta__content">
              <h3 className="dashboard-cta__title">Ready to record a new transaction?</h3>
              <p className="dashboard-cta__description">
                Keep your business records up to date with quick transaction entry.
              </p>
            </div>
            <Button
              variant="secondary"
              leftIcon={<Icons.Plus />}
              onClick={() => navigate('/transactions/new')}
            >
              New Transaction
            </Button>
          </div>
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default DashboardNew;
