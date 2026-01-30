/**
 * Firms Management Page
 * 
 * Fully redesigned using the new design system.
 * No Material UI dependencies.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { apiCall } from '../../utils/auth';
import { cachedApiCall } from '../../utils/cachedApiCall';

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
import { StatCard, Card } from '../../design-system/components/Card';
import Button from '../../design-system/components/Button';
import { Input, Select } from '../../design-system/components/Input';
import Table from '../../design-system/components/Table';
import Modal from '../../design-system/components/Modal';
import Badge from '../../design-system/components/Badge';

// Icons
import {
  BusinessIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  DashboardIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './Firms.css';

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
    ],
  },
];

function Firms() {
  const navigate = useNavigate();
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firmName: '',
    contactPerson: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
  });

  // Fetch firms
  const fetchFirms = async () => {
    setIsLoading(true);
    try {
      const response = await cachedApiCall('/firm');
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((firm) => ({
          id: firm.FirmID,
          firmName: firm.FirmName,
          contactPerson: firm.ContactPerson,
          address: firm.Address,
          city: firm.City,
          phoneNumber: firm.PhoneNumber,
          email: firm.Email,
        }));
        setFirms(transformedData);
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  // Filter firms
  const filteredFirms = firms.filter((firm) =>
    firm.firmName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    firm.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    firm.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit
  const handleEditClick = (firm) => {
    setEditingFirm(firm);
    setFormData({
      firmName: firm.firmName || '',
      contactPerson: firm.contactPerson || '',
      address: firm.address || '',
      city: firm.city || '',
      phoneNumber: firm.phoneNumber || '',
      email: firm.email || '',
    });
    setIsEditModalOpen(true);
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData.firmName.trim()) {
      alert('Firm name is required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiCall(`/firm/${editingFirm.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          FirmName: formData.firmName,
          ContactPerson: formData.contactPerson,
          Address: formData.address,
          City: formData.city,
          PhoneNumber: formData.phoneNumber,
          Email: formData.email,
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchFirms();
      } else {
        alert('Failed to update firm');
      }
    } catch (error) {
      console.error('Error updating firm:', error);
      alert('Error updating firm');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (firmId) => {
    if (window.confirm('Are you sure you want to delete this firm?')) {
      try {
        const response = await apiCall(`/firm/${firmId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchFirms();
        } else {
          alert('Failed to delete firm');
        }
      } catch (error) {
        console.error('Error deleting firm:', error);
      }
    }
  };

  // Table columns
  const columns = [
    {
      key: 'firmName',
      label: 'Firm',
      sortable: true,
      render: (value, row) => (
        <div className="firm-cell">
          <div className="firm-cell__avatar">
            <BusinessIcon size={20} />
          </div>
          <div className="firm-cell__info">
            <span className="firm-cell__name">{value}</span>
            <span className="firm-cell__id">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      render: (value) => value || '-',
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value ? (
        <span className="text-tertiary text-sm">{value}</span>
      ) : '-',
    },
    {
      key: 'city',
      label: 'City',
      render: (value) => value ? (
        <Badge variant="default">{value}</Badge>
      ) : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action table-action--edit"
            onClick={() => handleEditClick(row)}
            title="Edit firm"
          >
            <EditIcon size={16} />
          </button>
          <button
            className="table-action table-action--delete"
            onClick={() => handleDelete(row.id)}
            title="Delete firm"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

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
            title="Firms Management"
            subtitle="Manage your business partners and their information"
            actions={
              <Button
                variant="primary"
                leftIcon={<PlusIcon size={18} />}
                onClick={() => navigate('/firms/create')}
              >
                Add New Firm
              </Button>
            }
          />

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              icon={<BusinessIcon size={24} />}
              iconColor="brand"
              title="Total Firms"
              value={firms.length}
              subtitle="Active business partners"
            />
          </div>

          {/* Main Card */}
          <Card className="firms-table-card">
            {/* Search */}
            <div className="firms-table-card__header">
              <div className="search-wrapper">
                <SearchIcon size={18} className="search-wrapper__icon" />
                <input
                  type="text"
                  className="search-wrapper__input"
                  placeholder="Search firms by name, city, or contact person..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {filteredFirms.length > 0 ? (
              <Table
                columns={columns}
                data={filteredFirms}
                pagination
                pageSize={10}
              />
            ) : (
              <div className="empty-state">
                <BusinessIcon size={64} className="empty-state__icon" />
                <h3 className="empty-state__title">No firms found</h3>
                <p className="empty-state__description">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Get started by adding your first firm'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon size={18} />}
                    onClick={() => navigate('/firms/create')}
                  >
                    Add Your First Firm
                  </Button>
                )}
              </div>
            )}
          </Card>
        </MainContent>

        {/* Edit Modal - Premium Design */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={null}
          description={null}
          showCloseButton={false}
          size="lg"
          className="modal-premium"
          footer={
            <div className="modal-premium__actions">
              <Button
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
                className="modal-premium__btn-cancel"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdate}
                className="modal-premium__btn-submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Update Firm
                  </>
                )}
              </Button>
            </div>
          }
        >
          {/* Custom Premium Header */}
          <div className="modal-premium__header">
            <div className="modal-premium__header-content">
              <div className="modal-premium__header-icon">
                <BusinessIcon size={24} />
              </div>
              <div className="modal-premium__header-text">
                <h2 className="modal-premium__title">Edit Firm</h2>
                <p className="modal-premium__subtitle">Update business partner information</p>
              </div>
            </div>
            <button
              className="modal-premium__close"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Close modal"
              disabled={isSaving}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="modal-premium__content">
            {/* Info Banner */}
            <div className="form-info-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Update the information for this business partner. Firm name is required.</span>
            </div>

            <div className="form-grid">
              {/* Basic Information Section */}
              <div className="input-group">
                <label className="input__label">
                  <BusinessIcon size={14} />
                  Firm Name <span className="required">*</span>
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <BusinessIcon size={18} />
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="Enter firm name"
                    value={formData.firmName}
                    onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input__label">
                  <UserIcon size={14} />
                  Contact Person
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="Contact person name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="input-group">
                <label className="input__label">
                  <MapPinIcon size={14} />
                  Address
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <MapPinIcon size={18} />
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input__label">
                  <MapPinIcon size={14} />
                  City
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <MapPinIcon size={18} />
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="City name"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="input-group">
                <label className="input__label">
                  <PhoneIcon size={14} />
                  Phone Number
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <PhoneIcon size={18} />
                  </div>
                  <input
                    type="tel"
                    className="input__field input__field--with-icon"
                    placeholder="Contact phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input__label">
                  <MailIcon size={14} />
                  Email Address
                </label>
                <div className="input__container input__container--with-icon">
                  <div className="input__icon">
                    <MailIcon size={18} />
                  </div>
                  <input
                    type="email"
                    className="input__field input__field--with-icon"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </AppLayout>
    </SidebarProvider>
  );
}

export default Firms;
