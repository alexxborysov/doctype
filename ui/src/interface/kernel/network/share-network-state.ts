import { messageChannel } from '~/interface/shared/message-channel/mod.message-channel';
import { NETWORK_MESSAGES } from './messages';

export function shareNetworkState() {
  window.addEventListener('online', () => {
    messageChannel.post(NETWORK_MESSAGES.ONLINE);
  });
}
