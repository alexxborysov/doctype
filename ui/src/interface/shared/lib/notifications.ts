import { notifications as _notifications } from '@mantine/notifications';

export const notifications = {
  accountCreated() {
    _notifications.show({
      title: 'Account Created',
      message: 'Welcome to Doctype!',
      autoClose: 5000,
    });
  },
  notVerifiedAccount() {
    _notifications.show({
      title: 'Account is not verified',
      message: 'Please, provide your verification code.',
      autoClose: 10000,
    });
  },

  showCloudSyncReminder() {
    setTimeout(() => {
      _notifications.show({
        title: 'Could Storage',
        message: 'Sign In to sync your progress with Cloud!',
        autoClose: 10000,
      });
    }, 15500);
  },

  oauthFailed() {
    _notifications.show({
      title: 'OAuth Sign-In Failed',
      message: 'Unfortunately, we cannot proceed with the sign-in now',
      color: 'red',
      autoClose: 6000,
    });
  },

  receivedCloudUpdates() {
    _notifications.show({
      title: 'Cloud Storage',
      message: `You've received few updates from cloud!`,
      color: 'lime',
      autoClose: 12000,
    });
  },

  progressSavedToCloud() {
    _notifications.show({
      id: 'saved-to-cloud',
      title: 'Cloud Storage',
      message: 'Your progress successfully saved to cloud.',
      color: 'green',
      autoClose: 12000,
    });
  },

  noteNotCreated() {
    _notifications.show({
      title: 'Failed',
      message: 'Oops, note was not created.',
      color: 'red',
      autoClose: 6000,
    });
  },

  noteNotRemoved() {
    _notifications.show({
      title: 'Failed',
      message: 'Oops, note was not removed.',
      color: 'red',
      autoClose: 6000,
    });
  },

  noteNotRenamed() {
    _notifications.show({
      title: 'Failed',
      message: 'Oops, note was not renamed.',
      color: 'red',
      autoClose: 6000,
    });
  },

  noteNotFound() {
    _notifications.show({
      title: 'Redirected to Home',
      message: 'Note was not found...',
      color: 'gray',
      autoClose: 7000,
    });
  },
};
