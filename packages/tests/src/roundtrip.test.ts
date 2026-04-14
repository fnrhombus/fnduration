import { describe, it, expect } from 'vitest';
import { parse, format } from 'fnduration';

describe('round trip', () => {
  const cases = [
    '3 hours 20 minutes',
    '1 day',
    '1 day 1 hour 1 minute 1 second',
    '42 milliseconds',
    '0 milliseconds',
    '2 hours',
    '10 days',
  ];

  cases.forEach(str => {
    it(`format(parse("${str}")) === "${str}"`, () => {
      expect(format(parse(str))).toBe(str);
    });
  });

  it('round trips short style', () => {
    expect(format(parse('3h20m'), 'short')).toBe('3h 20m');
  });

  it('round trips terse input to long output', () => {
    expect(format(parse('1d6h'))).toBe('1 day 6 hours');
  });
});
