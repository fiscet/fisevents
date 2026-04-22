// utils.test.ts
import { cn, pickerDateToIsoString, toUserIsoString, slugify } from '../utils';

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
      const input = '2024-08-14T15:37:00.000Z';
      const d = new Date(input);
      const expected = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-') + 'T' + [
        String(d.getHours()).padStart(2, '0'),
        String(d.getMinutes()).padStart(2, '0'),
      ].join(':');
      expect(pickerDateToIsoString(input)).toBe(expected);
    });

    it('should return empty string for incorrect string format', () => {
      expect(pickerDateToIsoString('incorrect-format')).toBe('');
    });

    it('should return processed ISO substring for Date object', () => {
      const date = new Date(Date.UTC(2024, 7, 14, 15, 37)); // 2024-08-14T15:37:00.000Z
      const expected = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-') + 'T' + [
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
      ].join(':');
      expect(pickerDateToIsoString(date)).toBe(expected);
    });
  });

  describe('toIsoString', () => {
    it('should return UTC ISO string', () => {
      const date = new Date(Date.UTC(2024, 7, 14, 15, 37)); // 2024-08-14T15:37:00.000Z
      const result = toUserIsoString(date);

      expect(result).toBe('2024-08-14T15:37:00.000Z');
    });
  });

  describe('slugify', () => {
    it('converts a single string to a slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('converts multiple string arguments to a slug', () => {
      expect(slugify('Hello', 'World')).toBe('hello-world');
    });

    it('converts a string with numbers to a slug', () => {
      expect(slugify('Hello World 123')).toBe('hello-world-123');
    });

    it('removes special characters from a string', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Hello World?')).toBe('hello-world');
      expect(slugify('Hello World:')).toBe('hello-world');
    });

    it('converts accented characters to their base form', () => {
      expect(slugify('Crème Brûlée')).toBe('creme-brulee');
      expect(slugify('Café au lait')).toBe('cafe-au-lait');
    });

    it('handles an empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('handles a string with only special characters', () => {
      expect(slugify('!@#$%^&*()')).toBe('');
    });

    it('converts a number to a string', () => {
      expect(slugify(123)).toBe('123');
    });
  });

});