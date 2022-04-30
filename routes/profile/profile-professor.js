const express = require('express');

const router = express.Router();
const { checkTokenMiddleware } = require('../../utils/authService');
const models = require('../../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.get('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(req.params._id);

    if (professor) {
      res.status(200).json({
        success: true,
        message: 'Profile has found',
        data: {
          profile: professor,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
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

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    const user = await models.User.findById(req.body.user);
    const professor = {
      ...req.body,
    };
    if (user) {
      delete professor.school;

      const newProfessor = new models.ProfileProfessor(professor);
      if (req.body.hasSchool) {
        const school = await models.ProfileSchoolInstitutional.findById(
          req.body.school,
        );
        const newLink = new models.Link({
          requested: school._id,
          requesting: newProfessor._id,
          status: 'waiting',
        });

        await newProfessor.save();

        try {
          await newLink.save();
          await school.professors.push(newLink);
          newProfessor.school = newLink._id;
          await school.save();
          await newProfessor.save();
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: error.message,
            error,
          });
        }
      } else await newProfessor.save();
      // Se for o primeiro perfil, ele é o principal por padrão
      if (user.profiles.length === 0) {
        user.mainProfile = newProfessor._id;
      }
      user.profiles.push(newProfessor);
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Professor profile has been created',
        data: {
          profile: newProfessor,
        },
      });
    } else {
      res.status(404).json({
        success: true,
        message: 'User not found',
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

router.put('/', checkTokenMiddleware, async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(
      req.body._id,
    ).populate({
      path: 'schools',
      model: 'Link',
    });

    if (professor) {
      professor.serie = req.body.serie;
      professor.level = req.body.level;
      professor.subjects = req.body.subjects;
      professor.documents = req.body.documents;
      professor.schools = req.body.shools;

      if (req.body.hasSchool) {
        req.body.schools.forEach(async (element) => {
          const school = await models.ProfileSchoolInstitutional.findById(
            element,
          );
          const newLink = new models.Link({
            requested: school._id,
            requesting: professor._id,
            status: 'waiting',
          });
          await newLink.save();
          await school.professors.push(newLink);
          await professor.schools.push(newLink);
          await school.save();
        });
      }

      await professor.save();

      res.status(200).json({
        success: true,
        message: 'The Professor Profile has been updated.',
        data: {
          profile: professor,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The Professor Profile has not found.',
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

router.get('/:id/subjects', async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(req.params.id);
    if (professor) {
      res.status(200).json({
        success: true,
        message: 'Professor found',
        data: {
          subjects: professor.subjects,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Professor not found',
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// router.get("/:_id/question", checkTokenMiddleware, async (req, res) => {
//   try {
//     let documents =
//   } catch (error) {
//     badRequestError(res, error.message);
//   }
// });

router.delete(
  '/:_id/question/:_idQuestion',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const doc = await models.Document.findOneAndRemove({
        _id: req.params._idQuestion,
        owner: req.params._id,
      });
      if (doc) {
        console.log(doc._id);
        res.status(200).json({
          success: true,
          message: 'QUESTION_DELETED',
          data: doc,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'QUESTION_NOT_FOUND',
        });
      }
    } catch (error) {
      console.error(error);
      badRequestError(res, error.message);
    }
  },
);

router.get(
  '/:_id/question/:_idQuestion',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const question = await models.Document.find({
        _id: req.params._idQuestion,
        owner: req.params._id,
        'meta.type': 'Question',
      }).populate({
        path: 'owner',
        model: 'Profile',
        select: 'user school',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: 'shortName people',
            populate: { path: 'people', model: 'People', select: 'name' },
          },
          {
            path: 'school',
            model: 'Link',
            select: 'requested',
            populate: {
              path: 'requested',
              model: 'Profile',
              select: 'institution',
              populate: {
                path: 'institution',
                model: 'Institution',
                select: 'name',
              },
            },
          },
        ],
      });
      if (question.length > 0) {
        res.status(200).json({
          success: true,
          message: 'question found',
          data: question[0],
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'question not found',
        });
      }
    } catch (error) {
      console.error(error);
      badRequestError(res, error.message);
    }
  },
);

router.post('/:_id/question', checkTokenMiddleware, async (req, res) => {
  try {
    const document = await models.Document.create({
      meta: req.body.meta,
      content: req.body.content,
      owner: req.params._id,
    });
    await models.Profile.findByIdAndUpdate(req.params._id, {
      $push: { documents: document._id },
    });
    res.status(200).json({
      success: true,
      message: 'Document has been created',
      data: {
        document,
      },
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

// Planejamento diário
router.post('/:_id/planning/daily/', checkTokenMiddleware, async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(req.params._id);

    if (professor) {
      const newDailyPlanning = new models.Document({
        meta: req.body.meta,
        content: req.body.content,
        owner: professor._id,
      });
      if (req.body.attachments) {
        newDailyPlanning.attachments = req.body.attachments;
      }
      await newDailyPlanning.save();
      professor.documents.push(newDailyPlanning);
      await professor.save();

      res.status(200).json({
        success: true,
        message: 'Document has been created',
        data: {
          planning: newDailyPlanning,
        },
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Profile not found',
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

// Questões
router.post('/:_id/document/', checkTokenMiddleware, async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(req.params._id);

    if (professor) {
      const newDocument = await models.Document.create({
        meta: req.body.meta,
        content: req.body.content,
        owner: professor._id,
      });
      await models.ProfileProfessor.findByIdAndUpdate(professor._id, {
        $push: {
          documents: newDocument._id,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Document has been created',
        data: newDocument,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Profile not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get(
  '/:_id/planning/v2/daily/:_idPlanning/versions',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const DocumentHistory = await models.Document.getHistoryModel();
      const versions = await DocumentHistory.find({
        parent: req.params._idPlanning,
      }).sort('-version');

      const documentFound = await models.Document.findById(
        req.params._idPlanning,
      );
      let forkedVersions;
      if (documentFound && documentFound.meta && documentFound.meta.forked) {
        forkedVersions = await DocumentHistory.find({
          parent: documentFound.meta.forked,
        }).sort('-version');
      }
      const otherVersions = [];
      let documents;
      if (documentFound && documentFound.meta && documentFound.meta.forked) {
        documents = await models.Document.find({
          'meta.forked._id': documentFound.meta.forked._id,
        }).populate([
          {
            path: 'owner',
            model: 'Profile',
            select: 'user school',
            populate: [
              {
                path: 'user',
                model: 'User',
                select: 'shortName people',
                populate: { path: 'people', model: 'People', select: 'name' },
              },
            ],
          },
        ]);
        await Promise.all(
          documents.map(async (el) => {
            const otherHistoryVersions = await DocumentHistory.find({
              parent: el._id,
            }).sort('-version');
            const otherHistoryVersionsOwner = otherHistoryVersions.map(
              (elVersion) => ({ owner: el.owner.user, ...elVersion._doc }),
            );
            otherVersions.push(...otherHistoryVersionsOwner);
            return otherHistoryVersions;
          }),
        );
      }

      const pullingPlannings = await Promise.all(
        versions.map(async (version) => ({
          ...version._doc,
          pulling: await models.PullRequest.findOne(
            { pullingVersion: version.version, pulling: version.parent },
            'status updatedAt createdAt why',
          ),
          pulled: await models.PullRequest.findOne(
            {
              pulledVersion: version.version,
              pulled: version.parent,
              status: 'accepted',
            },
            'status updatedAt createdAt why',
          ).populate({
            path: 'from',
            model: 'Profile',
            select: 'user school',
            populate: [
              {
                path: 'user',
                model: 'User',
                select: 'shortName people',
                populate: { path: 'people', model: 'People', select: 'name' },
              },
            ],
          }),
        })),
      );

      const suggestions = await models.PullRequest.find({
        pulled: req.params._idPlanning,
        status: 'waiting',
      })
        .sort('-createdAt')
        .populate({
          path: 'from',
          model: 'Profile',
          select: 'user school',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'shortName people',
              populate: { path: 'people', model: 'People', select: 'name' },
            },
          ],
        });

      const suggestionsDetails = await Promise.all(
        suggestions.map(async (el) => {
          const patches = await DocumentHistory.findOne({
            parent: el.pulling,
            version: el.pullingVersion,
          }).sort('-version');
          return { ...el._doc, patches: patches.patches };
        }),
      );

      if (versions.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Planning versions found',
          data: {
            versions: pullingPlannings,
            suggestions: suggestionsDetails,
            forkedVersions,
            otherVersions,
            documents,
          },
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Planning versions not found',
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get(
  '/planning/v2/daily/:_idPlanning/:version',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const { compare, parent } = req.query;
      const { _idPlanning } = req.params;
      const planning = await models.Document.findOne({
        _id: _idPlanning,
        'meta.type': 'DailyPlanning',
      })
        .populate([
          {
            path: 'owner',
            model: 'Profile',
            select: 'user school',
            populate: [
              {
                path: 'user',
                model: 'User',
                select: 'shortName people',
                populate: { path: 'people', model: 'People', select: 'name' },
              },
              {
                path: 'school',
                model: 'Link',
                select: 'requested',
                populate: {
                  path: 'requested',
                  model: 'Profile',
                  select: 'institution',
                  populate: {
                    path: 'institution',
                    model: 'Institution',
                    select: 'name',
                  },
                },
              },
            ],
          },
          {
            path: 'meta.forked.owner',
            model: 'Profile',
            select: 'user school',
            populate: [
              {
                path: 'user',
                model: 'User',
                select: 'shortName people',
                populate: { path: 'people', model: 'People', select: 'name' },
              },
            ],
          },
        ])
        .then(async (doc) => {
          const a = await doc.getVersion(req.params.version);
          a.owner = doc.owner;
          return a;
        });
      // const compare = null;
      let compareVersion = null;

      if (compare && !parent) {
        compareVersion = await models.Document.findOne({
          _id: req.params._idPlanning,
          'meta.type': 'DailyPlanning',
        })
          .populate([
            {
              path: 'owner',
              model: 'Profile',
              select: 'user school',
              populate: [
                {
                  path: 'user',
                  model: 'User',
                  select: 'shortName people',
                  populate: { path: 'people', model: 'People', select: 'name' },
                },
              ],
            },
          ])
          .then(async (doc) => {
            const a = await doc.getVersion(compare);
            a.owner = doc.owner;
            return a;
          });
      } else if (compare && parent) {
        compareVersion = await models.Document.findOne({
          _id: parent,
          'meta.type': 'DailyPlanning',
        })
          .populate([
            {
              path: 'owner',
              model: 'Profile',
              select: 'user school',
              populate: [
                {
                  path: 'user',
                  model: 'User',
                  select: 'shortName people',
                  populate: { path: 'people', model: 'People', select: 'name' },
                },
              ],
            },
          ])
          .then(async (doc) => {
            const a = await doc.getVersion(compare);
            a.owner = doc.owner;
            return a;
          });
      }
      // console.log(planning.meta);
      if (planning) {
        res.status(200).json({
          success: true,
          message: 'Planning found',
          data: planning,
          compare: compareVersion,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Planning not found',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get(
  '/:_id/planning/v2/daily',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const plannings = await models.Document.find({
        owner: req.params._id,
        'meta.type': 'DailyPlanning',
      }).populate([
        {
          path: 'owner',
          model: 'Profile',
          select: 'user school',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'shortName people',
              populate: { path: 'people', model: 'People', select: 'name' },
            },
            {
              path: 'school',
              model: 'Link',
              select: 'requested',
              populate: {
                path: 'requested',
                model: 'Profile',
                select: 'institution',
                populate: {
                  path: 'institution',
                  model: 'Institution',
                  select: 'name',
                },
              },
            },
          ],
        },
        {
          path: 'meta.forked.owner',
          model: 'Profile',
          select: 'user school',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'shortName people',
              populate: { path: 'people', model: 'People', select: 'name' },
            },
          ],
        },
      ]);

      if (plannings.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Plannings was found',
          data: plannings,
        });
      } else {
        res.status(200).json({
          success: false,
          message: 'Plannings not found',
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get(
  '/:_idProfile/document/:_documentType',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const documents = await models.Document.find({
        'meta.type': req.params._documentType,
        owner: req.params._idProfile,
      })
        // .select("-content")
        .populate({
          path: 'owner',
          model: 'Profile',
          select: 'user school',
          populate: [
            {
              path: 'user',
              model: 'User',
              select: 'shortName people',
              populate: { path: 'people', model: 'People', select: 'name' },
            },
            {
              path: 'school',
              model: 'Link',
              select: 'requested',
              populate: {
                path: 'requested',
                model: 'Profile',
                select: 'institution',
                populate: {
                  path: 'institution',
                  model: 'Institution',
                  select: 'name',
                },
              },
            },
          ],
        });

      if (documents.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Documents has found',
          data: {
            documents,
          },
        });
      } else {
        res.status(200).json({
          success: false,
          message: 'Documents not found',
        });
      }
    } catch (error) {
      badRequestError(res, error.message);
    }
  },
);

router.get('/:_id/planning/daily', checkTokenMiddleware, async (req, res) => {
  try {
    const plannings = await models.Document.find({
      owner: req.params._id,
      'meta.theme': req.query.theme,
    });

    if (plannings.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Plannings has found',
        data: {
          plannings,
        },
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Plannings not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.put(
  '/:_id/document/:_document',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const document = await models.Document.findById(req.params._document);
      document.content = req.body.content;
      document.meta = req.body.meta;
      document.attachments = req.body.attachments;

      await document.save();
      console.log(document);
      res.status(200).json({
        success: true,
        message: 'Your daily planning has been updated',
        data: {
          planning: document,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get(
  '/planning/:_id/attachments',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const planning = await models.Document.findById(req.params._id).populate({
        path: 'attachments',
        model: 'Document',
      });

      if (!planning) {
        res.status(404).json({
          success: false,
          message: 'Planning not found',
        });
      }

      const { attachments } = planning;

      if (!attachments) {
        res.status(404).json({
          success: false,
          message: 'Attachments not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Planning has found and their attachments too',
        data: {
          attachments,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get('/:_id/classrooms', checkTokenMiddleware, async (req, res) => {
  try {
    const professor = await models.ProfileProfessor.findById(
      req.params._id,
    ).populate({
      path: 'classrooms',
      model: 'Classroom',
      populate: {
        path: 'year',
        model: 'SchoolYearClassroom',
        select: 'schoolYear',
        populate: {
          path: 'schoolYear',
          model: 'SchoolYear',
          select: 'year',
        },
      },
    });

    if (await !professor) {
      res.status(404).json({
        success: false,
        message: "Professor hasn't found.",
      });
    }

    if ((await professor) && !professor.classrooms) {
      res.status(404).json({
        success: false,
        message: "Classrooms of professor hasn't found.",
      });
    }

    const { classrooms } = professor;

    res.status(200).json({
      success: true,
      message: 'Classrooms has found.',
      data: {
        classrooms,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

module.exports = router;
