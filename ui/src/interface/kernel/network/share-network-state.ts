import { NETWORK_MESSAGES } from './messages';

export function shareNetworkState() {
  window.addEventListener('online', () => {
    navigator.serviceWorker.controller?.postMessage(NETWORK_MESSAGES.ONLINE);
  });
}
