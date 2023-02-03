export function simpleHash(code: string) {
  let hash = 0;
  for (var i = 0; i < code.length; i++) {
    var char = code.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
