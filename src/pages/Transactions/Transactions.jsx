/**
 * Transactions Page - Premium Design
 * 
 * Professional transaction management interface with filtering and reports.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { apiCall } from '../../utils/auth';
import { cachedApiCall } from '../../utils/cachedApiCall';
import { formatDate, formatDateForInput } from '../../utils/dateFormatter';

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

// Icons
import {
  DashboardIcon,
  BusinessIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  NoteIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './Transactions.css';

// Custom Icons
const FilterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

const CalendarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClearIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DownloadIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FileIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Navigation routes
const navigationRoutes = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', name: 'Dashboard', route: '/dashboard', icon: <DashboardIcon size={18} /> },
      { key: 'firms', name: 'Firms', route: '/firms', icon: <BusinessIcon size={18} /> },
      { key: 'vehicles', name: 'Vehicles', route: '/vehicles', icon: <VehicleIcon size={18} /> },
    ],
  },
  {
    title: 'Business',
    items: [
      { key: 'pricing', name: 'Pricing', route: '/pricing', icon: <PaymentIcon size={18} /> },
      { key: 'transactions', name: 'Transactions', route: '/transactions', icon: <ReceiptIcon size={18} /> },
      { key: 'notes', name: 'Notes', route: '/notes', icon: <NoteIcon size={18} /> },
    ],
  },
];

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [firms, setFirms] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    firmId: '',
    startDate: '',
    endDate: '',
  });

  // Download/Report state
  const [reportSettings, setReportSettings] = useState({
    startDate: '',
    endDate: '',
    firmId: '',
    useCustomPricing: false,
    roTonPrice: '',
    openTonPrice: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    filtered: 0,
    totalRevenue: 0,
    totalTonnage: 0,
  });

  // Edit modal state
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    FirmID: '',
    VehicleID: '',
    RoNumber: '',
    TotalTon: '',
    RoTon: '',
    TransactionDate: '',
  });
  const [vehicles, setVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch firms
  const fetchFirms = async () => {
    try {
      const response = await cachedApiCall('/firm');
      if (response.ok) {
        const data = await response.json();
        setFirms(data);
        return data; // Return firms data for immediate use
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
    }
    return [];
  };

  // Fetch all vehicles
  const fetchAllVehicles = async () => {
    try {
      const response = await cachedApiCall('/vehicle');
      if (response.ok) {
        const data = await response.json();
        setAllVehicles(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
    return [];
  };

  // Fetch vehicles by firm
  const fetchVehiclesByFirm = async (firmId) => {
    try {
      const response = await cachedApiCall(`/vehicle/byFirm/${firmId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data); // Changed from setFirmVehicles to setVehicles to match existing state
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Fetch transactions (with forceRefresh option)
  const fetchTransactions = async (firmsList = firms, vehiclesList = allVehicles, forceRefresh = false) => {
    setIsLoading(true);
    try {
      let url = '/transaction/all';
      if (filters.firmId) { // Changed from filters.firm to filters.firmId to match existing state
        url = `/transaction/by-firm/${filters.firmId}`;
      }

      const cacheOptions = forceRefresh ? { forceRefresh: true } : {};
      const response = await cachedApiCall(url, {}, cacheOptions);

      if (response.ok) {
        const data = await response.json();
        console.log('Transactions fetched:', data);

        // Enrich transactions with firm and vehicle names
        const enrichedTransactions = data.map(transaction => {
          // Find the firm name by matching FirmID
          const firm = firmsList.find(f => f.FirmID === transaction.FirmID);
          // Find the vehicle by matching VehicleID
          const vehicle = vehiclesList.find(v => v.VehicleID === transaction.VehicleID);

          return {
            ...transaction,
            // If Firm object doesn't exist, create it from the firms list
            Firm: transaction.Firm || (firm ? { FirmName: firm.FirmName, FirmID: firm.FirmID } : null),
            // If Vehicle object doesn't exist, create it from the vehicles list
            Vehicle: transaction.Vehicle || (vehicle ? { VehicleNo: vehicle.VehicleNo, VehicleID: vehicle.VehicleID } : null)
          };
        });

        setTransactions(enrichedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const firmsList = await fetchFirms(); // Wait for firms to load first
      const vehiclesList = await fetchAllVehicles(); // Wait for vehicles to load
      fetchTransactions(firmsList, vehiclesList, true); // Force refresh to get latest data
    };

    loadData();

    // Listen for page visibility changes to refresh when user comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the page, fetch fresh data
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
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

  // Calculate stats
  useEffect(() => {
    setStats({
      total: transactions.length,
      filtered: filteredTransactions.length,
      totalRevenue: filteredTransactions.reduce((sum, t) => sum + Number(t.TotalPrice || 0), 0),
      totalTonnage: filteredTransactions.reduce((sum, t) => sum + Number(t.TotalTon || 0), 0),
    });
  }, [transactions, filteredTransactions.length]);

  // Clear filters
  const clearFilters = () => {
    setFilters({ search: '', firmId: '', startDate: '', endDate: '' });
  };

  const hasActiveFilters = filters.search || filters.firmId || filters.startDate || filters.endDate;

  // Quick date filters
  const setQuickDateFilter = (type) => {
    const today = new Date();
    let startDate = '';
    let endDate = formatDateForInput(today);

    switch (type) {
      case 'today':
        startDate = formatDateForInput(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = formatDateForInput(yesterday);
        endDate = formatDateForInput(yesterday);
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = formatDateForInput(weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = formatDateForInput(monthAgo);
        break;
      default:
        break;
    }

    setFilters(prev => ({ ...prev, startDate, endDate }));
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      FirmID: transaction.FirmID,
      VehicleID: transaction.VehicleID,
      RoNumber: transaction.RoNumber || '',
      TotalTon: transaction.TotalTon || '',
      RoTon: transaction.RoTon || '',
      TransactionDate: formatDateForInput(transaction.TransactionDate),
    });
    fetchVehiclesByFirm(transaction.FirmID);
    setIsEditModalOpen(true); // Open the modal
  };

  // Update transaction
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData = {
        FirmID: parseInt(editForm.FirmID),
        VehicleID: parseInt(editForm.VehicleID),
        RoNumber: editForm.RoNumber,
        TotalTon: parseFloat(editForm.TotalTon),
        RoTon: parseFloat(editForm.RoTon),
        TransactionDate: editForm.TransactionDate,
      };

      const response = await apiCall(`/transaction/${editingTransaction.TransactionID}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setEditingTransaction(null);
        // Force refresh to get updated data
        fetchTransactions(firms, allVehicles, true);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete transaction
  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await apiCall(`/transaction/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Force refresh to get updated data
        fetchTransactions(firms, allVehicles, true);
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Download PDF report
  const handleDownloadPDF = async () => {
    if (!reportSettings.startDate || !reportSettings.endDate) {
      alert('Please select date range for the report');
      return;
    }

    try {
      let url = `${API.TRANSACTION.REPORT_PDF}?startDate=${reportSettings.startDate}&endDate=${reportSettings.endDate}`;

      if (reportSettings.firmId) {
        url += `&firmId=${reportSettings.firmId}`;
      }

      if (reportSettings.useCustomPricing && reportSettings.roTonPrice && reportSettings.openTonPrice) {
        url += `&roTonPrice=${reportSettings.roTonPrice}&openTonPrice=${reportSettings.openTonPrice}`;
      }

      // Fetch with authentication
      const response = await apiCall(url.replace(API.BASE_URL, ''), {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download PDF');
      }

      // Convert response to blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Transaction_Report_${reportSettings.startDate}_to_${reportSettings.endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(error.message || 'Failed to download PDF report');
    }
  };

  // Download Excel report
  const handleDownloadExcel = async () => {
    if (!reportSettings.startDate || !reportSettings.endDate) {
      alert('Please select date range for the report');
      return;
    }

    try {
      let url = `${API.TRANSACTION.REPORT_EXCEL}?startDate=${reportSettings.startDate}&endDate=${reportSettings.endDate}`;

      if (reportSettings.firmId) {
        url += `&firmId=${reportSettings.firmId}`;
      }

      // Fetch with authentication
      const response = await apiCall(url.replace(API.BASE_URL, ''), {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download Excel');
      }

      // Convert response to blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Transaction_Report_${reportSettings.startDate}_to_${reportSettings.endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert(error.message || 'Failed to download Excel report');
    }
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <MobileHeader
          brand="Jay GuruDev"
          brandIcon={<BusinessIcon size={20} />}
        />
        <Sidebar
          brand="Jay GuruDev"
          brandIcon={<BusinessIcon size={20} />}
          routes={navigationRoutes}
          footer={<UserProfile />}
        />

        <MainContent>
          <PageHeader
            title="Transactions"
            subtitle="View and manage all business transactions"
            actions={
              <div className="trans-header-actions">
                <Button
                  variant="ghost"
                  leftIcon={<DownloadIcon size={18} />}
                  onClick={() => setShowDownload(!showDownload)}
                >
                  Download Report
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<PlusIcon size={18} />}
                  onClick={() => navigate('/transactions/new')}
                >
                  New Transaction
                </Button>
              </div>
            }
          />

          {/* Download/Report Section */}
          {showDownload && (
            <div className="trans-download-section">
              <div className="trans-download-section__header">
                <div>
                  <h3><DownloadIcon size={20} /> Download Report</h3>
                  <p>Generate PDF or Excel reports with optional custom pricing</p>
                </div>
                <button
                  className="trans-download-section__close"
                  onClick={() => setShowDownload(false)}
                  title="Close"
                >
                  <ClearIcon size={20} />
                </button>
              </div>

              <div className="trans-download-section__body">
                <div className="trans-download-section__row">
                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <CalendarIcon size={16} /> From Date *
                    </label>
                    <input
                      type="date"
                      className="trans-filter-field__input"
                      value={reportSettings.startDate}
                      onChange={(e) => setReportSettings(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <CalendarIcon size={16} /> To Date *
                    </label>
                    <input
                      type="date"
                      className="trans-filter-field__input"
                      value={reportSettings.endDate}
                      onChange={(e) => setReportSettings(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>

                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <BusinessIcon size={16} /> Firm (Optional)
                    </label>
                    <select
                      className="trans-filter-field__select"
                      value={reportSettings.firmId}
                      onChange={(e) => setReportSettings(prev => ({ ...prev, firmId: e.target.value }))}
                    >
                      <option value="">All Firms</option>
                      {firms.map(firm => (
                        <option key={firm.FirmID} value={firm.FirmID}>{firm.FirmName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Pricing Section */}
                <div className="trans-custom-pricing">
                  <label className="trans-custom-pricing__toggle">
                    <input
                      type="checkbox"
                      checked={reportSettings.useCustomPricing}
                      onChange={(e) => setReportSettings(prev => ({ ...prev, useCustomPricing: e.target.checked }))}
                    />
                    <span>Use Custom Pricing for Report</span>
                  </label>

                  {reportSettings.useCustomPricing && (
                    <div className="trans-custom-pricing__fields">
                      <div className="trans-filter-field">
                        <label className="trans-filter-field__label">RO Ton Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="trans-filter-field__input"
                          placeholder="Enter custom RO price"
                          value={reportSettings.roTonPrice}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, roTonPrice: e.target.value }))}
                        />
                      </div>
                      <div className="trans-filter-field">
                        <label className="trans-filter-field__label">Over Ton Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="trans-filter-field__input"
                          placeholder="Enter custom Over price"
                          value={reportSettings.openTonPrice}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, openTonPrice: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Buttons */}
                <div className="trans-download-section__actions">
                  <button className="trans-download-btn trans-download-btn--pdf" onClick={handleDownloadPDF}>
                    <FileIcon size={18} />
                    Download PDF
                  </button>
                  <button className="trans-download-btn trans-download-btn--excel" onClick={handleDownloadExcel}>
                    <FileIcon size={18} />
                    Download Excel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="trans-stats">
            <div className="trans-stat-card">
              <div className="trans-stat-card__icon trans-stat-card__icon--brand">
                <ReceiptIcon size={24} />
              </div>
              <div className="trans-stat-card__content">
                <span className="trans-stat-card__value">
                  {stats.filtered}
                  {hasActiveFilters && <span className="trans-stat-card__of"> of {stats.total}</span>}
                </span>
                <span className="trans-stat-card__label">
                  {hasActiveFilters ? 'Filtered Transactions' : 'Total Transactions'}
                </span>
              </div>
            </div>

            <div className="trans-stat-card">
              <div className="trans-stat-card__icon trans-stat-card__icon--violet">
                <VehicleIcon size={24} />
              </div>
              <div className="trans-stat-card__content">
                <span className="trans-stat-card__value">{stats.totalTonnage.toFixed(2)} T</span>
                <span className="trans-stat-card__label">
                  {hasActiveFilters ? 'Filtered Tonnage' : 'Total Tonnage'}
                </span>
              </div>
            </div>

            <div className="trans-stat-card">
              <div className="trans-stat-card__icon trans-stat-card__icon--success">
                <PaymentIcon size={24} />
              </div>
              <div className="trans-stat-card__content">
                <span className="trans-stat-card__value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
                <span className="trans-stat-card__label">
                  {hasActiveFilters ? 'Filtered Revenue' : 'Total Revenue'}
                </span>
              </div>
            </div>

            <div className="trans-stat-card">
              <div className="trans-stat-card__icon trans-stat-card__icon--warning">
                <PaymentIcon size={24} />
              </div>
              <div className="trans-stat-card__content">
                <span className="trans-stat-card__value">
                  ₹{stats.filtered > 0 ? (stats.totalRevenue / stats.filtered).toFixed(0) : 0}
                </span>
                <span className="trans-stat-card__label">Avg. per Transaction</span>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="trans-filter-section">
            <div className="trans-toolbar">
              <div className="trans-search">
                <SearchIcon size={20} className="trans-search__icon" />
                <input
                  type="text"
                  className="trans-search__input"
                  placeholder="Search by firm, vehicle, RO number or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <button
                className={`trans-filter-toggle ${showFilters ? 'trans-filter-toggle--active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon size={18} />
                <span>Filters</span>
                {hasActiveFilters && <span className="trans-filter-toggle__badge"></span>}
              </button>
            </div>

            {showFilters && (
              <div className="trans-filters">
                <div className="trans-filters__row">
                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <BusinessIcon size={16} /> Firm
                    </label>
                    <select
                      className="trans-filter-field__select"
                      value={filters.firmId}
                      onChange={(e) => setFilters(prev => ({ ...prev, firmId: e.target.value }))}
                    >
                      <option value="">All Firms</option>
                      {firms.map(firm => (
                        <option key={firm.FirmID} value={firm.FirmID}>{firm.FirmName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <CalendarIcon size={16} /> From Date
                    </label>
                    <input
                      type="date"
                      className="trans-filter-field__input"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div className="trans-filter-field">
                    <label className="trans-filter-field__label">
                      <CalendarIcon size={16} /> To Date
                    </label>
                    <input
                      type="date"
                      className="trans-filter-field__input"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="trans-filters__quick">
                  <span className="trans-filters__quick-label">Quick:</span>
                  <button className="trans-filters__quick-btn" onClick={() => setQuickDateFilter('today')}>Today</button>
                  <button className="trans-filters__quick-btn" onClick={() => setQuickDateFilter('yesterday')}>Yesterday</button>
                  <button className="trans-filters__quick-btn" onClick={() => setQuickDateFilter('week')}>Last 7 Days</button>
                  <button className="trans-filters__quick-btn" onClick={() => setQuickDateFilter('month')}>Last 30 Days</button>

                  {hasActiveFilters && (
                    <button className="trans-filters__clear-btn" onClick={clearFilters}>
                      <ClearIcon size={14} /> Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <div className="trans-loading">
              <div className="trans-loading__spinner"></div>
              <span>Loading transactions...</span>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="trans-list">
              {filteredTransactions.map((t) => (
                <div key={t.TransactionID} className="trans-card">
                  <div className="trans-card__header">
                    <div className="trans-card__firm">
                      <div className="trans-card__firm-avatar">
                        <BusinessIcon size={20} />
                      </div>
                      <div className="trans-card__firm-info">
                        <h3 className="trans-card__firm-name">{t.Firm?.FirmName || 'Unknown Firm'}</h3>
                        <span className="trans-card__firm-id">ID: #{t.TransactionID}</span>
                      </div>
                    </div>
                    <div className="trans-card__header-right">
                      <div className="trans-card__date">{formatDate(t.TransactionDate)}</div>
                      <div className="trans-card__actions">
                        <button
                          className="trans-card__action trans-card__action--edit"
                          onClick={() => handleEdit(t)}
                          title="Edit transaction"
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          className="trans-card__action trans-card__action--delete"
                          onClick={() => handleDelete(t.TransactionID)}
                          title="Delete transaction"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="trans-card__body">
                    <div className="trans-card__row">
                      <div className="trans-card__detail">
                        <span className="trans-card__detail-label">Vehicle</span>
                        <span className="trans-card__detail-value">{t.Vehicle?.VehicleNo || '-'}</span>
                      </div>
                      <div className="trans-card__detail">
                        <span className="trans-card__detail-label">RO Number</span>
                        <span className="trans-card__detail-value">{t.RoNumber || '-'}</span>
                      </div>
                    </div>

                    <div className="trans-card__weights">
                      <div className="trans-card__weight">
                        <span className="trans-card__weight-label">Total</span>
                        <span className="trans-card__weight-value">{Number(t.TotalTon || 0).toFixed(2)} T</span>
                      </div>
                      <div className="trans-card__weight-divider"></div>
                      <div className="trans-card__weight">
                        <span className="trans-card__weight-label">RO Ton</span>
                        <span className="trans-card__weight-value trans-card__weight-value--ro">{Number(t.RoTon || 0).toFixed(2)} T</span>
                      </div>
                      <div className="trans-card__weight-divider"></div>
                      <div className="trans-card__weight">
                        <span className="trans-card__weight-label">Over Ton</span>
                        <span className="trans-card__weight-value trans-card__weight-value--open">{Number(t.OpenTon || 0).toFixed(2)} T</span>
                      </div>
                    </div>
                  </div>

                  <div className="trans-card__footer">
                    <span className="trans-card__footer-label">Total Amount</span>
                    <span className="trans-card__amount">₹{Number(t.TotalPrice || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="trans-empty">
              <div className="trans-empty__icon">
                <ReceiptIcon size={64} />
              </div>
              <h3 className="trans-empty__title">No transactions found</h3>
              <p className="trans-empty__description">
                {hasActiveFilters
                  ? 'No transactions match your filter criteria. Try adjusting your filters.'
                  : 'Get started by recording your first business transaction'}
              </p>
              {hasActiveFilters ? (
                <Button variant="ghost" leftIcon={<ClearIcon size={18} />} onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button variant="primary" leftIcon={<PlusIcon size={18} />} onClick={() => navigate('/transactions/new')}>
                  Create First Transaction
                </Button>
              )}
            </div>
          )}

          {/* Edit Modal */}
          {editingTransaction && (
            <div className="trans-modal-overlay" onClick={() => setEditingTransaction(null)}>
              <div className="trans-modal" onClick={(e) => e.stopPropagation()}>
                <div className="trans-modal__header">
                  <h2>Edit Transaction #{editingTransaction.TransactionID}</h2>
                  <button className="trans-modal__close" onClick={() => setEditingTransaction(null)}>
                    <ClearIcon size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdateTransaction} className="trans-modal__body">
                  <div className="trans-modal__row">
                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">Firm</label>
                      <select
                        className="trans-filter-field__select"
                        value={editForm.FirmID}
                        onChange={(e) => {
                          setEditForm(prev => ({ ...prev, FirmID: e.target.value, VehicleID: '' }));
                          fetchVehiclesByFirm(e.target.value);
                        }}
                        required
                      >
                        <option value="">Select Firm</option>
                        {firms.map(firm => (
                          <option key={firm.FirmID} value={firm.FirmID}>{firm.FirmName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">Vehicle</label>
                      <select
                        className="trans-filter-field__select"
                        value={editForm.VehicleID}
                        onChange={(e) => setEditForm(prev => ({ ...prev, VehicleID: e.target.value }))}
                        required
                      >
                        <option value="">Select Vehicle</option>
                        {vehicles.map(v => (
                          <option key={v.VehicleID} value={v.VehicleID}>{v.VehicleNo}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="trans-modal__row">
                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">RO Number</label>
                      <input
                        type="text"
                        className="trans-filter-field__input"
                        value={editForm.RoNumber}
                        onChange={(e) => setEditForm(prev => ({ ...prev, RoNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">Transaction Date</label>
                      <input
                        type="date"
                        className="trans-filter-field__input"
                        value={editForm.TransactionDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, TransactionDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="trans-modal__row">
                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">Total Ton</label>
                      <input
                        type="number"
                        step="0.01"
                        className="trans-filter-field__input"
                        value={editForm.TotalTon}
                        onChange={(e) => setEditForm(prev => ({ ...prev, TotalTon: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="trans-filter-field">
                      <label className="trans-filter-field__label">RO Ton</label>
                      <input
                        type="number"
                        step="0.01"
                        className="trans-filter-field__input"
                        value={editForm.RoTon}
                        onChange={(e) => setEditForm(prev => ({ ...prev, RoTon: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="trans-modal__footer">
                    <Button type="button" variant="ghost" onClick={() => setEditingTransaction(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                      Update Transaction
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default Transactions;
