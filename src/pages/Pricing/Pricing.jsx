/**
 * Pricing Management Page
 * 
 * Premium, professional pricing management interface.
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
import { StatCard } from '../../design-system/components/Card';
import Button from '../../design-system/components/Button';

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
import './Pricing.css';

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

function Pricing() {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState([]);
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch firms for matching
  const fetchFirms = async () => {
    try {
      const response = await cachedApiCall('/firm');
      if (response.ok) {
        const data = await response.json();
        const firmsList = data.map(f => ({ id: f.FirmID, name: f.FirmName }));
        setFirms(firmsList);
        return firmsList;
      }
    } catch (error) {
      console.error('Error fetching firms:', error);
    }
    return [];
  };

  // Fetch pricing
  const fetchPricing = async (firmsList = firms) => {
    setIsLoading(true);
    try {
      const response = await cachedApiCall('/pricing');
      if (response.ok) {
        const data = await response.json();
        console.log('Raw pricing data from API:', data);
        console.log('Firms list for matching:', firmsList);

        // Enrich pricing data with firm names if not already present
        const enrichedData = data.map((price) => {
          // If Firm data is already present, use it
          if (price.Firm?.FirmName) {
            return price;
          }

          // Otherwise, match from firms list using FirmID
          if (price.FirmID && firmsList.length > 0) {
            const matchedFirm = firmsList.find(f => f.id === price.FirmID);
            return {
              ...price,
              Firm: {
                FirmName: matchedFirm?.name || 'Unknown Firm',
                FirmID: price.FirmID
              }
            };
          }

          return price;
        });

        console.log('Enriched pricing data:', enrichedData);
        setPricing(enrichedData);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch firms first, then pricing
    const loadData = async () => {
      const firmsList = await fetchFirms();
      await fetchPricing(firmsList);
    };
    loadData();
  }, []);

  // Handle delete
  const handleDelete = async (pricingId) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      try {
        const response = await apiCall(`/pricing/${pricingId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPricing(firms);
        } else {
          alert('Failed to delete pricing');
        }
      } catch (error) {
        console.error('Error deleting pricing:', error);
      }
    }
  };

  // Filter pricing
  const filteredPricing = pricing.filter((price) => {
    // If no search query, show all
    if (!searchQuery) return true;

    // If there's a search query, try to match against firm name
    const firmName = price.Firm?.FirmName || '';
    return firmName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
            title="Pricing Management"
            subtitle="Configure and manage pricing rates for your business partners"
            actions={
              <Button
                variant="primary"
                leftIcon={<PlusIcon size={18} />}
                onClick={() => navigate('/pricing/add/new')}
              >
                Add Pricing
              </Button>
            }
          />

          {/* Stats Row */}
          <div className="pricing-stats">
            <div className="pricing-stat-card">
              <div className="pricing-stat-card__icon">
                <PaymentIcon size={24} />
              </div>
              <div className="pricing-stat-card__content">
                <span className="pricing-stat-card__value">{pricing.length}</span>
                <span className="pricing-stat-card__label">Active Pricing Rules</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pricing-toolbar">
            <div className="pricing-search">
              <SearchIcon size={20} className="pricing-search__icon" />
              <input
                type="text"
                className="pricing-search__input"
                placeholder="Search by firm name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Pricing Cards Grid */}
          {isLoading ? (
            <div className="pricing-loading">
              <div className="pricing-loading__spinner"></div>
              <span>Loading pricing data...</span>
            </div>
          ) : filteredPricing.length > 0 ? (
            <div className="pricing-grid">
              {filteredPricing.map((price) => (
                <div key={price.PricingID} className="pricing-card">
                  <div className="pricing-card__header">
                    <div className="pricing-card__firm">
                      <div className="pricing-card__firm-avatar">
                        <BusinessIcon size={20} />
                      </div>
                      <div className="pricing-card__firm-info">
                        <h3 className="pricing-card__firm-name">{price.Firm?.FirmName || 'Unknown Firm'}</h3>
                        <span className="pricing-card__firm-id">Firm ID: {price.FirmID}</span>
                      </div>
                    </div>
                    <div className="pricing-card__actions">
                      <button
                        className="pricing-card__action pricing-card__action--edit"
                        onClick={() => navigate(`/pricing/${price.FirmID}/edit`)}
                        title="Edit pricing"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        className="pricing-card__action pricing-card__action--delete"
                        onClick={() => handleDelete(price.PricingID)}
                        title="Delete pricing"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="pricing-card__body">
                    <div className="pricing-card__rates">
                      <div className="pricing-card__rate">
                        <span className="pricing-card__rate-label">RO Price</span>
                        <span className="pricing-card__rate-value pricing-card__rate-value--ro">
                          ₹{Number(price.RoTonPrice || 0).toLocaleString('en-IN')}
                          <small>/ton</small>
                        </span>
                      </div>
                      <div className="pricing-card__rate-divider"></div>
                      <div className="pricing-card__rate">
                        <span className="pricing-card__rate-label">Over Price</span>
                        <span className="pricing-card__rate-value pricing-card__rate-value--open">
                          ₹{Number(price.OpenTonPrice || 0).toLocaleString('en-IN')}
                          <small>/ton</small>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pricing-card__footer">
                    <span className="pricing-card__date">
                      Effective from {formatDate(price.EffectiveDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pricing-empty">
              <div className="pricing-empty__icon">
                <PaymentIcon size={64} />
              </div>
              <h3 className="pricing-empty__title">No pricing configured</h3>
              <p className="pricing-empty__description">
                {searchQuery
                  ? 'No pricing matches your search criteria'
                  : 'Get started by adding pricing for your business partners'}
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  leftIcon={<PlusIcon size={18} />}
                  onClick={() => navigate('/pricing/add/new')}
                >
                  Add Your First Pricing
                </Button>
              )}
            </div>
          )}
        </MainContent>
      </AppLayout>
    </SidebarProvider>
  );
}

export default Pricing;
