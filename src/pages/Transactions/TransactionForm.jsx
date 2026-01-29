/**
 * Transaction Form Page
 * 
 * Premium, professional transaction creation form.
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
import './TransactionForm.css';

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

function TransactionForm() {
  const navigate = useNavigate();
  const [firms, setFirms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firmId: '',
    vehicleId: '',
    roNumber: '',
    totalTon: '',
    roTon: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  // Calculated values
  const [calculated, setCalculated] = useState({
    openTon: 0,
    roPrice: 0,
    openPrice: 0,
    totalPrice: 0,
  });

  // Fetch firms
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await apiCall('/firm');
        if (response.ok) {
          const data = await response.json();
          setFirms(data);
        }
      } catch (error) {
        console.error('Error fetching firms:', error);
      }
    };
    fetchFirms();
  }, []);

  // Fetch vehicles when firm changes
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!formData.firmId) {
        setVehicles([]);
        return;
      }

      setVehiclesLoading(true);
      try {
        const response = await apiCall(`/vehicle/byFirm/${formData.firmId}`);
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        try {
          const allResponse = await apiCall('/vehicle');
          if (allResponse.ok) {
            const allData = await allResponse.json();
            setVehicles(allData.filter(v => v.FirmID?.toString() === formData.firmId));
          }
        } catch (err) {
          console.error('Error fetching all vehicles:', err);
        }
      } finally {
        setVehiclesLoading(false);
      }
    };
    fetchVehicles();
  }, [formData.firmId]);

  // Fetch pricing when firm changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!formData.firmId) {
        setPricing(null);
        return;
      }

      setPricingLoading(true);
      try {
        const response = await apiCall('/pricing');
        if (response.ok) {
          const allPricing = await response.json();
          const firmPricing = allPricing.find(p => p.FirmID?.toString() === formData.firmId);
          setPricing(firmPricing || null);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setPricingLoading(false);
      }
    };
    fetchPricing();
  }, [formData.firmId]);

  // Calculate prices
  useEffect(() => {
    const totalTon = parseFloat(formData.totalTon) || 0;
    const roTon = parseFloat(formData.roTon) || 0;
    const openTon = Math.max(0, totalTon - roTon);

    const roTonPrice = pricing?.RoTonPrice || 0;
    const openTonPrice = pricing?.OpenTonPrice || 0;

    const roPrice = roTon * roTonPrice;
    const openPrice = openTon * openTonPrice;
    const totalPrice = roPrice + openPrice;

    setCalculated({
      openTon: openTon.toFixed(2),
      roPrice: roPrice.toFixed(2),
      openPrice: openPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    });
  }, [formData.totalTon, formData.roTon, pricing]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.firmId || !formData.vehicleId || !formData.roNumber || !formData.totalTon || !formData.roTon) {
      setError('Please fill in all required fields');
      return;
    }

    const totalTon = parseFloat(formData.totalTon);
    const roTon = parseFloat(formData.roTon);

    if (roTon > totalTon) {
      setError('RO Ton cannot be greater than Total Ton');
      return;
    }

    if (!pricing) {
      setError('No pricing configured for this firm. Please set up pricing first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionData = {
        FirmID: parseInt(formData.firmId),
        VehicleID: parseInt(formData.vehicleId),
        RoNumber: formData.roNumber,
        TotalTon: totalTon,
        RoTon: roTon,
        TransactionDate: formData.transactionDate,
      };
      const response = await apiCall('/transaction', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/transactions'), 2000);
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Error creating transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFirm = firms.find(f => f.id.toString() === formData.firmId);
  const selectedVehicle = vehicles.find(v => v.id.toString() === formData.vehicleId);

  const canProceed = step === 1
    ? formData.firmId && formData.vehicleId && formData.roNumber
    : formData.totalTon && formData.roTon && pricing;

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
          <PageHeader
            title="New Transaction"
            subtitle="Record a new business transaction"
            actions={
              <Button
                variant="ghost"
                leftIcon={<ArrowLeftIcon size={18} />}
                onClick={() => navigate('/transactions')}
              >
                Back
              </Button>
            }
          />

          <div className="transaction-page">
            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'progress-step--active' : ''} ${step > 1 ? 'progress-step--completed' : ''}`}>
                <div className="progress-step__number">
                  {step > 1 ? <CheckCircleIcon size={20} /> : '1'}
                </div>
                <div className="progress-step__info">
                  <span className="progress-step__title">Details</span>
                  <span className="progress-step__subtitle">Firm & Vehicle</span>
                </div>
              </div>
              <div className="progress-step__line"></div>
              <div className={`progress-step ${step >= 2 ? 'progress-step--active' : ''}`}>
                <div className="progress-step__number">2</div>
                <div className="progress-step__info">
                  <span className="progress-step__title">Tonnage</span>
                  <span className="progress-step__subtitle">Weight & Price</span>
                </div>
              </div>
            </div>

            <div className="transaction-content">
              {/* Main Form */}
              <div className="transaction-form-container">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="form-card">
                      <div className="form-card__header">
                        <div className="form-card__icon">
                          <BusinessIcon size={24} />
                        </div>
                        <div>
                          <h2 className="form-card__title">Transaction Details</h2>
                          <p className="form-card__subtitle">Select the firm, vehicle, and enter RO details</p>
                        </div>
                      </div>

                      <div className="form-card__body">
                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-label">
                              <BusinessIcon size={16} />
                              Select Firm
                            </label>
                            <select
                              className="form-select"
                              value={formData.firmId}
                              onChange={(e) => setFormData({ ...formData, firmId: e.target.value, vehicleId: '' })}
                              required
                            >
                              <option value="">Choose a firm...</option>
                              {firms.map((firm) => (
                                <option key={firm.id} value={firm.id}>{firm.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              <VehicleIcon size={16} />
                              Select Vehicle
                            </label>
                            <select
                              className="form-select"
                              value={formData.vehicleId}
                              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                              required
                              disabled={!formData.firmId}
                            >
                              <option value="">Choose a vehicle...</option>
                              {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleNo}</option>
                              ))}
                            </select>
                            {formData.firmId && vehicles.length === 0 && (
                              <span className="form-hint form-hint--warning">No vehicles found for this firm</span>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-label">
                              <ReceiptIcon size={16} />
                              RO Number
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter RO number..."
                              value={formData.roNumber}
                              onChange={(e) => setFormData({ ...formData, roNumber: e.target.value })}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label className="form-label">
                              <DashboardIcon size={16} />
                              Transaction Date
                            </label>
                            <input
                              type="date"
                              className="form-input"
                              value={formData.transactionDate}
                              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-card__footer">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => navigate('/transactions')}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => setStep(2)}
                          disabled={!canProceed}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="form-card">
                      <div className="form-card__header">
                        <div className="form-card__icon form-card__icon--violet">
                          <PaymentIcon size={24} />
                        </div>
                        <div>
                          <h2 className="form-card__title">Tonnage & Pricing</h2>
                          <p className="form-card__subtitle">Enter weight details - prices will be calculated automatically</p>
                        </div>
                      </div>

                      {pricing ? (
                        <div className="pricing-badge">
                          <span className="pricing-badge__label">Active Pricing for {selectedFirm?.name}</span>
                          <div className="pricing-badge__values">
                            <span className="pricing-badge__item">
                              <strong>RO:</strong> ₹{pricing.RoTonPrice}/ton
                            </span>
                            <span className="pricing-badge__divider">•</span>
                            <span className="pricing-badge__item">
                              <strong>Open:</strong> ₹{pricing.OpenTonPrice}/ton
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="pricing-warning">
                          <span className="pricing-warning__icon">⚠️</span>
                          <div className="pricing-warning__content">
                            <strong>No pricing configured</strong>
                            <p>Please set up pricing for this firm before creating transactions.</p>
                            <a href="/pricing/add/new" className="pricing-warning__link">Configure Pricing →</a>
                          </div>
                        </div>
                      )}

                      <div className="form-card__body">
                        <div className="tonnage-inputs">
                          <div className="tonnage-field">
                            <label className="tonnage-label">Total Tonnage</label>
                            <div className="tonnage-input-wrapper">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="tonnage-input"
                                placeholder="0.00"
                                value={formData.totalTon}
                                onChange={(e) => setFormData({ ...formData, totalTon: e.target.value })}
                                required
                              />
                              <span className="tonnage-unit">TON</span>
                            </div>
                          </div>

                          <div className="tonnage-operator">=</div>

                          <div className="tonnage-field">
                            <label className="tonnage-label">RO Tonnage</label>
                            <div className="tonnage-input-wrapper tonnage-input-wrapper--ro">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="tonnage-input"
                                placeholder="0.00"
                                value={formData.roTon}
                                onChange={(e) => setFormData({ ...formData, roTon: e.target.value })}
                                required
                              />
                              <span className="tonnage-unit">TON</span>
                            </div>
                          </div>

                          <div className="tonnage-operator">+</div>

                          <div className="tonnage-field">
                            <label className="tonnage-label">Open Tonnage</label>
                            <div className="tonnage-input-wrapper tonnage-input-wrapper--open">
                              <input
                                type="text"
                                className="tonnage-input tonnage-input--readonly"
                                value={calculated.openTon}
                                readOnly
                              />
                              <span className="tonnage-unit">TON</span>
                            </div>
                            <span className="tonnage-hint">Auto-calculated</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-card__footer">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          loading={isSubmitting}
                          disabled={!canProceed}
                        >
                          Create Transaction
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Summary Sidebar */}
              <div className="transaction-summary">
                <div className="summary-card">
                  <h3 className="summary-card__title">Transaction Summary</h3>

                  <div className="summary-section">
                    <div className="summary-item">
                      <span className="summary-item__label">Firm</span>
                      <span className="summary-item__value">{selectedFirm?.name || '—'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Vehicle</span>
                      <span className="summary-item__value">{selectedVehicle?.vehicleNo || '—'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">RO Number</span>
                      <span className="summary-item__value">{formData.roNumber || '—'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item__label">Date</span>
                      <span className="summary-item__value">
                        {formData.transactionDate ? new Date(formData.transactionDate).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        }) : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-section">
                    <div className="summary-row">
                      <span>RO Tonnage</span>
                      <span>{formData.roTon || '0'} T</span>
                    </div>
                    <div className="summary-row">
                      <span>Open Tonnage</span>
                      <span>{calculated.openTon} T</span>
                    </div>
                    <div className="summary-row summary-row--highlight">
                      <span>Total Tonnage</span>
                      <span>{formData.totalTon || '0'} T</span>
                    </div>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-section">
                    <div className="summary-row">
                      <span>RO Amount</span>
                      <span>₹{Number(calculated.roPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-row">
                      <span>Open Amount</span>
                      <span>₹{Number(calculated.openPrice).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="summary-total">
                    <span className="summary-total__label">Total Amount</span>
                    <span className="summary-total__value">₹{Number(calculated.totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default TransactionForm;
