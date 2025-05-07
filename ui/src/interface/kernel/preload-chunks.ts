export function preloadChunks() {
  setTimeout(() => {
    import('~/interface/view/editor/mod.editor');
    import('~/interface/view/sign-in/view');
  }, 1_000);
}
