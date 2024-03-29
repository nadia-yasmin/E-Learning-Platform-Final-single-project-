const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const authModel = require("../model/auth");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jsonwebtoken = require("jsonwebtoken");
const moment = require("moment");
const HTTP_STATUS = require("../constants/statusCodes");
const { default: mongoose } = require("mongoose");
const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const crypto = require("crypto");
const AWS = require("aws-sdk");
require("dotenv").config();
const transporter= require("../config/mail")

class authController {
  async signUp(req, res) {
    try {
      const accessKeyId = process.env.accessKeyId;
      const secretAccessKey = process.env.secretAccessKey;
      const region = process.env.region;
      if (!req.file) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("file not found"));
      }
      console.log("req.file", req.file);

      const validation = validationResult(req).array();
      console.log("validation", validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Failed to validate the data", validation));
      }
      const { role } = req.query;
      const { email, password, name } = req.body;

      console.log("role, email, password, name ", role, email, password, name);
      const existingUser = await authModel.findOne({ email: email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("User with this email is already registered"));
      }
      AWS.config.update({
        accessKeyId,
        secretAccessKey,
        region,
      });
      const s3 = new AWS.S3();
      const params = {
        Bucket: "nadia-bucket",
        Key: req.file.originalname,
        Body: req.file.buffer,
      };
      const uploadImage = async () => {
        return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
            }
          });
        });
      };

      const image1 = await uploadImage();
      console.log("image url", image1);

      const hashedPassword = await bcrypt.hash(password, 10);

      let result = null;

      if (role === "admin") {
        result = await adminModel.create({
          email: email,
          name: name,
          image: image1,
          role: role,
        });
      } else if (role === "instructor") {
        result = await instructorModel.create({
          email: email,
          name: name,
          image: image1,
          role: role,
        });
      } else if (role === "learner") {
        result = await learnerModel.create({
          email: email,
          name: name,
          image: image1,
          role: role,
        });
      }

      if (result) {
        let adminId = null;
        let learnerId = null;
        let instructorId = null;

        if (role === "admin") {
          adminId = result._id;
        } else if (role === "learner") {
          learnerId = result._id;
        } else if (role === "instructor") {
          instructorId = result._id;
        }

        const result2 = await authModel.create({
          email: email,
          password: hashedPassword,
          adminId: adminId,
          learnerId: learnerId,
          instructorId: instructorId,
          role: role,
        });

        if (!result2) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .send(success("Failed to store user information", result2));
        }

        return res
          .status(HTTP_STATUS.OK)
          .send(success("Authentication succeeded", result));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("Authentication has not been succeeded"));
      }
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Internal server error"));
    }
  }

  async login(req, res) {
    try {
      const { email, password, role } = req.body;
      if (!password) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("Password is required"));
      }
      const auth = await authModel.findOne({ email: email });
      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User is not registered"));
      }
      if (auth.blocked) {
        const now = moment();
        const lastUnsuccessfulLoginTime = moment(
          auth.loginAttempts[auth.loginAttempts.length - 1].timestamp
        );
        if (now.diff(lastUnsuccessfulLoginTime, "minutes") >= 5) {
          auth.blocked = false;
          auth.loginAttempts = [];
          await auth.save();
        } else {
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .send(success("User is blocked. Please try again after 1 minute"));
        }
      }
      const checkedPassword = await bcrypt.compare(password, auth.password);
      if (checkedPassword) {
        let additionalInfo;

        switch (auth.role) {
          case "learner":
            additionalInfo = await learnerModel.findOne({
              _id: auth.learnerId,
            });
            break;
          case "admin":
            additionalInfo = await adminModel.findOne({
              _id: auth.adminId,
            });
            break;
          case "instructor":
            additionalInfo = await instructorModel.findOne({
              _id: auth.instructorId,
            });
            break;
          default:
            break;
        }
        if (additionalInfo) {
          additionalInfo = additionalInfo.toObject();
        }
        const jwt = jsonwebtoken.sign(additionalInfo, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        additionalInfo.token = jwt;
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully logged in", additionalInfo));
      } else {
        const now = moment();
        const lastHour = moment().subtract(1, "hours");
        const recentLoginAttempts = auth.loginAttempts.filter((attempt) =>
          moment(attempt.timestamp).isAfter(lastHour)
        );

        if (recentLoginAttempts.length >= 5) {
          auth.blocked = true;
          await auth.save();
          return res
            .status(HTTP_STATUS.FORBIDDEN)
            .send(
              success(
                "User is blocked due to too many unsuccessful login attempts."
              )
            );
        }

        auth.loginAttempts = recentLoginAttempts;
        auth.loginAttempts.push({ timestamp: now });
        await auth.save();
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(success("Incorrect credentials"));
      }
    } catch (error) {
      console.log("Login error", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Could not login"));
    }
  }

 async sendForgotPasswordEmail(req, res) {
  try {
      const { recipient } = req.body
      console.log("recipient mail", recipient)
      if (!recipient || recipient === "") {
          return res.status(400).send(failure("invalid request"))
      }

      const auth = await authModel.findOne({ email: recipient })
      if (!auth) {
          return res.status(400).send(failure("invalid request"))
      }

      const resetToken = crypto.randomBytes(32).toString('hex')
      auth.resetPasswordToken = resetToken
      auth.resetPasswordExpire = new Date(Date.now() + 60*60*1000)
      auth.resetPassword=true

      await auth.save()
      let userModel, userType;

      if (auth.instructorId) {
        userModel = instructorModel;
        userType = 'Instructor';
      } else if (auth.learnerId) {
        userModel = learnerModel;
        userType = 'Learner';
      } else {
        userModel = adminModel;
        userType = 'Admin';
      }
  
      const user = await userModel.findOne({ email: recipient });
  
      if (!user) {
        return res.status(404).send(failure(`${userType} not found for the given email`));
      }
      const resetPasswordURL = path.join(process.env.BACKEND_AUTH_URL, "reset-password", resetToken,auth._id.toString());
      console.log("Constructed path:", path.join(__dirname, "..","views","forgetPassword.ejs"));
      const htmlBody = await ejsRenderFile(path.join(__dirname, "..","views","forgetPassword.ejs"), {
        name: auth.email,
        resetPasswordURL: resetPasswordURL
    });
    
      // console.log("htmlBody", htmlBody)
      console.log("transporter",transporter)

      const emailResult = await transporter.sendMail({
        from: "my-app@system.com",
        to:`${user.name} ${recipient}`,
      subject:"Froget Password?",
      html:htmlBody
      })
       

      if (emailResult) {
          return res.status(200).send(success("Reset password link sent to your email"))
      }
      return res.status(400).send(failure("Something went wrong"))


  } catch (error) {
      console.log("error found", error)
      return res.status(500).send(failure("Internal server error", error))
  }
}

