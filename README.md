# fnduration

**Parse durations. Format durations. One package, both directions.**

[![npm version](https://img.shields.io/npm/v/fnduration)](https://www.npmjs.com/package/fnduration)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fnduration)](https://bundlephobia.com/package/fnduration)
[![license](https://img.shields.io/npm/l/fnduration)](./LICENSE)

```ts
import { parse, format } from "fnduration";

parse("3 hours 20 minutes");   // 12_000_000
format(12_000_000);            // "3 hours 20 minutes"
```

1KB gzipped. Zero dependencies. TypeScript-first. ESM + CJS.

---

## The problem

You need two packages to do one thing:

- [`human-interval`](https://www.npmjs.com/package/human-interval) parses `"3 hours"` → ms, but can't go the other way. Stale since 2022.
- [`pretty-ms`](https://www.npmjs.com/package/pretty-ms) formats ms → `"3h 20m"`, but can't parse.
- [`ms`](https://www.npmjs.com/package/ms) does both, but only terse formats — `"3h"` works, `"3 hours"` doesn't.

**fnduration** does both directions, with both terse and verbose formats, in one import.

## Parsing

Throw anything reasonable at it:

```ts
parse("3 hours 20 minutes");        // 12_000_000
parse("3h20m");                      // 12_000_000
parse("1.5 hours");                  // 5_400_000
parse("1 day, 6 hours");            // 108_000_000
parse("2 minutes and 30 seconds");  // 150_000
parse("500ms");                      // 500
parse("2w3d");                       // 1_468_800_000
```

Verbose, terse, mixed, decimal, commas, "and" — all handled. Throws on garbage.

## Formatting

Three styles:

```ts
format(12_000_000);            // "3 hours 20 minutes"
format(12_000_000, "short");   // "3h 20m"
format(12_000_000, "narrow");  // "3h20m"
```

Truncate with `largest`:

```ts
format(90_061_000);                 // "1 day 1 hour 1 minute 1 second"
format(90_061_000, { largest: 2 }); // "1 day 1 hour"
```

Round-trips work:

```ts
format(parse("3 hours 20 minutes")); // "3 hours 20 minutes"
```

Full options docs (style, largest, round, units) on the [wiki](https://github.com/fnrhombus/fnduration/wiki).

## Comparison

| | fnduration | ms | pretty-ms | parse-duration | human-interval |
|---|---|---|---|---|---|
| Parse → ms | ✅ | ⚠️ terse only | ❌ | ✅ | ✅ |
| Format ms → string | ✅ | ⚠️ terse only | ✅ | ❌ | ❌ |
| Multiple units | ✅ | ❌ single only | ✅ | ✅ | ✅ |
| Format styles | 3 | 1 | 1 | — | — |
| TypeScript | ✅ native | ✅ | ✅ | ❌ | ❌ |
| Zero deps | ✅ | ✅ | ❌ | ❌ | ❌ |
| Maintained | ✅ | ✅ | ✅ | ⚠️ stale | ⚠️ stale |
| **Size** (min+gz) | **1KB** | 0.4KB | 1.7KB | 1.2KB | 2KB |

## Install

```bash
npm install fnduration
pnpm add fnduration
```

Requires Node 20+. Works in all modern browsers.

## Support

- **[GitHub Sponsors](https://github.com/sponsors/fnrhombus)**
- **[Buy Me a Coffee](https://buymeacoffee.com/fnrhombus)**

## License

MIT © [fnrhombus](https://github.com/fnrhombus)
