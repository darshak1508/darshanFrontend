/**
 * Date Formatting Utilities
 * 
 * Centralized date/time formatting with proper timezone handling for IST (Asia/Kolkata)
 */

/**
 * Format date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date (e.g., "30 Jan, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Parse date string properly handling timezone
 * @param {string|Date} dateString - Date string from API
 * @returns {Date} Parsed date object
 */
function parseDate(dateString) {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  
  // Check if the date has timezone info (Z or +/-offset)
  const hasTimezone = dateString.includes('Z') || dateString.includes('+') || (dateString.includes('-') && dateString.lastIndexOf('-') > 10);
  
  if (hasTimezone) {
    // Has timezone - parse normally
    return new Date(dateString);
  }
  
  // No timezone - parse as local time
  // Try to extract date and time components
  // Expected format: "2026-01-30T17:30:00" or "2026-01-30 17:30:00"
  const dateTimeMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/);
  
  if (dateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
    // Create date using local timezone
    return new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
  }
  
  // Try date-only format: "2026-01-30"
  const dateOnlyMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
  }
  
  // Fallback to default parsing
  return new Date(dateString);
}

/**
 * Format date with time for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date with time (e.g., "Today, 05:30 pm" or "30 Jan, 05:30 pm")
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return '-';
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Format time in 12-hour format
  const time = date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });

  // Compare dates (ignoring time)
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) return `Today, ${time}`;
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return `Yesterday, ${time}`;
  
  return date.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short'
  }) + `, ${time}`;
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date for input (e.g., "2026-01-30")
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return '';
  
  // Get the date in local timezone and format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format time only
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted time (e.g., "05:30 pm")
 */
export const formatTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return '-';
  
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date and time separately
 * @param {string|Date} dateString - Date string or Date object
 * @returns {object} Object with date and time strings
 */
export const formatDateAndTime = (dateString) => {
  if (!dateString) return { date: '-', time: '-' };
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return { date: '-', time: '-' };
  
  return {
    date: formatDate(dateString),
    time: formatTime(dateString)
  };
};

/**
 * Get relative date label (Today, Yesterday, or formatted date)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative date label
 */
export const getRelativeDateLabel = (dateString) => {
  if (!dateString) return '-';
  
  const date = parseDate(dateString);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) return '-';
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Compare dates (ignoring time)
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';
  
  return formatDate(dateString);
};
