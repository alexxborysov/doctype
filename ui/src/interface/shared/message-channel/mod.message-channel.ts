export const messageChannel = {
  post(message: string) {
    navigator.serviceWorker.controller?.postMessage(message);
  },
  on(message: string, callback: VoidFunction) {
    navigator.serviceWorker?.addEventListener('message', ({ data: key }) => {
      if (key === message) {
        callback();
      }
    });
  },
};
