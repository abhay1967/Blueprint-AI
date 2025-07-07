// Utility to decode JSON-style Unicode escapes (e.g., \u2502) into readable characters
export function decodeUnicode(str: string): string {
  try {
    return str.replace(/\\u[\dA-Fa-f]{4}/g, (m) =>
      String.fromCharCode(parseInt(m.replace(/\\u/g, ''), 16))
    );
  } catch {
    return str;
  }
}

// Optionally, extract the 'output' field from a JSON string if present
export function extractOutput(content: string): string {
  let line = content.trim();
  if (line.startsWith("data:")) {
    line = line.slice(5).trim();
  }
  try {
    const obj = JSON.parse(line);
    if (typeof obj === 'object' && obj.output) return obj.output;
  } catch {}
  return line;
}
