// Vite supplies MODE in development and in compiled builds. Branch-based Pages serves this file directly.
if (import.meta.env?.MODE) {
  import('./src/main.tsx')
} else {
  location.replace(new URL('./demo/' + location.search + location.hash, document.baseURI))
}
