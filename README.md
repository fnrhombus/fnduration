# fnduration

[![npm version](https://img.shields.io/npm/v/fnduration)](https://www.npmjs.com/package/fnduration)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fnduration)](https://bundlephobia.com/package/fnduration)
[![license](https://img.shields.io/npm/l/fnduration)](./LICENSE)

Bidirectional human-readable duration parsing and formatting. Parse `"3 hours 20 minutes"` to milliseconds and format milliseconds back to `"3 hours 20 minutes"`.

## Why?

Existing packages only go one direction or have limitations:

| Feature | fnduration | [ms](https://npm.im/ms) | [pretty-ms](https://npm.im/pretty-ms) | [parse-duration](https://npm.im/parse-duration) | [human-interval](https://npm.im/human-interval) |
|---------|-----------|-----|-----------|----------------|----------------|
| Parse to ms | Yes | Yes | No | Yes | Yes |
| Format from ms | Yes | Yes (terse only) | Yes | No | No |
| Multiple units | Yes | No (single only) | Yes | Yes | Yes |
| Verbose output | Yes | No | Yes | N/A | N/A |
| Terse output | Yes | Yes | Yes | N/A | N/A |
| Format styles | 3 (long/short/narrow) | 1 | 1 | N/A | N/A |
| Zero dependencies | Yes | Yes | No | No | No |
| TypeScript | Yes | Yes | Yes | No | No |
| Maintained | Yes | Yes | Yes | Stale | Stale |

## Install

```bash
npm install fnduration
```

## Quick Start

```typescript
import { parse, format } from 'fnduration';

// Parse human-readable strings to milliseconds
parse('3 hours 20 minutes');    // 12_000_000
parse('3h20m');                 // 12_000_000
parse('1.5 hours');             // 5_400_000
parse('1 day, 6 hours');        // 108_000_000
parse('2 minutes and 30 seconds'); // 150_000

// Format milliseconds to human-readable strings
format(12_000_000);             // "3 hours 20 minutes"
format(12_000_000, 'short');    // "3h 20m"
format(12_000_000, 'narrow');   // "3h20m"
format(86_400_000);             // "1 day"
```

## API

### `parse(input: string): number`

Parses a human-readable duration string and returns the equivalent in milliseconds. Throws on unparseable input.

**Supported formats:**
- Verbose: `"3 hours 20 minutes"`, `"1 day, 6 hours"`
- Terse: `"3h20m"`, `"2.5h"`, `"500ms"`
- Mixed: `"1 hour 30m"`, `"2h 15 minutes"`
- Separators: commas and "and" are ignored

**Recognized units:**

| Unit | Aliases |
|------|---------|
| millisecond | `ms`, `msec`, `msecs`, `millisecond`, `milliseconds` |
| second | `s`, `sec`, `secs`, `second`, `seconds` |
| minute | `m`, `min`, `mins`, `minute`, `minutes` |
| hour | `h`, `hr`, `hrs`, `hour`, `hours` |
| day | `d`, `day`, `days` |
| week | `w`, `wk`, `wks`, `week`, `weeks` |

> **Note:** `"1m"` means 1 minute, not 1 month. Months and years are not supported because they are variable-length.

### `format(ms: number, style?: FormatStyle | FormatOptions): string`

Formats milliseconds into a human-readable duration string.

```typescript
format(12_000_000);                     // "3 hours 20 minutes"
format(12_000_000, 'short');            // "3h 20m"
format(12_000_000, 'narrow');           // "3h20m"
format(90_061_000);                     // "1 day 1 hour 1 minute 1 second"
format(90_061_000, { largest: 2 });     // "1 day 1 hour"
format(0);                              // "0 milliseconds"
format(0, 'short');                     // "0ms"
```

### Format Styles

| Style | Example | Description |
|-------|---------|-------------|
| `'long'` | `"3 hours 20 minutes"` | Full unit names, space-separated, pluralized |
| `'short'` | `"3h 20m"` | Abbreviated units, space-separated |
| `'narrow'` | `"3h20m"` | Abbreviated units, no separator |

### `FormatOptions`

```typescript
interface FormatOptions {
  style?: FormatStyle;  // default: 'long'
  largest?: number;     // show only N largest units
  round?: boolean;      // round smallest displayed unit (default: true)
  units?: Unit[];       // which units to use (default: all from days to ms)
}

type Unit = 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
```

**`largest`** limits output to the N most significant units:
```typescript
format(90_061_000, { largest: 2 });  // "1 day 1 hour"
format(90_061_000, { largest: 1 });  // "1 day"
```

**`round`** rounds the smallest displayed unit (default `true`):
```typescript
format(5_400_000, { largest: 1 });                    // "2 hours" (rounded)
format(5_400_000, { largest: 1, round: false });       // "1 hour"
```

**`units`** restricts which units appear in the output:
```typescript
format(90_061_000, { units: ['hour', 'minute'] });  // "25 hours 1 minute"
```

## License

[MIT](./LICENSE)
