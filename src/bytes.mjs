export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  if (bytes === 1) return "1 Byte";

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + byteSizes[i]
  );
}

const byteSizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const units = {
  b: 1,
  bytes: 1,
  k: 1024,
  kb: 1024,
  m: 1024 * 1024,
  mb: 1024 * 1024,
  gb: 1024 * 1024 * 1024,
  g: 1024 * 1024 * 1024,
  tb: 1024 * 1024 * 1024 * 1024
};

/**
 * Convert byte size formatted string into number of bytes.
 * @param {number|string} value
 * @returns {number} number of total bytes
 */
export function parseBytes(value) {
  if (typeof value === "string") {
    let bytes = 0;

    for (const match of value.matchAll(/([\d\.\-]+)\s*(\w*)/gi)) {
      const v = parseFloat(match[1]);

      if (match[2]) {
        bytes += v * units[match[2].toLocaleLowerCase()];
      } else {
        bytes += v;
      }
    }

    return bytes;
  }

  return value;
}
