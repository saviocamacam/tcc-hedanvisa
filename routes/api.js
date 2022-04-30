/* eslint-disable no-else-return */
const express = require('express');

const router = express.Router();
const { checkToken, generateToken, checkTokenMiddleware } = require('../utils/authService');
const models = require('../models/index');

router.post('/signup', async (req, res) => {
  if (!req.body.shortName || !req.body.password || !req.body.mainEmail) {
    res.status(400).json({
      success: false,
      message: 'All fields are required.',
    });

    return;
  }

  try {
    const newContact = new models.Contact({
      type: 'email',
      address: req.body.mainEmail,
    });

    let newUser = new models.User({
      shortName: req.body.shortName.toLowerCase(),
      password: req.body.password,
    });

    await newUser.save();
    await newContact.save();

    await models.User.findByIdAndUpdate(newUser._id, {
      mainEmail: newContact,
    });
    await models.Contact.findByIdAndUpdate(newContact._id, {
      user: newUser,
    });

    newUser = newUser.toJSON();

    delete newUser.password;
    delete newUser.__v;

    const payload = {
      user: {
        ...newUser,
      },
    };

    res.status(201).json({
      success: true,
      token: generateToken(payload),
      refreshToken: generateToken(payload, {
        type: 'refresh',
      }),
    });
  } catch (err) {
    let code = 400;
    let message = 'Failed to save user.';
    let data;
    if (err.code === 11000) {
      // const [i, field, value] = err.message.match(
      //   /index:\s([a-z]+).*{\s?\:\s?"([a-z]+)"/i,
      // );
      code = 409;
      message = 'This user already exists.';
      // data = field;
    }

    res.status(code).json({
      success: false,
      message,
      data,
    });
  }
});

router.post('/token', async (req, res) => {
  const token = req.headers['x-refresh-token'] || req.body['x-refresh-token'];
  const decoded = checkToken(token, true);

  if (decoded) {
    delete decoded.exp;
    delete decoded.iat;

    try {
      const user = await models.User.findOne({
        shortName: decoded.user.shortName,
      });

      if (!user) throw Error;

      res.json({
        sucess: true,
        refreshedToken: generateToken(decoded),
      });
    } catch (err) {
      res.status(401).json({
        sucess: false,
        message: 'User not found.',
      });
    }
  } else {
    res.status(401).json({
      sucess: false,
      message: 'An invalid token was provided.',
    });
  }
});

router.post('/updateToken', checkTokenMiddleware, async (req, res) => {
  try {
    let user = await models.User.findById(req.decoded.user._id)
      .populate({
        path: 'people',
        model: 'People',
        select: 'name _id',
      })
      .populate({
        path: 'profiles',
        model: 'Profile',
        select: '_id role',
        populate: [{ path: 'role', model: 'Role' }],
      });
    if (user) {
      user = user.toJSON();

      delete user.password;
      delete user.__v;

      const payload = {
        user: {
          ...user,
        },
      };

      res.json({
        success: true,
        token: generateToken(payload),
        refreshToken: generateToken(payload, {
          type: 'refresh',
        }),
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'User not found.',
      });
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
});

router.post('/signin', async (req, res) => {
  /** Aceita os padrões de número:
   * +5544999999999
   * 44999999999
   * 999999999
   */
  const phoneRE = /^((\+[0-9]{4})|([0-9]{2}))?([0-9]{9})$/;
  const emailRE = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const { shortName } = req.body;

  try {
    let obj = {
      shortName,
    };

    const phoneValidate = phoneRE.test(shortName);
    const emailValidate = emailRE.test(shortName);

    if (phoneValidate || emailValidate) {
      const contact = await models.Contact.findOne({
        address: new RegExp(shortName.replace('+', '')),
      });

      if (phoneValidate && contact !== null) {
        obj = {
          mainPhone: contact._id,
        };
      } else if (emailValidate && contact !== null) {
        obj = {
          mainEmail: contact._id,
        };
      } else if (contact === null) {
        throw 'Contato não encontrado';
      }
    }

    let user = await models.User.findOne(obj)
      .populate({
        path: 'people',
        model: 'People',
        select: 'name _id',
      })
      .populate({
        path: 'mainPhone',
        model: 'Contact',
        select: 'checked',
      })
      .populate({
        path: 'mainEmail',
        model: 'Contact',
        select: 'checked',
      });

    if (emailValidate && !user.mainEmail.checked) {
      return res.status(401).send({
        success: false,
        message: 'Email não verificado.',
      });
    } else if (phoneValidate && !user.mainPhone.checked) {
      return res.status(401).send({
        success: false,
        message: 'Telefone não verificado.',
      });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      user = user.toJSON();

      delete user.password;
      delete user.__v;

      const payload = {
        user: {
          ...user,
        },
      };
      res.json({
        success: true,
        token: generateToken(payload),
        refreshToken: generateToken(payload, {
          type: 'refresh',
        }),
      });
    } else {
      res.status(401).send({
        success: false,
        message: 'Wrong password.',
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      success: false,
      message: 'Authentication failed, user not found.',
      error: err.message,
    });
  }
});

module.exports = router;
