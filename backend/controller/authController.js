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
class authController {
  async signUp(req, res) {
    try {
      const { role } = req.query;
      const { email, password, name } = req.body;
      const existingUser = await authModel.findOne({ email: email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("User with this email is already registered"));
      }
      AWS.config.update({
        accessKeyId: "AKIARBUZNPTUDGAEUUQX",
        secretAccessKey: "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",
        region: "eu-west-3",
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
          .status(HTTP_STATUS.OK)
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
      const auth = await authModel.findOne({ email: email });
      if (!auth) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("User is not registered"));
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
}
module.exports = new authController();
