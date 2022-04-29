const sg = require('@sendgrid/mail');

sg.setApiKey(process.env.SENDGRID_KEY);

const templates = {
  password: process.env.SENDGRID_PASSWORD_TEMPLATE,
  forgot: process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE,
};

// templateData for password {password: ''}, for forgot-password {otp:''}
const sendEmail = async (toEmail, templateData, templateType) => {
  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM,
    templateId: templates[templateType],
    dynamicTemplateData: templateData,
    subject: 'Password',
  };
  return sg.send(msg);
};

module.exports = {
  sendEmail,
};
