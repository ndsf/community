const groupsResolvers = require("./groups");
const usersResolvers = require("./users");

module.exports = {
  Post: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length
  },
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
