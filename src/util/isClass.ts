export function isClass(value: any) {
  return typeof value === 'function' && /^class\s/.test(value.toString());
}