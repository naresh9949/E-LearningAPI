const nodemailer = require('nodemailer');
const {SendVerificatinLinktemplate} = require('./EmailTemplate');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });


 const SendVerificationLink = (email,name,link) =>{

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Account Creation Successfull!`,
    html: SendVerificatinLinktemplate(name,link),
  };

    transporter.sendMail(mailOptions, function (err, info) { 
        if (err) {
          return false;
        } else {
          return true;
        }
      });
}



module.exports = {SendVerificationLink}