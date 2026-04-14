export type FormatStyle = 'long' | 'short' | 'narrow';

export interface FormatOptions {
  style?: FormatStyle;
  largest?: number;
  round?: boolean;
  units?: Unit[];
}

export type Unit = 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

interface UnitDef {
  unit: Unit;
  ms: number;
  long: [string, string];
  short: string;
}

const UNITS: readonly UnitDef[] = [
  { unit: 'day', ms: 86_400_000, long: ['day', 'days'], short: 'd' },
  { unit: 'hour', ms: 3_600_000, long: ['hour', 'hours'], short: 'h' },
  { unit: 'minute', ms: 60_000, long: ['minute', 'minutes'], short: 'm' },
  { unit: 'second', ms: 1_000, long: ['second', 'seconds'], short: 's' },
  { unit: 'millisecond', ms: 1, long: ['millisecond', 'milliseconds'], short: 'ms' },
];

const WEEK_MS = 604_800_000;

const PARSE_ALIASES: ReadonlyMap<string, number> = new Map([
  ['ms', 1], ['msec', 1], ['msecs', 1], ['millisecond', 1], ['milliseconds', 1],
  ['s', 1_000], ['sec', 1_000], ['secs', 1_000], ['second', 1_000], ['seconds', 1_000],
  ['m', 60_000], ['min', 60_000], ['mins', 60_000], ['minute', 60_000], ['minutes', 60_000],
  ['h', 3_600_000], ['hr', 3_600_000], ['hrs', 3_600_000], ['hour', 3_600_000], ['hours', 3_600_000],
  ['d', 86_400_000], ['day', 86_400_000], ['days', 86_400_000],
  ['w', WEEK_MS], ['wk', WEEK_MS], ['wks', WEEK_MS], ['week', WEEK_MS], ['weeks', WEEK_MS],
]);

const SEGMENT_RE = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g;

export function parse(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Cannot parse empty string as duration');

  const cleaned = trimmed.replace(/,\s*/g, ' ').replace(/\band\b/gi, ' ');
  const matches = [...cleaned.matchAll(SEGMENT_RE)];

  if (matches.length === 0) throw new Error(`Cannot parse "${input}" as duration`);

  return matches.reduce((total, [, numStr, unitStr]) => {
    const ms = PARSE_ALIASES.get(unitStr.toLowerCase());
    if (ms === undefined) throw new Error(`Unknown unit "${unitStr}" in "${input}"`);
    return total + parseFloat(numStr) * ms;
  }, 0);
}

function resolveOptions(style?: FormatStyle | FormatOptions): Required<FormatOptions> {
  if (style === undefined || typeof style === 'string') {
    return { style: style ?? 'long', largest: Infinity, round: true, units: UNITS.map(u => u.unit) };
  }
  return {
    style: style.style ?? 'long',
    largest: style.largest ?? Infinity,
    round: style.round ?? true,
    units: style.units ?? UNITS.map(u => u.unit),
  };
}

export function format(ms: number, style?: FormatStyle | FormatOptions): string {
  if (ms < 0) throw new Error('Cannot format negative duration');

  const opts = resolveOptions(style);
  const activeUnits = UNITS.filter(u => opts.units.includes(u.unit));

  const parts = activeUnits.reduce<Array<{ def: UnitDef; value: number }>>((acc, def) => {
    const remaining = ms - acc.reduce((sum, p) => sum + p.value * p.def.ms, 0);
    const value = def === activeUnits[activeUnits.length - 1]
      ? remaining / def.ms
      : Math.floor(remaining / def.ms);
    return value !== 0 || acc.length > 0 ? [...acc, { def, value }] : acc;
  }, []);

  const trimmed = parts.length === 0
    ? [{ def: activeUnits[activeUnits.length - 1], value: 0 }]
    : dropTrailingZeros(parts);

  const limited = trimmed.slice(0, opts.largest);

  const rounded = opts.round && limited.length > 0
    ? roundLastUnit(limited, ms)
    : limited;

  const final = dropTrailingZeros(rounded);
  const display = final.length === 0
    ? [{ def: activeUnits[activeUnits.length - 1], value: 0 }]
    : final;

  const separator = opts.style === 'narrow' ? '' : ' ';

  return display
    .map(({ def, value }) => {
      if (opts.style === 'long') {
        const label = value === 1 ? def.long[0] : def.long[1];
        return `${value} ${label}`;
      }
      return `${value}${def.short}`;
    })
    .join(separator);
}

function roundLastUnit(
  parts: Array<{ def: UnitDef; value: number }>,
  totalMs: number,
): Array<{ def: UnitDef; value: number }> {
  const usedMs = parts.slice(0, -1).reduce((sum, p) => sum + p.value * p.def.ms, 0);
  const last = parts[parts.length - 1];
  const exactValue = (totalMs - usedMs) / last.def.ms;
  return [...parts.slice(0, -1), { ...last, value: Math.round(exactValue) }];
}

function dropTrailingZeros(parts: Array<{ def: UnitDef; value: number }>): Array<{ def: UnitDef; value: number }> {
  const lastNonZero = parts.findLastIndex(p => p.value !== 0);
  return lastNonZero === -1 ? [] : parts.slice(0, lastNonZero + 1);
}
