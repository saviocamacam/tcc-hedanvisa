"use strict";
const Bluebird = require("bluebird");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const MongoClient = mongodb.MongoClient;
const models = require("../models/index");

const url = "mongodb://localhost:27017/atlaensino2";
Bluebird.promisifyAll(MongoClient);

module.exports.up = next => {
  let mClient = null;
  return MongoClient.connect(url)
    .then(client => {
      mClient = client;
      return client.db();
    })
    .then(async db => {
      const Profile = db.collection("profiles");

      return await Profile.find({
        profileType: "ProfileSchoolInstitutional",
        countyInstitutional: mongoose.Types.ObjectId(
          "5ba9517abde4ef0013e30eae"
        ),
        schoolYearClassrooms: { $exists: false }
      }).forEach(async result => {
        console.log(result._id);
        if (!result) return next("All docs have lastName");

        let schoolYearClassroom1 = await db
          .collection("schoolyearclassrooms")
          .insert({
            school: mongoose.Types.ObjectId(result._id),
            year: mongoose.Types.ObjectId("5c29d60a4fb02c0014f9564a")
          });

        console.log(schoolYearClassroom1);

        let schoolYearClassroom2 = await db
          .collection("schoolyearclassrooms")
          .insert({
            school: mongoose.Types.ObjectId(result._id),
            year: mongoose.Types.ObjectId("5c29ef1d2d36cd001404d27f")
          });

        console.log(schoolYearClassroom2);
        return await models.ProfileSchoolInstitutional.findByIdAndUpdate(
          result._id,
          {
            $push: {
              schoolYearClassrooms: {
                $each: [schoolYearClassroom1, schoolYearClassroom2]
              }
            }
          }
        );

        // return db.collection("profiles").save(result);
      });
    })
    .then(async () => {
      await mClient.close();
      return next();
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

module.exports.down = next => {
  return next();
};
