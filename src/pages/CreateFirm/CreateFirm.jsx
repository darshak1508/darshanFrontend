/**
 * Create Firm Page
 * 
 * Fully redesigned using the new design system.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { apiCall } from '../../utils/auth';

// Design System Components
import {
  AppLayout,
  MainContent,
  Sidebar,
  SidebarProvider,
  UserProfile,
  Breadcrumbs,
  BreadcrumbItem,
} from '../../design-system/components/Layout';
import { Card } from '../../design-system/components/Card';
import Button from '../../design-system/components/Button';
import { Input, Textarea } from '../../design-system/components/Input';

// Icons
import {
  BusinessIcon,
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  DashboardIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './CreateFirm.css';

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

function CreateFirm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firmName: '',
    contactPerson: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall('/firm', {
        method: 'POST',
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
        setSuccess(true);
        setTimeout(() => navigate('/firms'), 1500);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to create firm');
      }
    } catch (error) {
      console.error('Error creating firm:', error);
      setError('Error creating firm. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppLayout>
        <Sidebar
          brand="Jay GuruDev"
          brandIcon={<BusinessIcon size={20} />}
          routes={navigationRoutes}
          footer={<UserProfile />}
        />

        <MainContent>
          {/* Page Header */}
          <div className="create-firm__page-header">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeftIcon size={18} />}
              onClick={() => navigate('/firms')}
              className="create-firm__back-btn"
            >
              Back to Firms
            </Button>
          </div>

          {/* Form Container */}
          <div className="create-firm__container">
            <div className="create-firm__card">
              {/* Premium Header */}
              <div className="create-firm__header">
                <div className="create-firm__header-content">
                  <div className="create-firm__header-icon-wrapper">
                    <div className="create-firm__header-icon">
                      <BusinessIcon size={24} />
                    </div>
                  </div>
                  <div className="create-firm__header-text">
                    <h1 className="create-firm__title">Create Firm</h1>
                    <p className="create-firm__subtitle">
                      Add and manage business partners effortlessly
                    </p>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="create-firm__alert create-firm__alert--error">
                  <div className="create-firm__alert-icon">
                    <AlertCircleIcon size={20} />
                  </div>
                  <span className="create-firm__alert-message">{error}</span>
                  <button
                    className="create-firm__alert-close"
                    onClick={() => setError(null)}
                    aria-label="Close alert"
                  >
                    ×
                  </button>
                </div>
              )}

              {success && (
                <div className="create-firm__alert create-firm__alert--success">
                  <div className="create-firm__alert-icon">
                    <CheckCircleIcon size={20} />
                  </div>
                  <span className="create-firm__alert-message">
                    Firm created successfully! Redirecting...
                  </span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="create-firm__form">
                {/* Section: Basic Information */}
                <div className="create-firm__section">
                  <h3 className="create-firm__section-title">Basic Information</h3>
                  <div className="create-firm__fields">
                    <Input
                      label="Firm Name"
                      name="firmName"
                      value={formData.firmName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Acme Corporation"
                      leftIcon={<BusinessIcon size={18} />}
                    />
                  </div>
                </div>

                {/* Section: Contact Details */}
                <div className="create-firm__section">
                  <h3 className="create-firm__section-title">Contact Details</h3>
                  <div className="create-firm__fields">
                    <div className="create-firm__field-row">
                      <Input
                        label="Contact Person"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="e.g., John Doe"
                        leftIcon={<UserIcon size={18} />}
                      />
                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g., +1 234 567 8900"
                        leftIcon={<PhoneIcon size={18} />}
                      />
                    </div>

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., contact@acme.com"
                      leftIcon={<MailIcon size={18} />}
                    />
                  </div>
                </div>

                {/* Section: Location */}
                <div className="create-firm__section">
                  <h3 className="create-firm__section-title">Location</h3>
                  <div className="create-firm__fields">
                    <Textarea
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete street address"
                      rows={3}
                    />

                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., New York"
                      leftIcon={<MapPinIcon size={18} />}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="create-firm__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/firms')}
                    className="create-firm__action-btn create-firm__action-btn--cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={!formData.firmName || isLoading}
                    className="create-firm__action-btn create-firm__action-btn--submit"
                  >
                    {isLoading ? 'Creating Firm...' : 'Create Firm'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default CreateFirm;