async resetPassword(req, res) {
  try {
      const { token, userId } = req.query;
      console.log("token, userId",token, userId)

      const auth = await authModel.findOne({ _id: userId, resetPasswordToken: token, resetPasswordExpired: { $gt: new Date() } });
      if (!auth) {
          return res.status(400).send(failure("invalid request"));
      }
      console.log("authPass", auth.password)


      const { newPassword, confirmPassword } = req.body
      console.log("authPass", newPassword)
      if (!newPassword || !confirmPassword) {
          return res.status(400).send(failure("Please enter all the fields"))
      }

      const passwordMatch = await bcrypt.compare(newPassword, auth.password);

      if (passwordMatch) {
          console.log("newpass=oldpass");
          return res.status(400).send(failure("You are setting up an old password"));
      }

      if (newPassword !== confirmPassword) {
          return res.status(400).send(failure("Passwords do not match"))
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
          return hash
      })

      auth.password = hashedPassword
      auth.resetPasswordToken = null
      auth.resetPasswordExpire = null

      await auth.save()

      return res.status(200).send(success("Password reset successful"))
  } catch (error) {
      return res.status(500).send(failure("Internal server error", error))
  }
}

async validatePasswordResetRequest(req, res) {
  try {
      const { token, userId } = req.params;

      const auth = await authModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      if (!auth) {
          return res.status(400).send(failure("Invalid request"))
      }

      if (auth.resetPasswordExpire < Date.now()) {
          return res.status(400).send(failure("Expired request"))
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
          return res.status(400).send(failure("Invalid token"))
      }
      return res.status(200).send(success("Request is still valid"))
  } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error"))
  }
}
}
module.exports = new authController();
