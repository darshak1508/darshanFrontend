/**
 * Price Edit/Add Page
 * 
 * Premium pricing configuration interface.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import Button from '../../design-system/components/Button';

// Icons
import {
  DashboardIcon,
  BusinessIcon,
  VehicleIcon,
  PaymentIcon,
  ReceiptIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './PriceEdit.css';

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

function PriceEdit() {
  const navigate = useNavigate();
  const { firmId } = useParams();
  const isNew = firmId === 'new';

  const [firms, setFirms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPrice, setExistingPrice] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firmId: isNew ? '' : firmId,
    roTonPrice: '',
    openTonPrice: '',
  });

  // Fetch firms
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await apiCall('/firm');
        if (response.ok) {
          const data = await response.json();
          setFirms(data.map(f => ({ id: f.FirmID, name: f.FirmName })));
        }
      } catch (error) {
        console.error('Error fetchingfirms:', error);
      }
    };
    fetchFirms();
  }, []);

  // Fetch existing price if editing
  useEffect(() => {
    const fetchPrice = async () => {
      if (isNew || !firmId) return;

      try {
        const response = await apiCall('/pricing');
        if (response.ok) {
          const allPricing = await response.json();
          const data = allPricing.find(p => p.FirmID?.toString() === firmId);
          if (data) {
            setExistingPrice(data);
            setFormData({
              firmId: data.FirmID?.toString() || firmId,
              roTonPrice: data.RoTonPrice?.toString() || '',
              openTonPrice: data.OpenTonPrice?.toString() || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    fetchPrice();
  }, [firmId, isNew]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firmId || !formData.roTonPrice || !formData.openTonPrice) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = existingPrice
        ? `/pricing/${formData.firmId}`
        : `/pricing/${formData.firmId}`;

      const response = await apiCall(endpoint, {
        method: existingPrice ? 'PUT' : 'POST',
        body: JSON.stringify({
          RoTonPrice: parseFloat(formData.roTonPrice),
          OpenTonPrice: parseFloat(formData.openTonPrice),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/pricing'), 1500);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save pricing');
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Error saving pricing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFirm = firms.find(f => f.id.toString() === formData.firmId);

  // Calculate example
  const exampleTon = 10;
  const roPrice = parseFloat(formData.roTonPrice) || 0;
  const openPrice = parseFloat(formData.openTonPrice) || 0;
  const exampleRoTotal = exampleTon * roPrice;
  const exampleOpenTotal = exampleTon * openPrice;

  if (success) {
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
            <div className="price-success">
              <div className="price-success__icon">
                <CheckCircleIcon size={64} />
              </div>
              <h2 className="price-success__title">Pricing Saved Successfully!</h2>
              <p className="price-success__description">Redirecting to pricing list...</p>
            </div>
          </MainContent>
        </AppLayout>
      </SidebarProvider>
    );
  }

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
            title={existingPrice ? 'Edit Pricing' : 'Add New Pricing'}
            subtitle={selectedFirm ? `Configure pricing rates for ${selectedFirm.name}` : 'Set up pricing for a business partner'}
            actions={
              <Button
                variant="ghost"
                leftIcon={<ArrowLeftIcon size={18} />}
                onClick={() => navigate('/pricing')}
              >
                Back
              </Button>
            }
          />

          <div className="price-edit-layout">
            {/* Main Form */}
            <div className="price-edit-form-container">
              <form onSubmit={handleSubmit} className="price-edit-form">
                {/* Firm Selection */}
                <div className="price-edit-section">
                  <div className="price-edit-section__header">
                    <div className="price-edit-section__icon">
                      <BusinessIcon size={24} />
                    </div>
                    <div>
                      <h3 className="price-edit-section__title">Select Business Partner</h3>
                      <p className="price-edit-section__subtitle">Choose the firm for this pricing configuration</p>
                    </div>
                  </div>

                  <div className="price-edit-field">
                    <select
                      className="price-edit-select"
                      value={formData.firmId}
                      onChange={(e) => setFormData({ ...formData, firmId: e.target.value })}
                      required
                      disabled={!isNew && firmId !== 'new'}
                    >
                      <option value="">Select a firm...</option>
                      {firms.map((firm) => (
                        <option key={firm.id} value={firm.id}>{firm.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing Rates */}
                <div className="price-edit-section">
                  <div className="price-edit-section__header">
                    <div className="price-edit-section__icon price-edit-section__icon--violet">
                      <PaymentIcon size={24} />
                    </div>
                    <div>
                      <h3 className="price-edit-section__title">Pricing Rates</h3>
                      <p className="price-edit-section__subtitle">Set the price per ton for RO and Open weights</p>
                    </div>
                  </div>

                  <div className="price-edit-rates">
                    <div className="price-edit-rate">
                      <label className="price-edit-rate__label">RO Ton Price</label>
                      <div className="price-edit-rate__input-wrapper">
                        <span className="price-edit-rate__currency">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="price-edit-rate__input"
                          placeholder="0.00"
                          value={formData.roTonPrice}
                          onChange={(e) => setFormData({ ...formData, roTonPrice: e.target.value })}
                          required
                        />
                        <span className="price-edit-rate__unit">per ton</span>
                      </div>
                      <span className="price-edit-rate__hint">Price applied to RO weight portion</span>
                    </div>

                    <div className="price-edit-rate">
                      <label className="price-edit-rate__label">Open Ton Price</label>
                      <div className="price-edit-rate__input-wrapper price-edit-rate__input-wrapper--open">
                        <span className="price-edit-rate__currency">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="price-edit-rate__input"
                          placeholder="0.00"
                          value={formData.openTonPrice}
                          onChange={(e) => setFormData({ ...formData, openTonPrice: e.target.value })}
                          required
                        />
                        <span className="price-edit-rate__unit">per ton</span>
                      </div>
                      <span className="price-edit-rate__hint">Price applied to Open weight portion</span>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="price-edit-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate('/pricing')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={!formData.firmId || !formData.roTonPrice || !formData.openTonPrice}
                  >
                    {existingPrice ? 'Update Pricing' : 'Create Pricing'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Sidebar */}
            <div className="price-edit-preview">
              <div className="price-preview-card">
                <h4 className="price-preview-card__title">Pricing Preview</h4>
                <p className="price-preview-card__subtitle">Example calculation for {exampleTon} tons</p>

                <div className="price-preview-card__rates">
                  <div className="price-preview-rate">
                    <div className="price-preview-rate__header">
                      <span className="price-preview-rate__label">RO Tonnage</span>
                      <span className="price-preview-rate__badge price-preview-rate__badge--ro">RO</span>
                    </div>
                    <div className="price-preview-rate__calc">
                      <span>{exampleTon} T × ₹{roPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-preview-rate__total price-preview-rate__total--ro">
                      ₹{exampleRoTotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="price-preview-rate">
                    <div className="price-preview-rate__header">
                      <span className="price-preview-rate__label">Open Tonnage</span>
                      <span className="price-preview-rate__badge price-preview-rate__badge--open">Open</span>
                    </div>
                    <div className="price-preview-rate__calc">
                      <span>{exampleTon} T × ₹{openPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-preview-rate__total price-preview-rate__total--open">
                      ₹{exampleOpenTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="price-preview-card__divider"></div>

                <div className="price-preview-card__summary">
                  <span>Combined Total ({exampleTon * 2} T)</span>
                  <strong>₹{(exampleRoTotal + exampleOpenTotal).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default PriceEdit;
