const {
  AuthenticationError,
  UserInputError
} = require("apollo-server-express");

const Group = require("../../models/Group");
const checkAuth = require("../../utils/check-auth");
const User = require("../../models/User");

module.exports = {
  Query: {
    getGroups: async () => {
      try {
        const groups = await Group.find().sort({createdAt: -1});
        return groups;
      } catch (err) {
        throw new Error(err);
      }
    },
    getGroup: async (_, {groupId}) => {
      try {
        const group = await Group.findById(groupId);
        if (group) {
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else {
          throw new UserInputError("Group not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    getGroupsByBody: async (_, {keyword}) => {
      try {
        const groups = await Group.find({
          body: {$regex: keyword, $options: "i"}
        });
        return groups;
      } catch (err) {
        throw new Error(err);
      }
    },
    getGroupPost: async (_, {groupId, postId}) => {
      try {
        const group = await Group.findById(groupId);
        if (group) {
          const postIndex = group.posts.findIndex(p => p.id === postId);
          post = group.posts[postIndex];
          if (post) {
            return post;
          } else throw new UserInputError("Post not found");
        } else throw new UserInputError("Group not found");
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createGroup: async (_, {body, bio, avatar}, context) => {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Group body must not be empty");
      }

      const newGroup = new Group({
        body: body,
        username: user.username,
        createdAt: new Date().toISOString(),
        bio: bio,
        avatar: avatar,
        user: user.id
      });

      newGroup.likes.push({
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const group = await newGroup.save();

      context.pubsub.publish("NEW_GROUP", {
        newGroup: group
      });

      return group;
    },
    deleteGroup: async (_, {groupId}, context) => {
      const user = checkAuth(context);

      try {
        const group = await Group.findById(groupId);
        if (user.username === group.username) {
          await group.delete();
          return "Group deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    likeGroup: async (_, {groupId}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group) {
        if (group.likes.find(like => like.username === username)) {
          // Group already liked, unlike it
          group.likes = group.likes.filter(like => like.username !== username);
        } else {
          // Not liked, like group
          group.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await group.save();
        group.posts = [
          ...group.posts.filter(post => post.top),
          ...group.posts.filter(post => !post.top)
        ];
        return group;
      } else throw new UserInputError("Group not found");
    },
    importGroupLikes: async (_, {groupId, usernames}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group) {
        if (
          group.admins.find(a => a.username === username) ||
          group.username === username
        ) {
          const names = usernames.split(' ');
          for (const name of names) {
            if (!group.likes.find(like => like.username === name)) {
              // Not liked, like group
              // check if user exists
              const importedUser = await User.findOne({username: name});
              if (importedUser)
                group.likes.push({
                  username: name,
                  createdAt: new Date().toISOString()
                });
            }
          }
          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found");
      }
    },
    createGroupPost: async (_, {groupId, title, body}, context) => {
      const {username} = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty post", {
          errors: {
            body: "Post body must not empty"
          }
        });
      }

      const group = await Group.findById(groupId);

      if (group && group.likes.find(like => like.username === username)) {
        // group already liked
        group.posts.unshift({
          title: title,
          body: body,
          username: username,
          top: false,
          qualified: false,
          createdAt: new Date().toISOString()
        });

        await group.save();
        group.posts = [
          ...group.posts.filter(post => post.top),
          ...group.posts.filter(post => !post.top)
        ];
        return group;
      } else throw new UserInputError("Group not found, or not joined");
    },
    deleteGroupPost: async (_, {groupId, postId, reason}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group) {
        const postIndex = group.posts.findIndex(p => p.id === postId);

        post = group.posts[postIndex];
        if (
          post &&
          (post.username === username ||
            group.admins.find(a => a.username === username) ||
            group.username === username) // creator / admin / group creator
        ) {
          group.posts.splice(postIndex, 1);
          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          // send a notification
          const receiverUser = await User.findOne({username: post.username});

          if (receiverUser)
            receiverUser.notifications.unshift({
              body: reason,
              username,
              createdAt: new Date().toISOString()
            });
          await receiverUser.save();

          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found");
      }
    },
    likeGroupPost: async (_, {groupId, postId}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group && group.likes.find(like => like.username === username)) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          if (post.likes.find(like => like.username === username)) {
            // Post already liked, unlike it
            post.likes = post.likes.filter(like => like.username !== username);
          } else {
            // Not liked, like post
            post.likes.push({
              username,
              createdAt: new Date().toISOString()
            });
          }

          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found, or not liked");
    },
    topGroupPost: async (_, {groupId, postId}, context) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);
      if (group) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (
          post &&
          (group.admins.find(a => a.username === username) ||
            group.username === username) // admin / group creator
        ) {
          post.top = !post.top; // toggle top
          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found");
      }
    },
    qualifiedGroupPost: async (_, {groupId, postId}, context) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);
      if (group) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (
          post &&
          (group.admins.find(a => a.username === username) ||
            group.username === username) // admin / group creator
        ) {
          post.qualified = !post.qualified; // toggle qualified
          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found");
      }
    },
    createGroupPostComment: async (
      _,
      {groupId, postId, title, body},
      context
    ) => {
      const {username} = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not empty"
          }
        });
      }
      const group = await Group.findById(groupId);
      if (group && group.likes.find(like => like.username === username)) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          post.comments.push({
            title: title,
            body: body,
            username: username,
            createdAt: new Date().toISOString()
          });

          await group.save();
          return post;
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found, or not liked");
    },
    deleteGroupPostComment: async (
      _,
      {groupId, postId, commentId},
      context
    ) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);
      if (group) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);
          comment = post.comments[commentIndex];

          if (
            comment &&
            (comment.username === username ||
              group.admins.find(a => a.username === username) ||
              group.username === username)
          ) {
            post.comments.splice(commentIndex, 1);
            await group.save();
            return post;
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found");
    },
    applyGroupAdmin: async (_, {groupId, title, body}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (
        group &&
        !group.admins.find(admin => admin.username === username) &&
        username !== group.username &&
        group.likes.find(like => like.username === username)
      ) {
        if (group.applies.find(apply => apply.username === username)) {
          // Group already applied, remove the apply
          group.applies = group.applies.filter(
            apply => apply.username !== username
          );
        } else {
          // Not applied, apply
          group.applies.push({
            title: title,
            body: body,
            username: username,
            createdAt: new Date().toISOString()
          });
        }

        await group.save();
        return group;
      } else
        throw new UserInputError(
          "Group not found, or the user is already an admin, or the user is the creator of the group"
        );
    },
    grantGroupAdmin: async (_, {groupId, name}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group && group.username === username) {
        // creator of group
        const applyIndex = group.applies.findIndex(a => a.username === name);
        apply = group.applies[applyIndex];

        if (apply && !group.admins.find(admin => admin.username === name)) {
          // not already admin
          group.applies.splice(applyIndex, 1);
          group.admins.push({
            username: name,
            createdAt: new Date().toISOString()
          });
          await group.save();

          return group;
        } else if (group.admins.find(admin => admin.username === name)) {
          const adminIndex = group.admins.findIndex(a => a.username === name);
          admin = group.admins[adminIndex];
          group.admins.splice(adminIndex, 1);
          await group.save();
          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found or user is not the creator");
      }
    },
    applyGroupAdmission: async (_, {groupId, body}, context) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);
      if (
        group && // group exists
        !group.admins.find(admin => admin.username === username) && // not admin
        username !== group.username && // not creator
        !group.likes.find(like => like.username === username) // not member
      ) {
        if (group.admissions.find(admission => admission.username === username)) {
          // Group admission already applied, remove the apply
          group.admissions = group.admissions.filter(
            admission => admission.username !== username
          );
        } else {
          // Not applied, apply
          group.admissions.push({
            body: body,
            username: username,
            createdAt: new Date().toISOString()
          });
        }

        await group.save();
        return group;
      } else
        throw new UserInputError(
          "Group not found, or the user is already an admin, or the user is the creator of the group"
        );
    },
    grantGroupAdmission: async (_, {groupId, name}, context) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);

      if (group && (group.username === username || group.admins.find(admin => admin.username === username))) {
        // creator of the group or admin
        const admissionIndex = group.admissions.findIndex(a => a.username === name);
        admission = group.admissions[admissionIndex];

        if (admission && !group.likes.find(like => like.username === name)) {
          // not already liked
          group.admissions.splice(admissionIndex, 1);
          group.likes.push({
            username: name,
            createdAt: new Date().toISOString()
          });
          await group.save();

          return group;
        } else if (group.likes.find(like => like.username === name)) {
          const likeIndex = group.likes.findIndex(a => a.username === name);
          like = group.likes[likeIndex];
          group.likes.splice(likeIndex, 1);
          await group.save();
          return group;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Group not found or user is not the creator");
      }
    },
    reportGroupPost: async (_, {groupId, postId}, context) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (group && group.likes.find(report => report.username === username)) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          if (post.reports.find(report => report.username === username)) {
            // Post already reported, unreport it
            post.reports = post.reports.filter(
              report => report.username !== username
            );
          } else {
            // Not reported, report post
            post.reports.push({
              username,
              createdAt: new Date().toISOString()
            });
          }

          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found, or not reported");
    },
    removeGroupPostReport: async (
      _,
      {groupId, postId, reportId},
      context
    ) => {
      const {username} = checkAuth(context);

      const group = await Group.findById(groupId);

      if (
        group &&
        (group.admins.find(admin => admin.username === username) ||
          group.username === username)
      ) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          post.reports = post.reports.filter(report => report.id !== reportId);

          await group.save();
          group.posts = [
            ...group.posts.filter(post => post.top),
            ...group.posts.filter(post => !post.top)
          ];
          return group;
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found, or not reported");
    },
    createGroupPostSecondaryComment: async (
      _,
      {groupId, postId, commentId, title, body},
      context
    ) => {
      const {username} = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not empty"
          }
        });
      }
      const group = await Group.findById(groupId);
      if (group && group.likes.find(like => like.username === username)) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);
          comment = post.comments[commentIndex];
          if (comment) {
            comment.comments.push({
              title: title,
              body: body,
              username: username,
              createdAt: new Date().toISOString()
            });
          } else throw new UserInputError("Comment not found");
          await group.save();
          return post;
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found, or not liked");
    },
    deleteGroupPostSecondaryComment: async (
      _,
      {groupId, postId, commentId, secondaryId},
      context
    ) => {
      const {username} = checkAuth(context);
      const group = await Group.findById(groupId);
      if (group) {
        const postIndex = group.posts.findIndex(p => p.id === postId);
        post = group.posts[postIndex];
        if (post) {
          const commentIndex = post.comments.findIndex(c => c.id === commentId);
          comment = post.comments[commentIndex];
          if (comment) {
            const secondaryIndex = comment.comments.findIndex(
              c => c.id === secondaryId
            );
            secondary = comment.comments[secondaryIndex];
            if (
              secondary &&
              (secondary.username === username ||
                group.admins.find(a => a.username === username) ||
                group.username === username)
            ) {
              comment.comments.splice(secondaryIndex, 1);
              await group.save();
              return post;
            } else {
              throw new AuthenticationError("Action not allowed");
            }
          } else throw new UserInputError("Comment not found");
        } else throw new UserInputError("Post not found");
      } else throw new UserInputError("Group not found");
    }
  },
  Subscription: {
    newGroup: {
      subscribe: (_, __, {pubsub}) => pubsub.asyncIterator("NEW_GROUP")
    }
  }
};
