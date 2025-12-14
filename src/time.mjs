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
export function parseDuration(value) {
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

const durations = [
  [604800, "w"],
  [86400, "d"],
  [3600, "h"],
  [60, "m"],
  [1, "s"]
];

/**
 * 
 * @param {number} seconds 
 * @returns {string} formatted duration
 */
export function formatDuration(seconds) {
  const out = [];
  for (const d of durations) {
    const n = Math.floor(seconds / Number(d[0]));
    if (n > 0) {
      out.push(`${n}${d[1]}`);
      seconds -= n * Number(d[0]);
    }
  }

  return out.join(" ");
}

const durationsISO = [
  [86400, "D"],
  [3600, "H"],
  [60, "M"],
  [1, "S"]
];

/**
 * 
 * @param {number} seconds 
 * @returns {string} formatted duration
 */
export function formatDurationISO(seconds) {
  let out = "P";
  let t = false;

  for (const d of durationsISO) {
    if (seconds < 86400 && !t) {
      out += "T";
      t = true;
    }

    const n = Math.floor(seconds / Number(d[0]));
    if (n > 0) {
      out += `${n}${d[1]}`;
      seconds -= n * Number(d[0]);
    }
  }

  return out;
}