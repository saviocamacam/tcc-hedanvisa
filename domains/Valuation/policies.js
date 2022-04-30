const models = require("../../models");

const { professorOnClassroom } = require("../../utils/permissions/utils");

const policies = [];

policies.push({
  profileType: "ProfileProfessor",
  resourceType: "Professor",
  permissionName: "assigment",
  action: "write",
  checker: async (profile, resource) =>
    professorOnClassroom(profile, resource.classroom)
});

module.exports = policies;
