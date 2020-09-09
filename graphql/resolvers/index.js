const groupsResolvers = require("./groups");
const usersResolvers = require("./users");

module.exports = {
  Group: {
    likeCount: parent => parent.likes.length,
    postCount: parent => parent.posts.length,
    applyCount: parent => parent.applies.length,
    admissionCount: parent => parent.admissions.length
  },
  Query: {
    ...groupsResolvers.Query,
    ...usersResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...groupsResolvers.Mutation,
  }
};
