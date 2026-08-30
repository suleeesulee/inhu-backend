export default () => ({
  mail: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT || '587', 10) || 587,
    from: {
      name: process.env.MAIL_FROM_NAME || '인하밥길',
      address: process.env.MAIL_FROM_ADDRESS || 'service@inhu.co.kr',
    },
  },
});
