const express = require('express');
const totalvoice = require('totalvoice-node');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const Contact = require('../models/contact');
const Notification = require('../models/notification');
const models = require('../models/index');
const totalvoiceconf = require('../config/totalvoice');
// const twillioConf = require("../config/twillio");
// const twillio = require("twilio")(
//   twillioConf.accountSid,
//   twillioConf.authToken
// );

const sendGridConfig = require('../config/sendgrid');

sgMail.setApiKey(sendGridConfig.apiKey);

// var transporter = nodemailer.createTransport(nodemailerConfig);

let rand; let image; let link; let
  mailOptions;
let sentSms = false;
let host = 'localhost:3000';
if (process.env.NODE_ENV == 'production') {
  sentSms = true;
  host = 'atlaensino.com';
}

const { generateToken, checkTokenMiddleware } = require('../utils/authService');

const client = new totalvoice(totalvoiceconf.token);
const router = express.Router();

router.post('/validation', async (req, res) => {
  try {
    const contact = await Contact.findOne({
      address: req.body.cellphone,
    }).populate({
      path: 'user',
      model: 'User',
      select: 'mainEmail',
      populate: { path: 'mainEmail', model: 'Contact' },
    });

    if (
      contact
      && contact.user
      && contact.user.mainEmail
      && contact.user.mainEmail.checked
    ) {
      res.status(404).json({
        success: false,
        message: 'User account already autenticated',
        data: {
          email: contact.user.mainEmail.address,
        },
      });
    } else if (
      contact
      && req.body.user
      && contact.user
      && req.body.user != contact.user
    ) {
      res.status(404).json({
        success: false,
        message: "User information don't match",
      });
    } else if (contact) {
      const user = await models.User.findById(req.body.user);

      const newNotification = await new Notification();
      newNotification.profile = contact.profile;
      newNotification.via = contact;
      rand = Math.floor(Math.random() * 10000 + 54);
      newNotification.content = rand;

      await newNotification.save();

      if (sentSms) {
        const smsResponse = await sendSMS(
          contact.address,
          newNotification.content,
        );
      }

      const validationToken = generateToken(
        {
          contact: contact.toJSON(),
        },
        {
          type: 'sms',
        },
      );

      res.status(200).json({
        success: true,
        message: 'sended to a existent contact',
        data: {
          validationToken,
        },
      });
    } else {
      const newContact = new Contact();
      newContact.type = 'cellphone';
      newContact.address = req.body.cellphone;
      await newContact.save();
      const newNotification = new Notification();
      newNotification.via = newContact;

      rand = Math.floor(Math.random() * 10000 + 54);
      newNotification.content = rand;

      await newNotification.save();
      if (sentSms) {
        const smsResponse = await sendSMS(
          newContact.address,
          newNotification.content,
        );
      }

      const validationToken = generateToken(
        {
          contact: newContact.toJSON(),
        },

        {
          type: 'sms',
        },
      );

      res.send({
        success: true,
        message: 'message has been sended',
        data: {
          validationToken,
        },
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

deleteNotification = async (notification) => {
  try {
    await Notification.deleteOne({
      _id: notification._id,
    });
  } catch (error) {}
};

router.post('/codecheck', checkTokenMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      content: req.body.code,
      via: req.decoded.contact._id,
    }).populate({
      path: 'via',
      populate: {
        path: 'user',
        model: 'User',
        select: 'shortName',
        populate: [
          {
            path: 'people',
            model: 'People',
            select: 'name',
          },
          {
            path: 'profiles',
            model: 'Profile',
            select: '_id role',
            populate: [
              {
                path: 'role',
                model: 'Role',
              },
            ],
          },
        ],
      },
    });

    if (!notification.via.user && req.body.user) {
      await models.User.findOneAndUpdate(
        {
          _id: req.body.user,
          mainPhone: { $exists: false },
        },
        { $set: { mainPhone: notification.via } },
      );
      await models.Contact.findOneAndUpdate(
        { _id: notification.via },
        { $set: { user: req.body.user } },
      );
      deleteNotification(notification);
      res.status(200).json({
        message: 'correct code, user not found',
        success: true,
      });
    } else if (notification && notification.via.user) {
      const contact = await Contact.findById(notification.via);
      contact.checked = true;
      await contact.save();
      deleteNotification(notification);
      user = notification.via.user.toJSON();

      delete user.password;
      delete user.__v;

      const payload = {
        user: {
          ...user,
        },
      };

      res.status(200).json({
        message: 'Correct code, user found.',
        success: true,
        data: {
          user: notification.via.user,
        },
        token: generateToken(payload),
      });
    } else if (notification) {
      deleteNotification(notification);
      res.status(200).json({
        message: 'correct code, user not found',
        success: true,
      });
    } else {
      res.status(404).json({
        message: 'Invalid code.',
        success: false,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
});

router.post('/send-email-validation', async (req, res) => {
  try {
    const contact = await Contact.findOne({
      address: req.body.email,
    });

    if (contact) {
      if (contact.checked) {
        res.status(304).json({
          success: true,
          message: 'This contact is already validated',
          data: {
            contact,
          },
        });
      } else {
        await Notification.deleteMany({
          via: contact._id,
        });

        rand = Math.floor(Math.random() * 1000000 + 54);
        link = `http://${host}/auth/validacao-email?id=${rand}`;

        const mailOptions = {
          // from: `"OCAMACAM" <${nodemailerConfig.auth.user}>`,
          from: sendGridConfig.from,
          to: [req.body.email],
          subject: 'Confirmação de e-mail.',
          html: `
          <div align="center">
            Olá, ${req.body.shortName}!
            Clique no link abaixo para validar o seu email.
            <a href=${link} style="margin-top: 32px">Confirmar Email</a>
          </div>
          `,
        };

        sgMail.send(mailOptions);

        const notification = await new Notification({
          via: contact._id,
          content: rand,
        });

        await notification.save();

        await res.status(200).json({
          success: true,
          message: 'The verification email has been successfully sent',
          data: {
            notification,
          },
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// router.post("/send-email-validation", async (req, res) => {
//   try {
//     let contact = await Contact.findOne({
//       address: req.body.email
//     });

//     if (contact) {
//       if (contact.checked) {
//         res.status(304).json({
//           success: true,
//           message: "This contact is already validated",
//           data: {
//             contact
//           }
//         });
//       } else {
//         await Notification.deleteMany({
//           via: contact._id
//         });

//         rand = Math.floor(Math.random() * 1000000 + 54);
//         link = `http://${host}/auth/validacao-email?id=${rand}`;

//         let path = await `${__dirname.substring(
//           0,
//           __dirname.length - 7
//         )}/public/email-templates`;

//         var readHTMLFile = function (_path, callback) {
//
//           fs.readFile(
//             _path, {
//               encoding: "utf-8"
//             },
//             function (err, html) {
//               if (err) {
//                 throw err;
//                 callback(err);
//               } else {
//                 callback(null, html);
//               }
//             }
//           );
//         };

//         await readHTMLFile(`${path}/email-confirm.html`, function (err, html) {
//           var template = handlebars.compile(html);
//           var replacements = {
//             shortName: req.body.shortName,
//             validationLink: link
//           };
//           var htmlToSend = template(replacements);
//           var mailOptions = {
//             from: `"OCAMACAM" <${nodemailerConfig.auth.user}>`,
//             to: req.body.email,
//             subject: "Confirmação de e-mail.",
//             html: htmlToSend
//           };
//           transporter.sendMail(mailOptions, function (error, response) {
//             if (error) {
//
//             }
//           });
//         });

//         let notification = await new Notification({
//           via: contact._id,
//           content: rand
//         });

//         await notification.save();

//         await res.status(200).json({
//           success: true,
//           message: "The verification email has been successfully sent",
//           data: {
//             notification
//           }
//         });
//       }
//     } else {
//       res.status(204).json({
//         success: true,
//         message: "Email not found"
//       });
//     }
//   } catch (error) {
//
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// *** ESTA ROTA FOI IMPLEMENTADA COM A FINALIDADE DE ENVIAR EMAIL COM LAYOUT PARA MÚLTIPLOS DESTINATÁRIOS ***
router.post('/send_email', async (req, res) => {
  try {
    const path = await `${__dirname.substring(
      0,
      __dirname.length - 7,
    )}/public/email-templates`;
    const readHTMLFile = function (_path, callback) {
      fs.readFile(
        _path,
        {
          encoding: 'utf-8',
        },
        (err, html) => {
          if (err) {
            throw err;
            callback(err);
          } else {
            callback(null, html);
          }
        },
      );
    };
    await readHTMLFile(`${path}/email.html`, (err, html) => {
      const template = handlebars.compile(html);
      const replacements = {
        shortName: req.body.shortName,
        validationLink: link,
      };
      const htmlToSend = template(replacements);
      const mailOptions = {
        // from: `"OCAMACAM" <${nodemailerConfig.auth.user}>`,
        from: sendGridConfig.from,

        bcc: [req.body.email],
        subject: 'Tutorial do Aplicativo.',
        attachment: 'public/email-templates/tutorial_ATLA_Ensino.pdf',
        // attachments: [
        //   {
        //     path: "public/email-templates/tutorial_ATLA_Ensino.pdf"
        //   }
        // ],
        html: htmlToSend,
      };

      sgMail.send(mailOptions);
    });
    res.status(200).json({
      success: true,
      message: 'The email has been sended.',
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
});

router.post('/send-email-reset-password', async (req, res) => {
  try {
    const contact = await Contact.findOne({
      address: req.body.email,
    });

    if (contact) {
      rand = Math.floor(Math.random() * 10000 + 54);
      link = `http://${host}/auth/reset-password?email=${
        req.body.email
      }&id=${rand}`;

      const path = await `${__dirname.substring(
        0,
        __dirname.length - 7,
      )}/public/email-templates`;

      const readHTMLFile = function (_path, callback) {
        fs.readFile(
          _path,
          {
            encoding: 'utf-8',
          },
          (err, html) => {
            if (err) {
              throw err;
              callback(err);
            } else {
              callback(null, html);
            }
          },
        );
      };

      await readHTMLFile(`${path}/email-reset.html`, (err, html) => {
        const template = handlebars.compile(html);
        const replacements = {
          resetPasswordLink: link,
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
          // from: `"OCAMACAM" <${nodemailerConfig.auth.user}>`,
          from: sendGridConfig.from,
          to: [req.body.email],
          subject: 'OCAMACAM | Nova senha.',
          html: htmlToSend,
        };
        // transporter.sendMail(mailOptions, function(error, response) {
        //   if (error) {
        //
        //     callback(error);
        //   }
        // });
        sgMail.send(mailOptions);
      });

      contact.checked = true;
      await contact.save();

      const notification = await new Notification({
        via: contact._id,
        content: rand,
      });

      await notification.save();

      res.status(200).json({
        success: true,
        message: 'The reset password email has been successfully sent',
        data: {
          notification,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/check-email-reset-password', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      content: req.body.codeCheck,
    });

    const contact = await Contact.findById(notification.via).populate({
      path: 'user',
      model: 'User',
    });

    contact.user.password = req.body.password;

    await contact.user.save();

    await Notification.deleteOne({
      _id: notification._id,
    });

    res.status(200).json({
      success: true,
      message: 'The password has been successfully updated',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/check-email-validation', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      content: req.body.codeCheck,
    });

    if (!notification) {
      res.status(404).json({
        success: false,
        message: `Notification hasn't found with content ${req.body.codeCheck}`,
      });
    }

    const contact = await Contact.findById(notification.via);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: `Contact hasn't found with _id ${notification.via}`,
      });
    }

    contact.checked = true;
    await contact.save();

    await Notification.deleteMany({
      via: contact._id,
    });

    res.status(200).json({
      success: true,
      message: `Email ${contact.address} is been Successfully verified`,
      data: {
        contact,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Bad Request ${error.message}`,
    });
  }
});

sendSMS = /* async */ (address, code) => {
  //

  // return await twillio.messages
  //   .create({
  //     body: `Este é o código de ativacão OCAMACAM: ${code}`,
  //     from: twillioConf.testPhone,
  //     to: `${address}`
  //   })
  //   .then(message => {
  //
  //   })
  //   .done();
  client.sms
    .enviar(`${address}`, `Código: ${code}. Ativacão OCAMACAM.`)
    .then((data) => {})
    .catch((error) => {
      console.error('Erro: ', error);
    });
};

module.exports = router;
