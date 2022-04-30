var mongoose = require("mongoose");
var People = require("../models/people");
var EnrollmentClassroom = require("../models/enrollmentClassroom");
const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

function badRequestError(res, message) {
  console.log(message);
  res.status(400).json({
    status: false,
    message: message
  });
}

router.get("/:_id/profiles", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id)
      .select("profileStudent parents")
      .populate([
        {
          path: "profileStudent",
          model: "Link",
          select: "requesting status",
          populate: [
            {
              path: "requesting",
              model: "ProfileStudent",
              select: "user",
              populate: [
                {
                  path: "user",
                  model: "User",
                  select: "shortName people",
                  populate: [
                    { path: "people", model: "People", select: "name" }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: "parents",
          model: "Link",
          select: "requesting status",
          populate: [
            {
              path: "requesting",
              model: "ProfileParent",
              select: "user",
              populate: [
                {
                  path: "user",
                  model: "User",
                  select: "shortName people",
                  populate: [
                    { path: "people", model: "People", select: "name" }
                  ]
                }
              ]
            }
          ]
        }
      ]);

    let profiles = new Array();
    profiles.push(enrollment.profileStudent);
    profiles.push(...enrollment.parents);
    if (enrollment) {
      res.status(200).json({
        success: true,
        message: "Enrollments has been found",
        data: profiles
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post(
  "/:_id_enrollment/message",
  checkTokenMiddleware,
  async (req, res) => {
    try {
      let enrollment = await models.Enrollment.findById(
        req.params._id_enrollment
      );
      let comment = JSON.parse(JSON.stringify(req.body));
      delete comment.title;
      delete comment.message;
      delete comment.profile;
      let newComment = await models.Comment.create({
        profile: req.body.profile,
        title: req.body.title,
        message: req.body.message,
        only: Object.keys(comment)
      });
      await models.Enrollment.findByIdAndUpdate(req.params._id_enrollment, {
        $push: { comments: newComment._id }
      });
      res.status(201).json({
        success: true,
        message: "Comment enrollment has been saved",
        data: newComment
      });
    } catch (error) {
      badRequestError(res, error.message);
    }
  }
);

router.get("/:_id/messages", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id)
      .select("comments")
      .populate({ path: "comments", model: "Comment" });

    if (enrollment) {
      res.status(200).json({
        success: true,
        message: "Enrollments has been found",
        data: enrollment.comments
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    let classroom = await models.Classroom.findById(req.body.classroom);
    if (classroom) {
      let enrollments = await models.Enrollment.find({
        "basic.cgm": req.body.basic.cgm,
        classrooms: { $in: [mongoose.Types.ObjectId(req.body.classroom)] }
      });
      console.log(enrollments);
      if (enrollments.length == 0) {
        let enrollment = await models.Enrollment.create(req.body);
        await models.Enrollment.findByIdAndUpdate(enrollment._id, {
          $push: { classrooms: classroom._id }
        });
        await models.Classroom.findByIdAndUpdate(classroom._id, {
          $push: { students: enrollment._id }
        });

        res.status(201).json({
          success: true,
          message: "Enrollment has been created",
          data: enrollment._id
        });
      } else if (enrollments.length == 1) {
        let enrollment = enrollments[0];
        await models.Enrollment.update({ _id: enrollment._id }, req.body);
        res.status(200).json({
          success: true,
          message: "Enrollment has been update"
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Classroom not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/:_id/unlinkin-parent", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id);
    let parentProfile = await models.ProfileParent.findById(
      req.body.parent
    ).select("_id profileType childs");
    let existingLink = await models.Link.find({
      requested: enrollment._id,
      requesting: req.body.parent
    });

    if (enrollment && parentProfile) {
      if (existingLink.length > 0) {
        let link = existingLink[0];

        await models.Enrollment.update(
          { _id: enrollment._id },
          {
            $pull: { parents: link._id }
          }
        );

        await models.ProfileParent.update(
          { _id: parentProfile._id },
          { $pull: { childs: link._id } }
        );

        await models.Link.findByIdAndRemove(link._id);

        res.status(200).json({
          success: true,
          message: "Enrollment Parent association has been undone"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Enrollment Parent association not found"
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment or parent not found",
        data: [{ enrollment, parentProfile }]
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post("/:_id/linkin-parent", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id);
    let parentProfile = await models.ProfileParent.findById(
      req.body.parent
    ).select("_id profileType childs");
    let existingLink = await models.Link.find({
      requested: enrollment._id,
      requesting: req.body.parent
    });
    console.log(existingLink);
    if (enrollment && parentProfile) {
      if (existingLink.length == 0) {
        let link = await models.Link.create({
          requested: enrollment._id,
          requesting: parentProfile._id,
          status: "accepted"
        });
        await models.Enrollment.findByIdAndUpdate(enrollment._id, {
          $push: { parents: link._id }
        });
        await models.ProfileParent.findByIdAndUpdate(parentProfile._id, {
          $push: { childs: link._id }
        });
        res.status(201).json({
          success: true,
          message: "Parent Enrollment association has been created",
          data: link
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Parent Enrollment association has been exists"
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment or student not found",
        data: [{ enrollment, parentProfile }]
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post(
  "/:_id/unlinkin-student",
  checkTokenMiddleware,
  async (req, res) => {
    try {
      let enrollment = await models.Enrollment.findById(req.params._id);
      let studentProfile = await models.ProfileStudent.findById(
        req.body.student
      ).select("_id profileType enrollments");
      let existingLink = await models.Link.findById(enrollment.profileStudent);

      if (enrollment && studentProfile) {
        if (enrollment.profileStudent && existingLink) {
          await models.Enrollment.update(
            { _id: enrollment._id },
            { $set: { profileStudent: null } }
          );
          await models.ProfileStudent.update(
            { _id: studentProfile._id },
            { $pull: { enrollments: existingLink._id } }
          );
          await models.Link.findByIdAndRemove(existingLink._id);
          res.status(200).json({
            success: true,
            message: "Enrollment Parent association has been undone"
          });
        } else {
          res.status(404).json({
            success: false,
            message: "Enrollment Student association not found"
          });
        }
      } else {
        res.status(404).json({
          success: true,
          message: "Student Enrollment association has been exists"
        });
      }
    } catch (error) {
      badRequestError(res, error.message);
    }
  }
);

router.post("/:_id/linkin-student", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id);
    let studentProfile = await models.ProfileStudent.findById(
      req.body.student
    ).select("_id profileType enrollments");
    let existingLink = await models.Link.find({
      requested: enrollment._id,
      requesting: req.body.student
    });
    console.log(existingLink);
    if (enrollment && studentProfile) {
      if (!enrollment.student && existingLink.length == 0) {
        let link = await models.Link.create({
          requested: enrollment._id,
          requesting: studentProfile._id,
          status: "accepted"
        });
        await models.Enrollment.findByIdAndUpdate(enrollment._id, {
          $set: { profileStudent: link._id }
        });
        await models.ProfileStudent.findByIdAndUpdate(studentProfile._id, {
          $push: { enrollments: link._id }
        });
        res.status(201).json({
          success: true,
          message: "Student Enrollment association has been created",
          data: link
        });
      } else {
        res.status(404).json({
          success: true,
          message: "Student Enrollment association has been exists"
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment or student not found",
        data: [{ enrollment, studentProfile }]
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get("/filter-classroom", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollments = await models.Enrollment.find({
      classrooms: { $in: [mongoose.Types.ObjectId(req.query.classroom)] }
    }).populate([
      {
        path: "profileStudent",
        model: "Link",
        select: "-requested"
      },
      {
        path: "parents",
        model: "Link",
        select: "-requested"
      }
    ]);
    if (enrollments) {
      res.status(200).json({
        success: true,
        message: "Enrollments has been found",
        data: enrollments
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollments not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    let enrollment = await models.Enrollment.findById(req.params._id);
    if (enrollment) {
      res.status(200).json({
        success: true,
        message: "Enrollment has been found",
        data: enrollment
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post("/externalfeed", (req, res, next) => {
  var matricula = req.body.enrollment;
  console.log(matricula);

  // criação do aluno
  var student = new People({
    name: matricula["Nome do Aluno"],
    born: matricula["Data de Nascimento"],
    gender: matricula["Sexo"]
  });

  student.save(function (err, studentSaved) {
    if (err) throw err;
    if (studentSaved) {
      console.log(studentSaved);
    }
  });

  filiacao = matricula["filiacao"];
  console.log(filiacao);

  var father = new People({
    name: filiacao["Nome do Pai"],
    rg: filiacao["RG/RNE do Pai"]
  });

  father.save(function (err, fatherSaved) {
    if (err) throw err;
    if (fatherSaved) {
      console.log(fatherSaved);
    }
  });

  var mother = new People({
    name: filiacao["Nome da Mãe"],
    rg: filiacao["RG/RNE da Mãe"]
  });

  mother.save(function (err, motherSaved) {
    if (err) throw err;
    if (motherSaved) {
      console.log(motherSaved);
    }
  });

  enrollment = new models.Enrollment({
    external_id: matricula["CGM"],
    student: student,
    father: father,
    mother: mother
  });

  if (
    filiacao["Parentesco do Responsável"] != "Mãe" &&
    filiacao["Parentesco do Responsável"] != "Pai"
  ) {
    var guardianship = new People({
      name: filiacao["Nome do Responsável"],
      cpf: filiacao["CPF do Responsável"]
    });
    enrollment.guardianship = guardianship;
  } else if (filiacao["Parentesco do Responsável"] == "Mãe") {
    enrollment.guardianship = mother;
  } else if (filiacao["Parentesco do Responsável"] == "Pai") {
    enrollment.guardianship = father;
  }
  enrollment.guardianship_kinship = filiacao["Parentesco do Responsável"];
  enrollment.save(function (err, enrollmentSaved) {
    if (err) throw err;
    if (enrollmentSaved) {
      console.log("success on enrollment creation");
    }
  });

  var enrollment_classroom = new EnrollmentClassroom({
    enrollment: enrollment,
    classroom: req.body.classroom,
    createdAt: matricula["Data Matric/Mov"]
  });

  enrollment_classroom.save((err, enrollmentClassroomSaved) => {
    if (err) throw err;
    if (enrollmentClassroomSaved)
      console.log("success on enrollmentClassromm creation");
  });

  res.send({
    status: 201,
    message: "success"
  });
});

router.put("/:_id/state", checkTokenMiddleware, async (req, res) => {
  try {
    const { state } = req.body;

    let enrollment = await models.Enrollment.findById(req.params._id);
    if (enrollment) {
      let { basic } = enrollment;
      basic["sit_da_matricula"] = state;
      console.log(basic);
      enrollment = await models.Enrollment.findByIdAndUpdate(req.params._id,
        {
          basic
        });

      res.status(200).json({
        success: true,
        message: "Enrollment has been found",
        data: enrollment
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

module.exports = router;
