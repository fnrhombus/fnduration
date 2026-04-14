import { describe, it, expect } from 'vitest';
import { format } from 'fnduration';

describe('format', () => {
  describe('long style (default)', () => {
    it('formats 12_000_000 as "3 hours 20 minutes"', () => {
      expect(format(12_000_000)).toBe('3 hours 20 minutes');
    });

    it('formats 86_400_000 as "1 day"', () => {
      expect(format(86_400_000)).toBe('1 day');
    });

    it('formats 90_061_000 as "1 day 1 hour 1 minute 1 second"', () => {
      expect(format(90_061_000)).toBe('1 day 1 hour 1 minute 1 second');
    });

    it('formats 0 as "0 milliseconds"', () => {
      expect(format(0)).toBe('0 milliseconds');
    });

    it('pluralizes correctly: 1 hour vs 2 hours', () => {
      expect(format(3_600_000)).toBe('1 hour');
      expect(format(7_200_000)).toBe('2 hours');
    });

    it('pluralizes correctly: 1 minute vs 2 minutes', () => {
      expect(format(60_000)).toBe('1 minute');
      expect(format(120_000)).toBe('2 minutes');
    });

    it('handles milliseconds', () => {
      expect(format(1)).toBe('1 millisecond');
      expect(format(42)).toBe('42 milliseconds');
    });
  });

  describe('short style', () => {
    it('formats 12_000_000 as "3h 20m"', () => {
      expect(format(12_000_000, 'short')).toBe('3h 20m');
    });

    it('formats 0 as "0ms"', () => {
      expect(format(0, 'short')).toBe('0ms');
    });

    it('formats 86_400_000 as "1d"', () => {
      expect(format(86_400_000, 'short')).toBe('1d');
    });
  });

  describe('narrow style', () => {
    it('formats 12_000_000 as "3h20m"', () => {
      expect(format(12_000_000, 'narrow')).toBe('3h20m');
    });

    it('formats 0 as "0ms"', () => {
      expect(format(0, 'narrow')).toBe('0ms');
    });
  });

  describe('options', () => {
    it('largest: 2 truncates to two largest units', () => {
      expect(format(90_061_000, { largest: 2 })).toBe('1 day 1 hour');
    });

    it('largest: 1 shows only the largest unit', () => {
      expect(format(90_061_000, { largest: 1 })).toBe('1 day');
    });

    it('largest with rounding', () => {
      expect(format(5_400_000, { largest: 1 })).toBe('2 hours');
    });

    it('units option restricts output units', () => {
      expect(format(90_061_000, { units: ['hour', 'minute'] })).toBe('25 hours 1 minute');
    });

    it('style option in object form', () => {
      expect(format(12_000_000, { style: 'short' })).toBe('3h 20m');
    });
  });

  describe('edge cases', () => {
    it('throws on negative values', () => {
      expect(() => format(-1)).toThrow();
    });

    it('handles very large values', () => {
      const tenDays = 864_000_000;
      expect(format(tenDays)).toBe('10 days');
    });
  });
});
