/**
 * Vehicles Management Page
 * 
 * Redesigned using the new design system.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { apiCall } from '../../utils/auth';

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
import { Input } from '../../design-system/components/Input';
import Table from '../../design-system/components/Table';
import Modal from '../../design-system/components/Modal';
import Badge from '../../design-system/components/Badge';

// Icons
import {
  DashboardIcon,
  BusinessIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './Vehicles.css';

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

function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNo: '',
    driverNumber: '',
    ownerName: '',
    firmId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch vehicles
  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('/vehicle');
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((vehicle) => ({
          id: vehicle.VehicleID,
          vehicleNo: vehicle.VehicleNo,
          driverNumber: vehicle.DriverNumber,
          ownerName: vehicle.OwnerName,
          firmId: vehicle.FirmID,
          firmName: vehicle.Firm?.FirmName || '-',
        }));
        setVehicles(transformedData);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch firms for dropdown
  const fetchFirms = async () => {
    try {
      const response = await apiCall('/firm');
      if (response.ok) {
        const data = await response.json();
        setFirms(data.map(f => ({ id: f.FirmID, name: f.FirmName })));
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchFirms();
  }, []);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.firmName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add/edit
  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vehicleNo: vehicle.vehicleNo || '',
        driverNumber: vehicle.driverNumber || '',
        ownerName: vehicle.ownerName || '',
        firmId: vehicle.firmId?.toString() || '',
      });
    } else {
      setEditingVehicle(null);
      setFormData({ vehicleNo: '', driverNumber: '', ownerName: '', firmId: '' });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firmId) {
      errors.firmId = 'Please select a firm';
    }
    
    if (!formData.vehicleNo || formData.vehicleNo.trim() === '') {
      errors.vehicleNo = 'Vehicle number is required';
    }
    
    if (!formData.ownerName || formData.ownerName.trim() === '') {
      errors.ownerName = 'Owner name is required';
    }
    
    if (!formData.driverNumber || formData.driverNumber.trim() === '') {
      errors.driverNumber = 'Driver phone is required';
    } else if (!/^\d{10}$/.test(formData.driverNumber.trim())) {
      errors.driverNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = editingVehicle
        ? `/vehicle/${editingVehicle.id}`
        : '/vehicle';

      const response = await apiCall(endpoint, {
        method: editingVehicle ? 'PUT' : 'POST',
        body: JSON.stringify({
          FirmId: parseInt(formData.firmId),
          VehicleNo: formData.vehicleNo.trim(),
          DriverNumber: formData.driverNumber.trim(),
          OwnerName: formData.ownerName.trim(),
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchVehicles();
        // Reset form
        setFormData({ vehicleNo: '', driverNumber: '', ownerName: '', firmId: '' });
        setFormErrors({});
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save vehicle');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await apiCall(`/vehicle/${vehicleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchVehicles();
        } else {
          alert('Failed to delete vehicle');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  // Table columns
  const columns = [
    {
      key: 'vehicleNo',
      label: 'Vehicle Number',
      sortable: true,
      render: (value, row) => (
        <div className="vehicle-cell">
          <div className="vehicle-cell__avatar">
            <VehicleIcon size={20} />
          </div>
          <div className="vehicle-cell__info">
            <span className="vehicle-cell__number">{value}</span>
            <span className="vehicle-cell__id">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Owner',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'driverNumber',
      label: 'Driver Phone',
      render: (value) => value || '-',
    },
    {
      key: 'firmName',
      label: 'Firm',
      sortable: true,
      render: (value) => value ? (
        <Badge variant="default">{value}</Badge>
      ) : (
        <span className="text-muted">-</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="table-actions">
          <button
            className="table-action table-action--edit"
            onClick={() => handleOpenModal(row)}
            title="Edit vehicle"
          >
            <EditIcon size={16} />
          </button>
          <button
            className="table-action table-action--delete"
            onClick={() => handleDelete(row.id)}
            title="Delete vehicle"
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
            title="Vehicles Management"
            subtitle="Manage your fleet and vehicle registrations"
            actions={
              <Button
                variant="primary"
                leftIcon={<PlusIcon size={18} />}
                onClick={() => handleOpenModal()}
              >
                Add Vehicle
              </Button>
            }
          />

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              icon={<VehicleIcon size={24} />}
              iconColor="violet"
              title="Total Vehicles"
              value={vehicles.length}
              subtitle="Registered vehicles"
            />
          </div>

          {/* Main Card */}
          <Card className="vehicles-table-card">
            {/* Search */}
            <div className="vehicles-table-card__header">
              <div className="search-wrapper">
                <SearchIcon size={18} className="search-wrapper__icon" />
                <input
                  type="text"
                  className="search-wrapper__input"
                  placeholder="Search vehicles by number or firm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {filteredVehicles.length > 0 ? (
              <Table
                columns={columns}
                data={filteredVehicles}
                pagination
                pageSize={10}
              />
            ) : (
              <div className="empty-state">
                <VehicleIcon size={64} className="empty-state__icon" />
                <h3 className="empty-state__title">No vehicles found</h3>
                <p className="empty-state__description">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Get started by adding your first vehicle'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon size={18} />}
                    onClick={() => handleOpenModal()}
                  >
                    Add Your First Vehicle
                  </Button>
                )}
              </div>
            )}
          </Card>
        </MainContent>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={null}
          description={null}
          showCloseButton={false}
          size="lg"
          className="modal-premium"
          footer={
            <div className="modal-premium__actions">
              <Button 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)} 
                className="modal-premium__btn-cancel"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave} 
                className="modal-premium__btn-submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="btn-spinner"></span>
                    {editingVehicle ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </>
                )}
              </Button>
            </div>
          }
        >
          {/* Custom Header */}
          <div className="modal-premium__header">
            <div className="modal-premium__header-content">
              <div className="modal-premium__header-icon">
                <VehicleIcon size={24} />
              </div>
              <div className="modal-premium__header-text">
                <h2 className="modal-premium__title">{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                <p className="modal-premium__subtitle">
                  {editingVehicle ? 'Update vehicle information' : 'Register a new vehicle'}
                </p>
              </div>
            </div>
            <button
              className="modal-premium__close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
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
              <span>All fields are required. Please ensure accurate information for proper vehicle registration.</span>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label className="input__label">
                  <BusinessIcon size={14} />
                  Firm <span className="required">*</span>
                </label>
                <div className={`input__container input__container--with-icon ${formErrors.firmId ? 'input__container--error' : ''}`}>
                  <div className="input__icon">
                    <BusinessIcon size={18} />
                  </div>
                  <select
                    className="input__field input__field--with-icon"
                    value={formData.firmId}
                    onChange={(e) => {
                      setFormData({ ...formData, firmId: e.target.value });
                      setFormErrors({ ...formErrors, firmId: '' });
                    }}
                    disabled={isSaving}
                  >
                    <option value="">Select a firm</option>
                    {firms.map((firm) => (
                      <option key={firm.id} value={firm.id}>
                        {firm.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.firmId && (
                  <span className="input__error">{formErrors.firmId}</span>
                )}
              </div>
              
              <div className="input-group">
                <label className="input__label">
                  <VehicleIcon size={14} />
                  Vehicle Number <span className="required">*</span>
                </label>
                <div className={`input__container input__container--with-icon ${formErrors.vehicleNo ? 'input__container--error' : ''}`}>
                  <div className="input__icon">
                    <VehicleIcon size={18} />
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="e.g., GJ01AB1234"
                    value={formData.vehicleNo}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() });
                      setFormErrors({ ...formErrors, vehicleNo: '' });
                    }}
                    disabled={isSaving}
                  />
                </div>
                {formErrors.vehicleNo && (
                  <span className="input__error">{formErrors.vehicleNo}</span>
                )}
              </div>
              
              <div className="input-group">
                <label className="input__label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Owner Name <span className="required">*</span>
                </label>
                <div className={`input__container input__container--with-icon ${formErrors.ownerName ? 'input__container--error' : ''}`}>
                  <div className="input__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="input__field input__field--with-icon"
                    placeholder="Vehicle owner's full name"
                    value={formData.ownerName}
                    onChange={(e) => {
                      setFormData({ ...formData, ownerName: e.target.value });
                      setFormErrors({ ...formErrors, ownerName: '' });
                    }}
                    disabled={isSaving}
                  />
                </div>
                {formErrors.ownerName && (
                  <span className="input__error">{formErrors.ownerName}</span>
                )}
              </div>
              
              <div className="input-group">
                <label className="input__label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Driver Phone <span className="required">*</span>
                </label>
                <div className={`input__container input__container--with-icon ${formErrors.driverNumber ? 'input__container--error' : ''}`}>
                  <div className="input__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    className="input__field input__field--with-icon"
                    placeholder="10-digit mobile number"
                    value={formData.driverNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, driverNumber: value });
                      setFormErrors({ ...formErrors, driverNumber: '' });
                    }}
                    disabled={isSaving}
                  />
                </div>
                {formErrors.driverNumber && (
                  <span className="input__error">{formErrors.driverNumber}</span>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="form-security-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              
            </div>
          </div>
        </Modal>
      </AppLayout>
    </SidebarProvider>
  );
}

export default Vehicles;
