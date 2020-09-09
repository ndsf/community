const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {UserInputError} = require("apollo-server-express");
const checkAuth = require("../../utils/check-auth");
("use strict");
const nodemailer = require("nodemailer");

const {
  validateRegisterInput,
  validateLoginInput
} = require("../../utils/validators");

const User = require("../../models/User");

const generateToken = user => {
  // modify this after adding keys to the user model
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      notifications: user.notifications
    },
    process.env.SECRET_KEY,
    {expiresIn: "24h"}
  );
};

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  Query: {
    getUser: async (_, {username}) => {
      return await User.findOne({username});
      // TODO remove password from user
    }
  },
  Mutation: {
    async login(_, {username, password}) {
      const {errors, valid} = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Something went wrong", {errors});
      }

      const user = await User.findOne({username});

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {errors});
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", {errors});
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: {username, email, password, confirmPassword}
      },
      context,
      info
    ) {
      const {valid, errors} = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Something went wrong", {errors});
      }
      // TODO Make sure user doesn't already exist
      const user = await User.findOne({
        username
      });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken"
          }
        });
      }

      // TODO hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        isTeacher: false,
        notifications: []
      });

      const result = await newUser.save();

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token
      };
    },
    changePassword: async (_, {password}, context) => {
      const {username} = checkAuth(context);
      const user = await User.findOne({username});
      const {errors, valid} = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Something went wrong", {errors});
      }
      user.password = await bcrypt.hash(password, 12);
      await user.save();
      return user;
    },
    resetPassword: async (_, {username, email}, context) => {
      const user = await User.findOne({username, email});
      if (user) {
        let password = makeid(10);
        user.password = await bcrypt.hash(password, 12);

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        /*         let transporter = nodemailer.createTransport({
          host: "smtp.163.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "ndsffx17@163.com", // generated ethereal user
            pass: "Market2019" // generated ethereal password
          }
        }); */

        let transporter = nodemailer.createTransport({
          service: "qq",
          host: "smtp.qq.com",
          port: 587,
          secure: false, // secure:true for port 465, secure:false for port 587
          auth: {
            user: "619455181@qq.com",
            pass: "zhzkszbihraubeac" //  授权码，不是qq密码或者独立密码
          }
        });
        let mailOptions = {
          from: "619455181@qq.com", // sender address
          to: email, // list of receivers
          subject: "您的密码已被重置", // Subject line
          text: `您的新密码为 ${password} ——${new Date()}`, // plain text body
          html: `您的新密码为 ${password} ——${new Date()}` // html body
        };

        // send mail with defined transport object
        /* let mailOptions = {
          from: "ndsffx17@163.com", // sender address
          to: email, // list of receivers
          subject: "您的密码已被重置", // Subject line
          text: `您的新密码为 ${password} ——${new Date()}`, // plain text body
          html: `您的新密码为 ${password} ——${new Date()}` // html body
        }; */
        //let info = await transporter.sendMail(mailOptions);
        //console.log(info);
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
        });

        await user.save();
        return user;
      } else throw new UserInputError("User not found", {errors});
    },
    sendNotification: async (_, {username: receiver, body}, context) => {
      const {username} = checkAuth(context);
      const receiverUser = await User.findOne({receiver});

      if (receiverUser) {
        receiverUser.notifications.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });

        await receiverUser.save();
        return '发送成功';
      } else throw new UserInputError("User not found", {errors});
    }
  }
};
