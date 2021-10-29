const sgMail = require('@sendgrid/mail');

let config;

try {
    config = require("../db/config.json");
} catch (error) {
    console.error(error);
}

const sendgrid_api = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;

sgMail.setApiKey(sendgrid_api);

const mail = {
    sendMail: function(user) {
        console.log(user);
        const msg = {
          to: `${user}`,
          from: 'jjohanna.persson@live.se',
          subject: 'Du har fått en inbjudan om att redigera i ett dokument!',
          text: 'Klicka på länken nedan för att registrera dig',
          html: `Klicka på länken nedan för att registrera dig: <br><br> <a href="https://www.student.bth.se/~jopn20/editor/#">Registrera dig här!</a>`,
        };
        sgMail
          .send(msg)
          .then(() => {
             console.log('Email sent')
           })
           .catch((error) => {
             console.error(error)
           })
    }
}

module.exports = mail;
