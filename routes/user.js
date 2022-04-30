const express = require('express');
const User = require('../models/user');
const People = require('../models/people');
const Profile = require('../models/profile/profile');
const Contact = require('../models/contact');

const router = express.Router();
const { generateToken, checkTokenMiddleware } = require('../utils/authService');

router.get('/user-info', checkTokenMiddleware, async (req, res) => {
  //
  try {
    const user = await User.findOne(
      {
        _id: req.decoded.user._id,
      },
      '-password -__v',
    )
      .populate({
        path: 'mainEmail',
        model: 'Contact',
        math: {
          _id: {
            $ne: null,
          },
        },
      })
      .populate({
        path: 'mainPhone',
        model: 'Contact',
        math: {
          _id: {
            $ne: null,
          },
        },
        select: '-user -__v -createdAt -updatedAt',
      })
      .populate({
        path: 'people',
        model: 'People',
        math: {
          _id: {
            $ne: null,
          },
        },
      })
      .populate({
        path: 'profiles',
        model: 'Profile',
        select: '-news -follow -documents -contacts -updatedAt -createdAt -__v',
        populate: [
          {
            path: 'role',
            model: 'Role',
          },
          {
            path: 'classrooms',
            model: 'Classroom',
            select: 'series subClass shift',
          },
          {
            path: 'school',
            model: 'Link',
            select: 'requested status',
            populate: [
              {
                path: 'requested',
                model: 'ProfileSchoolInstitutional',
                select: 'institution countyInstitutional currentYear',
                populate: [
                  {
                    path: 'institution',
                    model: 'InstitutionSchool',
                  },
                  {
                    path: 'countyInstitutional',
                    model: 'ProfileCountyInstitutional',
                    select: 'name state_id',
                  },
                ],
              },
            ],
          },
          {
            path: 'county',
            model: 'Link',
            select: 'requested status',
            populate: [
              {
                path: 'requested',
                model: 'ProfileCountyInstitutional',
                select: 'institution name currentYear',
              },
            ],
          },
        ],
      });
    if (user) {
      res.status(200).json({
        success: true,
        message: 'User informations has found',
        data: {
          user,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found.',
        data: {
          user,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.post('/user-info', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.decoded.user._id,
    })
      .populate({
        path: 'mainPhone',
        model: 'Contact',
        math: {
          _id: {
            $ne: null,
          },
        },
      })
      .populate({
        path: 'mainEmail',
        model: 'Contact',
        math: {
          _id: {
            $ne: null,
          },
        },
      });

    if (!user.mainPhone && req.body.mainPhone) {
      const newPhone = await new Contact({
        address: req.body.mainPhone,
        type: 'cellphone',
      });
      await newPhone.save();
      user.mainPhone = newPhone;
      await Contact.findByIdAndUpdate(newPhone._id, {
        user,
      });
    }
    if (!user.mainEmail && req.body.mainEmail) {
      const newEmail = await new Contact({
        address: req.body.mainEmail,
        type: 'email',
      });
      await newEmail.save();
      user.mainEmail = newEmail;
      await Contact.findByIdAndUpdate(newEmail._id, {
        user,
      });
    }
    if (req.body.oldPassword && req.body.password) {
      user.comparePassword(req.body.oldPassword, (err, isMatch) => {
        if (isMatch && !err) {
          user.password = req.body.password;
        } else {
          res.status(400).json({
            success: false,
            message: "Passwords doesn't match",
          });
        }
      });
    }

    if (req.body.shortName) user.shortName = req.body.shortName;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User has updated',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.put('/user-info', checkTokenMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.body._id)
      .populate({
        path: 'mainEmail',
        model: 'Contact',
      })
      .populate({
        path: 'mainPhone',
        model: 'Contact',
      });

    if (user) {
      if (user.mainEmail && req.body.user.mainEmail) {
        user.mainEmail.address = req.body.user.mainEmail;
        await user.mainEmail.save();
      } else if (!user.mainEmail && req.body.user.mainEmail) {
        const newEmail = await Contact.create({
          type: 'email',
          address: req.body.user.mainEmail,
        });

        user.mainEmail = newEmail._id;
        newEmail.user = user._id;
        await newEmail.save();
      }

      if (user.mainPhone && req.body.user.mainPhone) {
        user.mainPhone.address = req.body.user.mainPhone;
        await user.mainPhone.save();
      } else if (!user.mainPhone && req.body.user.mainPhone) {
        const newPhone = await Contact.create({
          type: 'cellphone',
          address: req.body.user.mainPhone,
        });

        user.mainPhone = newPhone._id;
        newPhone.user = user._id;
        await newPhone.save();
      }

      if (
        req.body.user.password
        && req.body.user.oldPassword
        && (await user.comparePassword(req.body.user.oldPassword))
      ) {
        user.password = req.body.user.password;
      } else if (req.body.user.password || req.body.user.oldPassword) {
        return res.status(401).send({
          success: false,
          message: 'WRONG_PASSWORD',
        });
      }

      if (req.body.user.mainProfile) {
        user.mainProfile = req.body.user.mainProfile;
      }

      if (req.body.user.shortName) {
        user.shortName = req.body.user.shortName;
      }

      await user.save();
      console.log('save');

      user = await User.findById(req.body._id)
        .populate({
          path: 'mainEmail',
          model: 'Contact',
        })
        .populate({
          path: 'mainPhone',
          model: 'Contact',
        })
        .populate({
          path: 'mainProfile',
          model: 'Profile',
        });

      res.status(200).json({
        success: true,
        message: 'The user has been updated.',
        data: {
          user,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/profiles', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.decoded.user._id,
      profiles: {
        $exists: true,
      },
    }).populate({
      path: 'profiles',
      model: 'Profile',
      select: '-news -follow -contacts -updatedAt -createdAt -__v',
      populate: [
        {
          path: 'documents',
          model: 'Document',
        },
        {
          path: 'role',
          model: 'Role',
        },
        {
          path: 'classrooms',
          model: 'Classroom',
          select: 'series subClass shift',
        },
        {
          path: 'user',
          model: 'User',
          select: 'mainProfile',
        },
        {
          path: 'school',
          model: 'Link',
          select: 'requested status',
          populate: [
            {
              path: 'requested',
              model: 'ProfileSchoolInstitutional',
              select: 'institution countyInstitutional currentYear',
              populate: [
                {
                  path: 'institution',
                  model: 'InstitutionSchool',
                },
                {
                  path: 'countyInstitutional',
                  model: 'ProfileCountyInstitutional',
                  select: 'name state_id',
                },
              ],
            },
          ],
        },
        {
          path: 'county',
          model: 'Link',
          select: 'requested status',
          populate: [
            {
              path: 'requested',
              model: 'ProfileCountyInstitutional',
              select: 'name currentYear',
            },
          ],
        },
        {
          path: 'enrollments',
          model: 'Link',
          select: 'requested status',
          populate: [
            {
              path: 'requested',
              model: 'Enrollment',
              select: 'classrooms',
              populate: [
                {
                  path: 'classrooms',
                  model: 'Classroom',
                  select: '_id shift series school hour external_id professors',
                },
              ],
            },
          ],
        },
        {
          path: 'childs',
          model: 'Link',
          select: 'requested status',
          populate: [
            {
              path: 'requested',
              model: 'Enrollment',
              select: 'profileStudent',
              populate: [
                {
                  path: 'profileStudent',
                  model: 'Link',
                  select: 'requesting',
                  populate: [
                    {
                      path: 'requesting',
                      model: 'ProfileStudent',
                      select: 'user',
                      populate: [
                        {
                          path: 'user',
                          model: 'User',
                          select: 'people',
                          populate: [
                            {
                              path: 'people',
                              model: 'People',
                              select: 'name',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (user) {
      res.status(res.statusCode).json({
        success: true,
        data: {
          profiles: user.profiles,
          main: user.mainProfile,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User has no profiles.',
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Profile search error.',
    });
  }
});

router.post('/profiles', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.decoded.user._id);

    const newProfile = new Profile();
    newProfile.user = user;
    newProfile.type = req.body.profileType;
    await newProfile.save();
    await user.profiles.push(newProfile);
    await user.save();

    res.status(200).send({
      success: true,
      message: 'User created successfully.',
    });
  } catch (error) {
    res.status(404).send({
      success: true,
      message: error.message,
    });
  }
});

router.post('/basicinfo', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      people: {
        $exists: true,
      },
    }).populate({
      path: 'people',
      model: 'People',
      math: {
        _id: {
          $ne: null,
        },
      },
    });

    const message = '';
    if (user) {
      user.shortName = req.body.shortName;
      user.password = req.body.password;
      user.people.name = req.body.name;

      await user.people.save();
      await user.save();
      res.status(200).json({
        success: true,
        data: {
          user,
        },
      });
    } else {
      const newPeople = new People();
      newPeople.name = req.body.name;

      const newUser = new User();
      newUser.mainPhone = req.decoded.contact._id;
      // newUser.people = newPeople;
      newUser.shortName = req.body.shortName;
      newUser.password = req.body.password;
      // newPeople.user = newUser;

      await newUser.save();
      await newPeople.save();
      await People.findByIdAndUpdate(newPeople._id, {
        user: newUser,
      });

      await User.findByIdAndUpdate(newUser._id, {
        people: newPeople,
      });

      if (req.body.mainEmail) {
        const newContact = await new Contact({
          type: 'email',
          address: req.body.mainEmail,
          user: newUser._id,
        }).save();
        console.log(newContact);
        await User.findByIdAndUpdate(newUser._id, {
          mainEmail: newContact._id,
        });
      }

      await Contact.findByIdAndUpdate(req.decoded.contact._id, {
        user: newUser,
      });
      const user2 = newUser.toJSON();

      delete user2.password;
      delete user2.__v;

      const payload = {
        user: {
          ...user2,
        },
      };
      res.status(201).json({
        message,
        success: true,
        token: generateToken(payload),
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      const [i, field, value] = error.message.match(
        // eslint-disable-next-line no-useless-escape
        /index:\s([a-z]+).*{\s?\:\s?"([a-z0-9]+)"/i,
      );

      res.status(409).send({
        code: error.code,
        success: false,
        message: error.message,
        data: {
          fields: field,
          i,
          value,
        },
      });
    } else {
      res.status(404).send({
        code: error.code,
        success: false,
        message: error.message,
      });
    }
  }
});

router.get('/basic-info', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.decoded.user._id)
      .select('shortName people mainEmail mainPhone profiles')
      .populate({
        path: 'people',
        model: 'People',
        select: 'name',
      })
      .populate({
        path: 'mainEmail',
        model: 'Contact',
        select: 'address checked',
      })
      .populate({
        path: 'mainPhone',
        model: 'Contact',
        select: 'address checked',
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User has found',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).send({
      code: error.code,
      success: false,
      message: error.message,
    });
  }
});

router.get('/:id/user-info', checkTokenMiddleware, (req, res) => {
  User.findById(req.params.id).then((user, err) => {
    if (err) throw err;
    if (user) {
      res.send({
        status: 200,
        message: 'Informações de usuário encontradas.',
        user,
      });
    } else {
      res.send({
        status: 400,
        message: 'Informações de usuário não encontradas.',
      });
    }
  });
});

router.get('/shortName-exists/:shortName', async (req, res) => {
  const phoneRE = /^((\+[0-9]{4})|([0-9]{2}))?([0-9]{9})$/;
  const emailRE = /^[a-zA-Z0-9.!#$%&’*/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  try {
    const { shortName } = req.params;

    let obj = {
      shortName,
    };

    const phoneValidate = phoneRE.test(shortName);
    const emailValidate = emailRE.test(shortName);


    if (phoneValidate || emailValidate) {
      const contact = await Contact.findOne({
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

    const user = await User.findOne(obj);

    if (user) {
      res.status(200).json({
        succcess: true,
        message: 'User has been found.',
        data: {
          shortNameExists: true,
        },
      });
    } else {
      res.status(404).json({
        succcess: true,
        message: "User hasn't found.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

module.exports = router;
