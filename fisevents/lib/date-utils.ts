/**
 * Robust date utilities for cross-browser compatibility
 */

// Standard format for datetime-local input: YYYY-MM-DDTHH:mm
export const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

/**
 * Safely parse a date string, handling various formats
 */
export const safeParseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;

  try {
    // Handle datetime-local format (YYYY-MM-DDTHH:mm)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return new Date(dateString + ':00');
    }

    // Handle ISO format with timezone
    if (dateString.includes('T') && (dateString.includes('Z') || dateString.includes('+'))) {
      return new Date(dateString);
    }

    // Handle date-only format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString + 'T00:00:00');
    }

    // Fallback to Date constructor
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

/**
 * Convert any date to datetime-local format (YYYY-MM-DDTHH:mm)
 */
export const toDatetimeLocalFormat = (date: Date | string | undefined): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? safeParseDate(date) : date;
  if (!dateObj) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Convert datetime-local format to ISO string for storage
 */
export const fromDatetimeLocalToISO = (datetimeLocal: string): string => {
  if (!datetimeLocal || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(datetimeLocal)) {
    return '';
  }

  // Add seconds and convert to ISO
  const date = new Date(datetimeLocal + ':00');
  return date.toISOString();
};

/**
 * Get current date in datetime-local format
 */
export const getCurrentDatetimeLocal = (): string => {
  return toDatetimeLocalFormat(new Date());
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const date = safeParseDate(dateString);
  if (!date) return false;

  const now = new Date();
  return date < now;
};

/**
 * Check if a date is today
 */
export const isDateToday = (dateString: string): boolean => {
  const date = safeParseDate(dateString);
  if (!date) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Get minimum date for datetime-local input (current date)
 */
export const getMinDatetimeLocal = (): string => {
  return getCurrentDatetimeLocal();
};

/**
 * Validate date range (start <= end)
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = safeParseDate(startDate);
  const end = safeParseDate(endDate);

  if (!start || !end) return false;
  return start <= end;
};

/**
 * Legacy compatibility: Convert old format to new format
 */
export const legacyDateToDatetimeLocal = (dateString: string): string => {
  // Handle old toUserIsoString format
  if (dateString.includes('+') || dateString.includes('-') && dateString.length > 16) {
    const date = safeParseDate(dateString);
    return date ? toDatetimeLocalFormat(date) : '';
  }

  return toDatetimeLocalFormat(dateString);
};
