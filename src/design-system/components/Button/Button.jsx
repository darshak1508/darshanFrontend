/**
 * Button Component
 * 
 * A versatile button component with multiple variants.
 * Does NOT use Material UI - pure CSS-based styling.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseClass = 'btn';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    fullWidth && `${baseClass}--full-width`,
    loading && `${baseClass}--loading`,
    disabled && `${baseClass}--disabled`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
        </span>
      )}
      {leftIcon && !loading && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      <span className="btn__content">{children}</span>
      {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Visual style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'outline', 'link']),
  /** Button size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Loading state */
  loading: PropTypes.bool,
  /** Full width button */
  fullWidth: PropTypes.bool,
  /** Icon on the left side */
  leftIcon: PropTypes.node,
  /** Icon on the right side */
  rightIcon: PropTypes.node,
  /** Button type */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
};

export default Button;
