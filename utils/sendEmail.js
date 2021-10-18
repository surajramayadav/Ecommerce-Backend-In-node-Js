const nodeMailer = require("nodemailer");
const {
  SMPT_SERVICE,
  SMPT_MAIL,
  SMPT_PASSWORD,
  SMPT_HOST,
  SMPT_PORT,
} = require("../config/config");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: SMPT_HOST,
    port: SMPT_PORT,
    ignoreTLS: false,
    secure: false,
    service: SMPT_SERVICE,
    auth: {
      user: SMPT_MAIL,
      pass: SMPT_PASSWORD,
    },
  });
  const mailOptions = {
    from: SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
