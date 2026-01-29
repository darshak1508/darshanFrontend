/**
 * Create Firm Page
 * 
 * Fully redesigned using the new design system.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API Config
import API from '../../config/api';

// Design System Components
import {
  AppLayout,
  MainContent,
  Sidebar,
  SidebarProvider,
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
      const response = await fetch(API.FIRM.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          brand="Business Manager"
          brandIcon={<BusinessIcon size={20} />}
          routes={navigationRoutes}
        />

        <MainContent>
          {/* Back button */}
          <div className="create-firm__back">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeftIcon size={18} />}
              onClick={() => navigate('/firms')}
            >
              Back to Firms
            </Button>
          </div>

          {/* Form Card */}
          <div className="create-firm__container">
            <Card className="create-firm__card">
              {/* Header */}
              <div className="create-firm__header">
                <div className="create-firm__header-icon">
                  <BusinessIcon size={28} />
                </div>
                <div className="create-firm__header-text">
                  <h1 className="create-firm__title">Add New Firm</h1>
                  <p className="create-firm__subtitle">
                    Enter the details of your new business partner
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="alert alert--error">
                  <AlertCircleIcon size={20} />
                  <span>{error}</span>
                  <button className="alert__close" onClick={() => setError(null)}>×</button>
                </div>
              )}

              {success && (
                <div className="alert alert--success">
                  <CheckCircleIcon size={20} />
                  <span>Firm created successfully! Redirecting...</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="create-firm__form">
                <Input
                  label="Firm Name"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleChange}
                  required
                  placeholder="Enter firm name"
                  leftIcon={<BusinessIcon size={18} />}
                />

                <div className="form-row">
                  <Input
                    label="Contact Person"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                    leftIcon={<UserIcon size={18} />}
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    leftIcon={<PhoneIcon size={18} />}
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  leftIcon={<MailIcon size={18} />}
                />

                <Textarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows={3}
                />

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

                {/* Actions */}
                <div className="create-firm__actions">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/firms')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={!formData.firmName}
                  >
                    {isLoading ? 'Creating...' : 'Create Firm'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default CreateFirm;
