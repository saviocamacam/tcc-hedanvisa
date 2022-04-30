const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Contact = require('../models/contact');

const {
  secret,
  tokenLife,
  smsTokenLife,
  secretRefresh,
  refreshTokenLife,
} = require('../config/database');

const checkTokenForSocket = async (token) => {
  const decoded = checkToken(token);
  if (decoded) {
    if (decoded.user) {
      try {
        const user = await User.findById(decoded.user._id).populate({
          path: 'profiles',
          model: 'Profile',
          select: 'county school',
          populate: [
            {
              path: 'county',
              model: 'Link',
            },
            {
              path: 'school',
              model: 'Link',
            },
          ],
        });

        if (!user) {
          // res.status(401).json({
          //   sucess: false,
          //   message: "USER NOT FOUND - token."
          // });
          return null;
        }
      } catch (err) {
        console.log('ERRO USER =>', err);

        // res.status(400).json({
        //   sucess: false,
        //   message: "Failed to authenticate user."
        // });
        return null;
      }
    } else if (decoded.contact) {
      try {
        const contact = await Contact.findById(decoded.contact._id);

        if (!contact) {
          return null;
        }
      } catch (err) {
        return null;
      }
    }

    return decoded;
  }
  return null;
};

const checkTokenMiddleware = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  const decoded = checkToken(token);
  if (decoded) {
    if (decoded.user) {
      try {
        const user = await User.findByIdAndUpdate(decoded.user._id, {
          $set: { lastLogin: new Date().toISOString() },
        }).populate({
          path: 'profiles',
          model: 'Profile',
          select: 'county school',
          populate: [
            {
              path: 'county',
              model: 'Link',
            },
            {
              path: 'school',
              model: 'Link',
            },
          ],
        });

        if (!user) {
          res.status(401).json({
            sucess: false,
            message: 'USER NOT FOUND - token.',
          });
        }
      } catch (err) {
        console.log('ERRO USER =>', err);

        res.status(400).json({
          sucess: false,
          message: 'Failed to authenticate user.',
        });
      }
    } else if (decoded.contact) {
      try {
        const contact = await Contact.findById(decoded.contact._id);

        if (!contact) {
          res.status(401).json({
            sucess: false,
            message: 'CONTACT NOT FOUND - token',
          });
        }
      } catch (err) {
        res.status(400).json({
          sucess: false,
          message: 'Failed to authenticate contact.',
        });
      }
    }

    req.decoded = decoded;
    next();
  } else {
    res.status(401).json({
      sucess: false,
      message: 'An invalid token was provided.',
    });
  }
};

const addFirebaseUserForProfile = async (uid) => await admin.auth().createUser({
  uid,
});

const generateToken = (payload, options = {}) => {
  if (options.type == 'refresh') {
    return jwt.sign(payload, secretRefresh, {
      expiresIn: refreshTokenLife,
    });
  }

  return jwt.sign(payload, secret, {
    expiresIn: !options.type ? tokenLife : smsTokenLife,
  });
};

const checkToken = (token, isRefreshToken = false) => {
  const secretKey = isRefreshToken ? secretRefresh : secret;
  return jwt.verify(token, secretKey, (err, decoded) => (err ? null : decoded));
};

const updateToken = (token, newField) => {
  // console.log(token.payload);
  // console.log(newField);
  // console.log(token.payload + newField);
  // return jwt.sign(token.payload + newField);
};

module.exports = {
  checkTokenForSocket,
  checkToken,
  addFirebaseUserForProfile,
  generateToken,
  checkTokenMiddleware,
  updateToken,
};
