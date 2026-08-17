export default () => ({
  pushNotification: {
    apn: {
      teamId: process.env.PUSH_NOTIFICATION_APN_TEAM_ID || '',
      keyId: process.env.PUSH_NOTIFICATION_APN_KEY_ID || '',
      privateKey: (process.env.PUSH_NOTIFICATION_APN_KEY || '').replace(
        /\\n/g,
        '\n',
      ),
      bundleId: process.env.PUSH_NOTIFICATION_APP_BUNDLE_ID,
    },
    fcm: {
      keyFile: process.env.FCM_KEY_FILE || 'FCM_admin_key.json',
    },
  },
});
