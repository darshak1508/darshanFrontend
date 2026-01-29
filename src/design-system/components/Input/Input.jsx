/**
 * Input Component
 * 
 * Clean, accessible form input with validation states.
 */

import React, { forwardRef, useState, useId } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  size = 'md',
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  className = '',
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  
  const baseClass = 'input';
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    `${baseClass}-wrapper--${size}`,
    error && `${baseClass}-wrapper--error`,
    disabled && `${baseClass}-wrapper--disabled`,
    isFocused && `${baseClass}-wrapper--focused`,
    className,
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container">
        {prefix && <span className="input__prefix">{prefix}</span>}
        {leftIcon && <span className="input__icon input__icon--left">{leftIcon}</span>}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input__field"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && <span className="input__icon input__icon--right">{rightIcon}</span>}
        {suffix && <span className="input__suffix">{suffix}</span>}
      </div>
      
      {helperText && (
        <span 
          id={`${inputId}-helper`} 
          className={`input__helper ${error ? 'input__helper--error' : ''}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
const Textarea = forwardRef(({
  label,
  placeholder,
  value,
  defaultValue,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  rows = 4,
  resize = 'vertical',
  className = '',
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  
  const wrapperClasses = [
    'input-wrapper',
    error && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    isFocused && 'input-wrapper--focused',
    className,
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container input__container--textarea">
        <textarea
          ref={ref}
          id={inputId}
          className="input__field input__field--textarea"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          rows={rows}
          style={{ resize }}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      
      {helperText && (
        <span 
          id={`${inputId}-helper`} 
          className={`input__helper ${error ? 'input__helper--error' : ''}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select component
const Select = forwardRef(({
  label,
  placeholder = 'Select an option',
  value,
  defaultValue,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'md',
  options = [],
  className = '',
  onChange,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${size}`,
    error && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container input__container--select">
        <select
          ref={ref}
          id={inputId}
          className="input__field input__field--select"
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          onChange={onChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="input__select-arrow">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
      
      {helperText && (
        <span 
          id={`${inputId}-helper`} 
          className={`input__helper ${error ? 'input__helper--error' : ''}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export { Input, Textarea, Select };
export default Input;
