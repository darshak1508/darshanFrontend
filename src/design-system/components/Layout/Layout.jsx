/**
 * Layout Component
 * 
 * Main application layout with sidebar and content area.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSidebar } from './Sidebar';
import './Layout.css';

// Main layout wrapper
const AppLayout = ({ children, className = '' }) => {
  return (
    <div className={`app-layout ${className}`}>
      {children}
    </div>
  );
};

// Content area that adjusts to sidebar
const MainContent = ({ children, className = '' }) => {
  let isCollapsed = false;
  try {
    const sidebarContext = useSidebar();
    isCollapsed = sidebarContext?.isCollapsed || false;
  } catch (e) {
    // Context not available, use default
  }
  
  const contentClasses = [
    'main-content',
    isCollapsed && 'main-content--sidebar-collapsed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <main className={contentClasses}>
      {children}
    </main>
  );
};

// Page header component
const PageHeader = ({ 
  title, 
  subtitle, 
  actions,
  breadcrumbs,
  className = '' 
}) => {
  return (
    <header className={`page-header ${className}`}>
      {breadcrumbs && (
        <nav className="page-header__breadcrumbs">
          {breadcrumbs}
        </nav>
      )}
      <div className="page-header__content">
        <div className="page-header__text">
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {actions && (
          <div className="page-header__actions">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

// Page content wrapper
const PageContent = ({ children, className = '', maxWidth = true }) => {
  const contentClasses = [
    'page-content',
    maxWidth && 'page-content--constrained',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={contentClasses}>
      {children}
    </div>
  );
};

// Top navigation bar
const TopNav = ({ 
  children,
  leftContent,
  rightContent,
  className = '' 
}) => {
  const { isCollapsed } = useSidebar();
  
  const navClasses = [
    'top-nav',
    isCollapsed && 'top-nav--sidebar-collapsed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <header className={navClasses}>
      <div className="top-nav__left">
        {leftContent}
      </div>
      {children}
      <div className="top-nav__right">
        {rightContent}
      </div>
    </header>
  );
};

// Search component for top nav
const SearchInput = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  className = '' 
}) => {
  return (
    <div className={`search-input ${className}`}>
      <svg 
        className="search-input__icon" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
          clipRule="evenodd" 
        />
      </svg>
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className="search-input__shortcut">⌘K</span>
    </div>
  );
};

// Breadcrumb components
const Breadcrumbs = ({ children, className = '' }) => {
  return (
    <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {React.Children.map(children, (child, index) => (
          <li className="breadcrumbs__item">
            {index > 0 && (
              <svg className="breadcrumbs__separator" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const BreadcrumbItem = ({ href, children, current = false }) => {
  if (current) {
    return (
      <span className="breadcrumbs__link breadcrumbs__link--current" aria-current="page">
        {children}
      </span>
    );
  }
  
  return (
    <a href={href} className="breadcrumbs__link">
      {children}
    </a>
  );
};

// PropTypes
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  breadcrumbs: PropTypes.node,
  className: PropTypes.string,
};

PageContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.bool,
};

TopNav.propTypes = {
  children: PropTypes.node,
  leftContent: PropTypes.node,
  rightContent: PropTypes.node,
  className: PropTypes.string,
};

export { 
  AppLayout, 
  MainContent, 
  PageHeader, 
  PageContent, 
  TopNav,
  SearchInput,
  Breadcrumbs,
  BreadcrumbItem,
};
