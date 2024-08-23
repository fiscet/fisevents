// utils.test.ts
import { cn, pickerDateToIsoString, toUserIsoString } from './utils';

// Mocking clsx and tailwind-merge
jest.mock('clsx', () => ({
  clsx: jest.fn(),
}));
jest.mock('tailwind-merge', () => ({
  twMerge: jest.fn(),
}));

describe('Utils', () => {
  describe('cn', () => {
    it('should merge classes using clsx and tailwind-merge', () => {
      const clsxMock = require('clsx').clsx;
      const twMergeMock = require('tailwind-merge').twMerge;

      clsxMock.mockReturnValue('merged-classes');
      twMergeMock.mockReturnValue('final-merged-classes');

      const result = cn('class1', 'class2');
      expect(clsxMock).toHaveBeenCalledWith(['class1', 'class2']);
      expect(twMergeMock).toHaveBeenCalledWith('merged-classes');
      expect(result).toBe('final-merged-classes');
    });
  });

  describe('pickerDateToIsoString', () => {
    it('should return empty string for undefined or empty date', () => {
      expect(pickerDateToIsoString(undefined)).toBe('');
      expect(pickerDateToIsoString('')).toBe('');
    });

    it('should return date string directly if format is correct', () => {
      expect(pickerDateToIsoString('2024-08-14T15:37')).toBe('2024-08-14T15:37');
    });

    it('should return processed ISO substring for correct ISO format', () => {
      expect(pickerDateToIsoString('2024-08-14T15:37:00.000Z')).toBe('2024-08-14T15:37');
    });

    it('should return empty string for incorrect string format', () => {
      expect(pickerDateToIsoString('incorrect-format')).toBe('');
    });

    it('should return processed ISO substring for Date object', () => {
      const date = new Date(Date.UTC(2024, 7, 14, 15, 37)); // 2024-08-14T15:37:00.000Z
      expect(pickerDateToIsoString(date)).toBe('2024-08-14T15:37');
    });
  });

  describe('toIsoString', () => {
    it('should return ISO string with timezone offset', () => {
      const date = new Date(Date.UTC(2024, 7, 14, 15, 37)); // 2024-08-14T15:37:00.000Z
      const result = toUserIsoString(date);

      const expectedIsoString = '2024-08-14T17:37:00+02:00'; // Adjust according to timezone offset
      expect(result).toBe(expectedIsoString);
    });
  });
});