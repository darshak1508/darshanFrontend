/**
 * Badge Component
 * 
 * Status badges and labels.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
