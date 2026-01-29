/**
 * Sidebar Component
 * 
 * Modern, collapsible navigation sidebar.
 * Inspired by Linear and Notion sidebars.
 */

import React, { createContext, useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

// Context for sidebar state
const SidebarContext = createContext({
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Sidebar Provider
export const SidebarProvider = ({ children, defaultCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const toggle = () => setIsCollapsed(prev => !prev);
  const toggleMobile = () => setIsMobileOpen(prev => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  
  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      isMobileOpen,
      toggle, 
      toggleMobile,
      closeMobile,
      setIsCollapsed 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Main Sidebar Component
const Sidebar = ({ 
  brand,
  brandIcon,
  routes = [],
  footer,
  className = '',
}) => {
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebar();
  const location = useLocation();
  
  const sidebarClasses = [
    'sidebar',
    isCollapsed && 'sidebar--collapsed',
    isMobileOpen && 'sidebar--open',
    className,
  ].filter(Boolean).join(' ');

  // Close mobile sidebar when clicking a link
  const handleLinkClick = () => {
    closeMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="sidebar__header">
          <NavLink to="/" className="sidebar__brand" onClick={handleLinkClick}>
            {brandIcon && (
              <div className="sidebar__brand-icon">
                {brandIcon}
              </div>
            )}
            <span className="sidebar__brand-text">{brand}</span>
          </NavLink>
          
          <button 
            className="sidebar__toggle" 
            onClick={toggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isCollapsed ? (
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {routes.map((section, sectionIndex) => (
            <div key={sectionIndex} className="sidebar__section">
              {section.title && (
                <div className="sidebar__section-title">
                  {section.title}
                </div>
              )}
              <ul className="sidebar__list">
                {section.items
                  .filter(item => !item.hidden)
                  .map((item) => {
                    const isActive = location.pathname === item.route || 
                      (item.route !== '/' && location.pathname.startsWith(item.route));
                    
                    return (
                      <li key={item.key}>
                        <NavLink
                          to={item.route}
                          className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                          title={isCollapsed ? item.name : undefined}
                          onClick={handleLinkClick}
                        >
                          <span className="sidebar__item-icon">
                            {item.icon}
                          </span>
                          <span className="sidebar__item-text">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="sidebar__item-badge">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {footer && (
          <div className="sidebar__footer">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  brand: PropTypes.string.isRequired,
  brandIcon: PropTypes.node,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          route: PropTypes.string.isRequired,
          icon: PropTypes.node,
          badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          hidden: PropTypes.bool,
        })
      ).isRequired,
    })
  ),
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Sidebar;
