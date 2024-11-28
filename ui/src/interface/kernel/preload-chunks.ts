export function preloadChunks() {
  setTimeout(() => {
    import('~/interface/view/editor/mod.editor');
    import('~/interface/view/sign-in/view');
  }, 500);
}
