import { describe, it, expect } from 'vitest';
import { parse } from 'fnduration';

describe('parse', () => {
  describe('verbose', () => {
    it('parses "3 hours 20 minutes"', () => {
      expect(parse('3 hours 20 minutes')).toBe(12_000_000);
    });

    it('parses "1 day, 6 hours"', () => {
      expect(parse('1 day, 6 hours')).toBe(108_000_000);
    });

    it('parses "2 minutes and 30 seconds"', () => {
      expect(parse('2 minutes and 30 seconds')).toBe(150_000);
    });

    it('parses "1 second"', () => {
      expect(parse('1 second')).toBe(1_000);
    });

    it('parses "500 milliseconds"', () => {
      expect(parse('500 milliseconds')).toBe(500);
    });
  });

  describe('terse', () => {
    it('parses "3h20m"', () => {
      expect(parse('3h20m')).toBe(12_000_000);
    });

    it('parses "500ms"', () => {
      expect(parse('500ms')).toBe(500);
    });

    it('parses "2.5h"', () => {
      expect(parse('2.5h')).toBe(9_000_000);
    });

    it('parses "1d6h"', () => {
      expect(parse('1d6h')).toBe(108_000_000);
    });

    it('parses "30s"', () => {
      expect(parse('30s')).toBe(30_000);
    });
  });

  describe('mixed', () => {
    it('parses "1 hour 30m"', () => {
      expect(parse('1 hour 30m')).toBe(5_400_000);
    });

    it('parses "2h 15 minutes"', () => {
      expect(parse('2h 15 minutes')).toBe(8_100_000);
    });
  });

  describe('weeks', () => {
    it('parses "1 week"', () => {
      expect(parse('1 week')).toBe(604_800_000);
    });

    it('parses "2w3d"', () => {
      expect(parse('2w3d')).toBe(1_468_800_000);
    });

    it('parses "1w"', () => {
      expect(parse('1w')).toBe(604_800_000);
    });
  });

  describe('decimals', () => {
    it('parses "1.5 hours"', () => {
      expect(parse('1.5 hours')).toBe(5_400_000);
    });

    it('parses "0.5d"', () => {
      expect(parse('0.5d')).toBe(43_200_000);
    });
  });

  describe('edge cases', () => {
    it('throws on empty string', () => {
      expect(() => parse('')).toThrow();
    });

    it('throws on whitespace-only string', () => {
      expect(() => parse('   ')).toThrow();
    });

    it('throws on garbage', () => {
      expect(() => parse('not a duration')).toThrow();
    });

    it('throws on unknown unit', () => {
      expect(() => parse('5 fortnights')).toThrow();
    });

    it('parses unit aliases: sec, secs, min, mins, hr, hrs, wk, wks, msec, msecs', () => {
      expect(parse('1sec')).toBe(1_000);
      expect(parse('2secs')).toBe(2_000);
      expect(parse('1min')).toBe(60_000);
      expect(parse('2mins')).toBe(120_000);
      expect(parse('1hr')).toBe(3_600_000);
      expect(parse('2hrs')).toBe(7_200_000);
      expect(parse('1wk')).toBe(604_800_000);
      expect(parse('2wks')).toBe(1_209_600_000);
      expect(parse('1msec')).toBe(1);
      expect(parse('2msecs')).toBe(2);
    });
  });
});
