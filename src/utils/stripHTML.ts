export const stripHTML = (text?: string) =>
  (text || '').replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '').trim();
