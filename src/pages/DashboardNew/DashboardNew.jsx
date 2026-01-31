/**
 * Dashboard Page - Premium Design
 * 
 * Modern, professional dashboard with real-time data.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { apiCall } from '../../utils/auth';
import { cachedApiCall } from '../../utils/cachedApiCall';
import { formatDate } from '../../utils/dateFormatter';

// Design System Components
import {
  AppLayout,
  MainContent,
  MobileHeader,
  PageHeader,
  Sidebar,
  SidebarProvider,
  UserProfile,
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
  Note: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
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
      { key: 'notes', name: 'Notes', route: '/notes', icon: <Icons.Note /> },
    ],
  },
];

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
  const [firms, setFirms] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    firmId: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  // Fetch data (with forceRefresh option to get latest data)
  const fetchData = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      // Force refresh to get latest data (bypasses cache)
      const cacheOptions = forceRefresh ? { forceRefresh: true } : {};

      // Fetch firms list first (for enrichment)
      const firmsResponse = await cachedApiCall('/firm', {}, cacheOptions);
      let firmsList = [];
      if (firmsResponse.ok) {
        firmsList = await firmsResponse.json();
        setFirms(firmsList);
      }

      // Fetch vehicles list (for enrichment)
      const vehiclesResponse = await cachedApiCall('/vehicle', {}, cacheOptions);
      let vehiclesList = [];
      if (vehiclesResponse.ok) {
        vehiclesList = await vehiclesResponse.json();
        setVehicles(vehiclesList);
      }

      // Fetch firms count
      const firmResponse = await cachedApiCall('/firm/count/total', {}, cacheOptions);
      if (firmResponse.ok) {
        const data = await firmResponse.json();
        setStats(prev => ({ ...prev, totalFirms: data.totalFirms || 0 }));
      }

      // Fetch today's stats
      const todayResponse = await cachedApiCall('/transaction/today/total', {}, cacheOptions);
      if (todayResponse.ok) {
        const data = await todayResponse.json();
        setStats(prev => ({
          ...prev,
          todayRevenue: Number(data.totalAmount || 0),
          totalTransactions: data.transactionCount || 0,
        }));
      }

      // Fetch today's tonnage
      const tonnageResponse = await cachedApiCall('/transaction/total-ton/today', {}, cacheOptions);
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
      const transResponse = await cachedApiCall('/transaction/all', {}, cacheOptions);
      if (transResponse.ok) {
        const data = await transResponse.json();

        // Enrich transactions with firm and vehicle names
        const enrichedTransactions = data.map(transaction => {
          const firm = firmsList.find(f => f.FirmID === transaction.FirmID);
          const vehicle = vehiclesList.find(v => v.VehicleID === transaction.VehicleID);

          return {
            ...transaction,
            Firm: transaction.Firm || (firm ? { FirmName: firm.FirmName, FirmID: firm.FirmID } : null),
            Vehicle: transaction.Vehicle || (vehicle ? { VehicleNo: vehicle.VehicleNo, VehicleID: vehicle.VehicleID } : null)
          };
        });

        // Sort by date (most recent first) and store all transactions
        const sortedTransactions = enrichedTransactions.sort((a, b) =>
          new Date(b.TransactionDate) - new Date(a.TransactionDate)
        );
        setRecentTransactions(sortedTransactions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter transactions
  const filteredTransactions = recentTransactions.filter((t) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        t.Firm?.FirmName?.toLowerCase().includes(searchLower) ||
        t.Vehicle?.VehicleNo?.toLowerCase().includes(searchLower) ||
        String(t.RoNumber || '').toLowerCase().includes(searchLower) ||
        String(t.TransactionID || '').includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.firmId) {
      if (String(t.FirmID) !== filters.firmId) return false;
    }

    if (filters.startDate) {
      const transDate = new Date(t.TransactionDate);
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (transDate < startDate) return false;
    }

    if (filters.endDate) {
      const transDate = new Date(t.TransactionDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (transDate > endDate) return false;
    }

    return true;
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    setFilters({ firmId: '', startDate: '', endDate: '', search: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.search || filters.firmId || filters.startDate || filters.endDate;

  useEffect(() => {
    // Force refresh on initial load to get latest data
    fetchData(true);

    // Auto-refresh every 5 minutes with cache bypass
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);

    // Listen for page visibility changes to refresh when user comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the page, fetch fresh data
        fetchData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.firmId, filters.startDate, filters.endDate, filters.search]);

  return (
    <SidebarProvider>
      <AppLayout>
        <MobileHeader
          brand="Jay GuruDev"
          brandIcon={<Icons.Business />}
        />
        <Sidebar
          brand="Jay GuruDev"
          brandIcon={<Icons.Business />}
          routes={navigationRoutes}
          footer={<UserProfile />}
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
                  <p className="dashboard-card__subtitle">
                    {hasActiveFilters
                      ? `${filteredTransactions.length} filtered transaction${filteredTransactions.length !== 1 ? 's' : ''}`
                      : 'Latest business activity'
                    }
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    className={`dashboard-filter-toggle ${showFilters ? 'dashboard-filter-toggle--active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                    title="Toggle filters"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                    {hasActiveFilters && <span className="dashboard-filter-badge"></span>}
                  </button>
                  <button
                    className="dashboard-card__link"
                    onClick={() => navigate('/transactions')}
                  >
                    View All <Icons.ArrowRight />
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <div className="dashboard-filters">
                  <div className="dashboard-filters__row">
                    <div className="dashboard-filter-field">
                      <label>Search</label>
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                    <div className="dashboard-filter-field">
                      <label>Firm</label>
                      <select
                        value={filters.firmId}
                        onChange={(e) => setFilters(prev => ({ ...prev, firmId: e.target.value }))}
                      >
                        <option value="">All Firms</option>
                        {firms.map(firm => (
                          <option key={firm.FirmID} value={firm.FirmID}>{firm.FirmName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="dashboard-filter-field">
                      <label>From Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="dashboard-filter-field">
                      <label>To Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <button className="dashboard-filters__clear" onClick={clearFilters}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Clear Filters
                    </button>
                  )}
                </div>
              )}

              <div className="dashboard-card__body">
                {currentTransactions.length > 0 ? (
                  <>
                    <div className="transaction-list">
                      {currentTransactions.map((t) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="dashboard-pagination">
                        <button
                          className="dashboard-pagination__btn"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>

                        <div className="dashboard-pagination__pages">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              className={`dashboard-pagination__page ${currentPage === page ? 'dashboard-pagination__page--active' : ''}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          className="dashboard-pagination__btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>

                        <span className="dashboard-pagination__info">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="dashboard-empty">
                    <Icons.Receipt />
                    <p>{hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => hasActiveFilters ? clearFilters() : navigate('/transactions/new')}
                    >
                      {hasActiveFilters ? 'Clear Filters' : 'Create First Transaction'}
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

                  <button className="quick-action" onClick={() => navigate('/notes', { state: { openCreate: true } })}>
                    <div className="quick-action__icon quick-action__icon--neutral">
                      <Icons.Note />
                    </div>
                    <span className="quick-action__label">Create Note</span>
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
