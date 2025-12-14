const units = {
  ms: 0.001,
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800
};

/**
 * 
 * @param {number|string} value 
 * @returns {number}
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
