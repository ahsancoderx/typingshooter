let cached = null;
export function hasWebGL() {
  if (cached === null) {
    try {
      const c = document.createElement('canvas');
      cached = !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      cached = false;
    }
  }
  return cached;
}
