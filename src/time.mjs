const units = {
  ms: 0.001,
  millisecond: 0.001,
  milliseconds: 0.001,
  s: 1,
  second: 1,
  seconds: 1,
  m: 60,
  min: 60,
  minute: 60,
  minutes: 60,
  h: 3600,
  hour: 3600,
  hours: 3600,
  d: 86400,
  day: 86400,
  days: 86400,
  w: 604800,
  week: 604800,
  weeks: 604800
};

/**
 * Convert duration formatted string into number of seconds.
 * @param {number|string} value 
 * @returns {number} seconds
 */
export function parseTime(value) {
  if (typeof value === "string") {
    let seconds = 0;

    for (const match of value.matchAll(/([\d\.\-]+)\s*(\w*)/gi)) {
      const v = parseFloat(match[1]);

      if (match[2]) {
        seconds += v * units[match[2]];
      } else {
        seconds += v;
      }
    }

    return seconds;
  }

  return value;
}
