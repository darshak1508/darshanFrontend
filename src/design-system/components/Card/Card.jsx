/**
 * Card Component
 * 
 * A flexible container component for grouping content.
 * Includes variants for stat cards, content cards, and interactive cards.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  selected = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseClass = 'card';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--padding-${padding}`,
    hover && `${baseClass}--hover`,
    selected && `${baseClass}--selected`,
    clickable && `${baseClass}--clickable`,
    className,
  ].filter(Boolean).join(' ');

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      ref={ref}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

// Sub-components for structured cards
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component className={`card__title ${className}`} {...props}>
    {children}
  </Component>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card__description ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card__content ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

// Stat Card - For displaying metrics
const StatCard = forwardRef(({
  icon,
  iconColor = 'brand',
  title,
  value,
  trend,
  trendValue,
  subtitle,
  className = '',
  ...props
}, ref) => {
  const isPositive = trend === 'up';
  
  return (
    <Card ref={ref} className={`stat-card ${className}`} hover {...props}>
      <div className="stat-card__header">
        <div className={`stat-card__icon stat-card__icon--${iconColor}`}>
          {icon}
        </div>
        {trendValue && (
          <div className={`stat-card__trend stat-card__trend--${isPositive ? 'up' : 'down'}`}>
            <svg 
              className="stat-card__trend-icon" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              {isPositive ? (
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
              ) : (
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" />
              )}
            </svg>
            <span className="stat-card__trend-value">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="stat-card__body">
        <span className="stat-card__label">{title}</span>
        <span className="stat-card__value">{value}</span>
        {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated', 'filled']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  hover: PropTypes.bool,
  selected: PropTypes.bool,
  clickable: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

StatCard.propTypes = {
  icon: PropTypes.node,
  iconColor: PropTypes.oneOf(['brand', 'success', 'warning', 'error', 'info', 'violet', 'purple']),
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

// Export all
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card, StatCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
