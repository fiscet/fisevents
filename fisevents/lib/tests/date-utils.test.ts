import {
  safeParseDate,
  toDatetimeLocalFormat,
  fromDatetimeLocalToISO,
  validateDateRange,
  isDateInPast,
  getCurrentDatetimeLocal
} from '../date-utils';

describe('Date Utils - Cross Browser Compatibility', () => {
  describe('safeParseDate', () => {
    it('should parse datetime-local format correctly', () => {
      const result = safeParseDate('2024-12-25T14:30');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11); // December is 11 (0-indexed)
      expect(result?.getDate()).toBe(25);
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should parse ISO format with timezone', () => {
      const result = safeParseDate('2024-12-25T14:30:00.000Z');
      expect(result).toBeInstanceOf(Date);
    });

    it('should parse date-only format', () => {
      const result = safeParseDate('2024-12-25');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('should handle invalid dates gracefully', () => {
      const result = safeParseDate('invalid-date');
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = safeParseDate(undefined);
      expect(result).toBeNull();
    });
  });

  describe('toDatetimeLocalFormat', () => {
    it('should convert Date to datetime-local format', () => {
      const date = new Date('2024-12-25T14:30:00');
      const result = toDatetimeLocalFormat(date);
      expect(result).toBe('2024-12-25T14:30');
    });

    it('should convert datetime-local string to same format', () => {
      const result = toDatetimeLocalFormat('2024-12-25T14:30');
      expect(result).toBe('2024-12-25T14:30');
    });

    it('should handle ISO string input', () => {
      const result = toDatetimeLocalFormat('2024-12-25T14:30:00.000Z');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });

  describe('fromDatetimeLocalToISO', () => {
    it('should convert datetime-local to ISO', () => {
      const result = fromDatetimeLocalToISO('2024-12-25T14:30');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle invalid input', () => {
      const result = fromDatetimeLocalToISO('invalid');
      expect(result).toBe('');
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const result = validateDateRange('2024-12-25T10:00', '2024-12-25T14:00');
      expect(result).toBe(true);
    });

    it('should reject invalid date range', () => {
      const result = validateDateRange('2024-12-25T14:00', '2024-12-25T10:00');
      expect(result).toBe(false);
    });

    it('should handle invalid dates', () => {
      const result = validateDateRange('invalid', '2024-12-25T14:00');
      expect(result).toBe(false);
    });
  });

  describe('isDateInPast', () => {
    it('should detect past dates', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      const result = isDateInPast(pastDate.toISOString());
      expect(result).toBe(true);
    });

    it('should detect future dates', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      const result = isDateInPast(futureDate.toISOString());
      expect(result).toBe(false);
    });
  });

  describe('getCurrentDatetimeLocal', () => {
    it('should return current date in datetime-local format', () => {
      const result = getCurrentDatetimeLocal();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });
});
