const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const { checkTokenMiddleware } = require('../utils/authService');
const models = require('../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    const schoolYearClassroom = await models.SchoolYearClassroom.findById(
      mongoose.Types.ObjectId(req.body.year),
    );

    const classrooms = await models.Classroom.find({
      external_id: req.body.external_id,
    });
    const { year } = req.body;
    const { school } = req.body;
    if (schoolYearClassroom && classrooms.length == 0) {
      delete req.body.year;
      delete req.body.school;
      const newClassroom = await models.Classroom.create(req.body);
      await models.Classroom.findByIdAndUpdate(newClassroom._id, {
        $set: {
          year: mongoose.Types.ObjectId(year),
          school: mongoose.Types.ObjectId(school),
        },
      });
      await models.SchoolYearClassroom.findByIdAndUpdate(
        schoolYearClassroom._id,
        {
          $push: {
            classrooms: newClassroom._id,
          },
        },
      );
      res.status(201).json({
        success: true,
        message: 'Classroom has been created',
        data: {
          classroom: newClassroom._id,
        },
      });
    } else if (schoolYearClassroom && classrooms.length > 0) {
      res.status(404).json({
        success: false,
        message: 'The class already exists',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'School not found',
      });
    }
  } catch (error) {
    //
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.post(
  '/:_id/linkin-professor',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const { io } = global;

      const classroom = await models.Classroom.findById(req.params._id);
      const professor = await models.ProfileProfessor.findById(
        req.body.professor,
      );

      /* https://github.com/Automattic/mongoose/issues/964
      @albanm certain methods bypass mongoose completely,
      so you don't get the middleware hooks. AFAIK,
      the only way to get the hooks to execute is to use separate find() and save()
      calls as mentioned above.
      */

      if (classroom && professor) {
        // await models.ProfileProfessor.findByIdAndUpdate(req.body.professor, {
        //   $push: {
        //     classrooms: req.params._id
        //   }
        // });

        const modelProfessor = await models.ProfileProfessor.findById(
          req.body.professor,
        );
        modelProfessor.classrooms.push(req.params._id);
        await modelProfessor.save();

        const school = await models.Profile.findById(classroom.school);

        const schoolInstitutional = await models.InstitutionSchool.findById(
          school.institution,
        );

        // Enviando mensagem via socket
        const user = await models.User.findById(modelProfessor.user);
        if (user && user.socket) {
          const socket = io.clients().sockets[user.socket];
          if (socket) {
            socket.emit('update-professor', {
              type: 'link',
              classroomName: `${classroom.series} ${classroom.subClass} - ${
                classroom.shift
              } - ${schoolInstitutional.name}`,
            });
          }
        }

        await models.Classroom.findByIdAndUpdate(req.params._id, {
          $push: {
            professors: req.body.professor,
          },
        });
        // const modelClassroom = await models.Classroom.findById(req.params._id);
        // modelClassroom.professors.push(req.body.professor);
        // await modelClassroom.save();

        res.status(200).json({
          success: true,
          message: 'Linking professor has been updtaded',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Professor or classroom not found',
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
router.post(
  '/:_id/unlinkin-professor',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const { io } = global;
      const classroom = await models.Classroom.findById(req.params._id);
      const professor = await models.ProfileProfessor.findById(
        req.body.professor,
      );

      professor.classrooms.pull(req.params._id);
      await classroom.professors.pull(req.body.professor);
      await classroom.save();
      await professor.save();

      const user = await models.User.findById(professor.user);

      const school = await models.Profile.findById(classroom.school);

      const schoolInstitutional = await models.InstitutionSchool.findById(
        school.institution,
      );

      if (user && user.socket) {
        const socket = io.clients().sockets[user.socket];
        if (socket) {
          socket.emit('update-professor', {
            type: 'unlink',
            classroomName: `${classroom.series} ${classroom.subClass} - ${
              classroom.shift
            } - ${schoolInstitutional.name}`,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Linking professor has been updtaded',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
);

router.get('/', checkTokenMiddleware, async (req, res) => {
  try {
    const classrooms = await models.Classroom.find(req.query).populate({
      path: 'professors',
      model: 'Profile',
      select: 'user',
      populate: {
        path: 'user',
        model: 'User',
        select: 'people',
        populate: { path: 'people', model: 'People', select: 'name' },
      },
    });
    if (classrooms) {
      res.status(200).json({
        success: true,
        message: 'Classrooms has been found',
        data: classrooms,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classrooms not found',
        data: classrooms,
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

router.delete('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    await models.Enrollment.remove({
      classrooms: {
        $in: [mongoose.Types.ObjectId(req.params._id)],
      },
    });
    await models.Classroom.remove({
      _id: req.params._id,
    });
    await models.SchoolYearClassroom.update(
      {
        classrooms: {
          $in: mongoose.Types.ObjectId(req.params._id),
        },
      },
      {
        $pull: {
          classrooms: req.params._id,
        },
      },
    );
    res.status(200).json({
      success: true,
      message: 'Classrooms and enrollments were erased',
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const classroom = await models.Classroom.findById(req.params._id);

    if (classroom) {
      res.status(200).json({
        success: true,
        message: 'Classroom has been found',
        data: classroom,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get('/:_id/frequency', checkTokenMiddleware, async (req, res) => {
  try {
    const classroom = await models.Classroom.findById(req.params._id).populate({
      path: 'frequencies',
      model: 'Frequency',
      populate: {
        path: 'owner',
        model: 'Profile',
        select: 'user',
        populate: {
          path: 'user',
          model: 'User',
          select: 'people',
          populate: {
            path: 'people',
            model: 'People',
            select: 'name',
          },
        },
      },
    });
    if (classroom) {
      res.status(200).json({
        success: true,
        message: 'Classroom frequencies has been found',
        data: classroom.frequencies,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
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

router.get('/:_id/frequency/:limit/:page', checkTokenMiddleware, async (req, res) => {
  try {
    const { _id, limit, page } = req.params;
    const classroom = await models.Classroom.findById({ _id });

    if (classroom) {
      const frequencies = await models.Frequency
        .find({ _id: classroom.frequencies })
        .sort({ date: 'desc' });

      const frequencies_length = frequencies.length;

      const start = limit * page;
      const end = limit * (Number(page) + 1);

      classroom.frequencies = frequencies.slice(start, end);

      const frequencies_to_query = classroom.frequencies.map((freq) => freq._id);

      classroom.frequencies = await models.Frequency
        .find({ _id: frequencies_to_query })
        .sort({ date: 'desc' })
        .populate({
          path: 'owner',
          model: 'Profile',
          select: 'user',
          populate: {
            path: 'user',
            model: 'User',
            select: 'people',
            populate: {
              path: 'people',
              model: 'People',
              select: 'name',
            },
          },
        });

      res.status(200).json({
        success: true,
        message: 'Classroom frequencies has been found',
        data: classroom.frequencies,
        length: frequencies_length,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
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

router.get('/:_id/frequency/search', checkTokenMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      limit, page, order, orderBy,
    } = req.query;

    const query = {};
    if (orderBy.match('date|content')) {
      query[orderBy] = (order === 'asc') ? 'asc' : 'desc';
    } else {
      query.date = 'desc';
    }

    const classroom = await models.Classroom.findById({ _id });

    if (classroom) {
      const frequencies = await models.Frequency
        .find({ _id: classroom.frequencies })
        .sort(query);

      const frequencies_length = frequencies.length;

      const start = limit * page;
      const end = limit * (Number(page) + 1);

      if (orderBy !== 'owner') { classroom.frequencies = frequencies.slice(start, end); }

      const frequencies_to_query = classroom.frequencies.map((freq) => freq._id);

      classroom.frequencies = await models.Frequency
        .find({ _id: frequencies_to_query })
        .sort(query)
        .populate({
          path: 'owner',
          model: 'Profile',
          select: 'user',
          populate: {
            path: 'user',
            model: 'User',
            select: 'people',
            populate: {
              path: 'people',
              model: 'People',
              select: 'name',
            },
          },
        });

      if (orderBy === 'owner') {
        const comp = (a, b) => ((a < b) ? 1 : -1);
        classroom.frequencies.sort((a, b) => {
          const nameA = a.owner.user.people.name;
          const nameB = b.owner.user.people.name;
          return (order === 'asc')
            ? comp(nameB, nameA)
            : comp(nameA, nameB);
        });

        classroom.frequencies = classroom.frequencies.slice(start, end);
      }

      res.status(200).json({
        success: true,
        message: 'Classroom frequencies has been found',
        data: classroom.frequencies,
        length: frequencies_length,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
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

router.get('/:_id/frequency-period', checkTokenMiddleware, async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      limit, page, order, orderBy, begin, end,
    } = req.query;

    const [dateBegin, dateEnd] = [new Date(begin), new Date(end)];

    const query = {};
    if (orderBy.match('date|content')) {
      query[orderBy] = (order === 'asc') ? 'asc' : 'desc';
    } else {
      query.date = 'desc';
    }

    const classroom = await models.Classroom.findById({ _id });

    if (classroom) {
      // Este 'find' remove as frequencias inválidas e fora do período
      // especificado
      const frequencies = await models.Frequency
        .find({
          _id: classroom.frequencies,
          $and: [
            { date: { $gte: dateBegin } },
            { date: { $lte: dateEnd } },
          ],
        })
        .sort(query);

      const frequencies_length = frequencies.length;

      const start = limit * page;
      const end = limit * (Number(page) + 1);

      if (orderBy !== 'owner') { classroom.frequencies = frequencies.slice(start, end); }

      const frequencies_to_query = classroom.frequencies
        .map((freq) => freq._id);

      classroom.frequencies = await models.Frequency
        .find({ _id: frequencies_to_query })
        .sort(query)
        .populate({
          path: 'owner',
          model: 'Profile',
          select: 'user',
          populate: {
            path: 'user',
            model: 'User',
            select: 'people shortName',
            populate: {
              path: 'people',
              model: 'People',
              select: 'name',
            },
          },
        });

      if (orderBy === 'owner') {
        const comp = (a, b) => ((a < b) ? 1 : -1);
        classroom.frequencies.sort((a, b) => {
          const nameA = a.owner.user.people.name;
          const nameB = b.owner.user.people.name;
          return (order === 'asc')
            ? comp(nameB, nameA)
            : comp(nameA, nameB);
        });

        classroom.frequencies = classroom.frequencies.slice(start, end);
      }

      res.status(200).json({
        success: true,
        message: 'Classroom frequencies has been found',
        length: frequencies_length,
        data: classroom.frequencies,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
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

async function hasFrequencyInDate(owner, date, classroom) {
  const dateBegin = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);
  const dateEnd = new Date(`${date.slice(0, 10)}T23:59:59.000Z`);

  const frequencies = Array.from(await models.Frequency.find({
    owner,
    $and: [
      { date: { $gte: dateBegin } },
      { date: { $lte: dateEnd } },
    ],
  })).filter((freq) => classroom.frequencies.includes(freq._id));

  return frequencies.length > 0;
}

function processReqFrequency(req) {
  const cloneBody = JSON.parse(JSON.stringify(req.body));
  delete cloneBody.date;
  delete cloneBody.content;
  delete cloneBody.obs;
  delete cloneBody.meta;
  delete cloneBody.owner;
  delete cloneBody.presents;
  delete cloneBody.revisors;

  const {
    owner, date, meta, content, presents, obs,
  } = req.body;
  if (!owner || !date || !content) { throw 'Invalid arguments'; }

  Object.keys(cloneBody).forEach((key) => {
    if (key.match(/_obs|_jus/) && !cloneBody[key]) {
      delete cloneBody[key];
    }
  });

  const frequency = {
    owner,
    date,
    meta,
    obs,
    content,
    students: cloneBody,
  };

  if (!presents) {
    delete frequency.students;
  }

  return frequency;
}


router.post('/:_id/frequency', checkTokenMiddleware, async (req, res) => {
  try {
    const classroom = await models.Classroom.findById(req.params._id);

    if (classroom) {
      const cloneBody = JSON.parse(JSON.stringify(req.body));
      delete cloneBody.date;
      delete cloneBody.content;
      delete cloneBody.meta;
      delete cloneBody.owner;
      delete cloneBody.presents;
      const frequency = {
        owner: req.body.owner,
        date: req.body.date,
        meta: req.body.meta,
        content: req.body.content,
        students: cloneBody,
      };

      if (!req.body.presents) {
        delete frequency.students;
      }

      const hasFrequency = await hasFrequencyInDate(
        req.body.owner, req.body.date, classroom,
      );

      if (hasFrequency) {
        return res.status(200).json({
          success: false,
          message: 'Classroom frequency already exists.',
        });
      }

      const frequencyNew = await models.Frequency.create(frequency);
      await models.Classroom.findByIdAndUpdate(classroom._id, {
        $push: { frequencies: frequencyNew._id },
      });

      return res.status(200).json({
        success: true,
        message: 'Classroom frequency has been saved',
        data: frequencyNew,
      });
    }
    res.status(404).json({
      success: false,
      message: 'Classroom not found',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.post('/:_id/frequency2', checkTokenMiddleware, async (req, res) => {
  try {
    const classroom = await models.Classroom.findById(req.params._id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Classroom not found',
      });
    }

    const frequency = processReqFrequency(req);

    const hasFrequency = await hasFrequencyInDate(
      frequency.owner, frequency.date, classroom,
    );
    if (hasFrequency) {
      return res.status(200).json({
        success: false,
        message: 'Classroom frequency already exists.',
      });
    }

    const frequencyNew = await models.Frequency.create(frequency);

    await models.Classroom.findByIdAndUpdate(classroom._id, {
      $push: { frequencies: frequencyNew._id },
    });

    return res.status(200).json({
      success: true,
      message: 'Classroom frequency has been saved',
      data: frequencyNew,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/:_id/professors', checkTokenMiddleware, async (req, res) => {
  try {
    const classroom = await models.Classroom.findById(req.params._id).populate({
      path: 'professors',
      model: 'ProfileProfessor',
      select: 'user subjects avatar classrooms',
      populate: [
        {
          path: 'user',
          model: 'User',
          select: 'shortName people',
          populate: {
            path: 'people',
            model: 'People',
            select: 'name',
          },
        },
        {
          path: 'classrooms',
          model: 'Classroom',
          select: 'series subClass',
        },
      ],
    });

    if (!classroom) {
      res.status(404).json({
        success: false,
        message: 'Classroom not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Classroom has founded',
      data: classroom.professors,
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
