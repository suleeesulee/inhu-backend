export default () => ({
  userMail: {
    schoolEmailDomains: process.env.SCHOOL_EMAIL_DOMAINS
      ? process.env.SCHOOL_EMAIL_DOMAINS.split(',')
      : ['inha.edu'],
  },
});
