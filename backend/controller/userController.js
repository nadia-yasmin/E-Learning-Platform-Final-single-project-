const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const adminModel = require("../model/admin");
const authModel = require("../model/auth");
const transactionModel = require("../model/transaction");
const categoryModel = require("../model/category");
const typeModel = require("../model/types");
const rateModel = require("../model/rate");
const wishlistModel = require("../model/wishlist");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jsonwebtoken = require("jsonwebtoken");
const moment = require("moment");
const HTTP_STATUS = require("../constants/statusCodes");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = require("../config/file");
class userController {
  async showalladmins(req, res) {
    try {
      const { adminId } = req.query;

      if (adminId) {
        const admin = await adminModel.findById(adminId);

        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }

        return res.status(200).json({ admin });
      }

      const admins = await adminModel.find();
      return res.status(200).json({ admins });
    } catch (error) {
      console.error("Show all admins error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async showallinstructors(req, res) {
    try {
      const { instructorId } = req.query;

      if (instructorId) {
        const instructor = await instructorModel.findById(instructorId);

        if (!instructor) {
          return res.status(404).json({ error: "Instructor not found" });
        }

        return res.status(200).json({ instructor });
      }

      const instructors = await instructorModel.find();
      return res.status(200).json({ instructors });
    } catch (error) {
      console.error("Show all instructors error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async showalllearners(req, res) {
    try {
      const { learnerId } = req.query;

      if (learnerId) {
        const learner = await learnerModel.findById(learnerId);

        if (!learner) {
          return res.status(404).json({ error: "Learner not found" });
        }

        return res.status(200).json({ learner });
      }

      const learners = await learnerModel.find();
      return res.status(200).json({ learners });
    } catch (error) {
      console.error("Show all learners error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateuser(req, res) {
    try {
      const validation = validationResult(req).array();
      console.log("validation", validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Failed to validate the data", validation));
      }
      const { email } = req.query;
      const { newemail, password, name } = req.body;
      const existingUser = await authModel.findOne({ email: email });
      if (!existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("User with this email does not exist"));
      }
      AWS.config.update({
        accessKeyId: "AKIARBUZNPTUDGAEUUQX",
        secretAccessKey: "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",
        region: "eu-west-3",
      });
      const s3 = new AWS.S3();
      let updatedFields = {};
      if (req.file) {
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
        updatedFields.image = image1;
      }
      if (name) {
        updatedFields.name = name;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }
      if (newemail) {
        updatedFields.email = newemail;
      }
      let result = null;
      if (existingUser.role === "admin") {
        result = await adminModel.findOneAndUpdate(
          { email: email },
          { $set: updatedFields },
          { new: true }
        );
      } else if (existingUser.role === "instructor") {
        result = await instructorModel.findOneAndUpdate(
          { email: email },
          { $set: updatedFields },
          { new: true }
        );
      } else if (existingUser.role === "learner") {
        result = await learnerModel.findOneAndUpdate(
          { email: email },
          { $set: updatedFields },
          { new: true }
        );
      }
      if (result) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("User information has been updated", result));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(success("User information update failed"));
      }
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Internal server error"));
    }
  }
  async deleteuser(req, res) {
    try {
      const { userId } = req.query;
      const learnerUser = await learnerModel.findById(userId);
      if (learnerUser) {
        await authModel.findOneAndDelete({ email: learnerUser.email });
        await learnerModel.findByIdAndDelete(userId);
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Learner deleted successfully"));
      }
      const instructorUser = await instructorModel.findById(userId);
      if (instructorUser) {
        await authModel.findOneAndDelete({ email: instructorUser.email });
        await instructorModel.findByIdAndDelete(userId);
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Instructor deleted successfully"));
      }
      const adminUser = await adminModel.findById(userId);
      if (adminUser) {
        await authModel.findOneAndDelete({ email: adminUser.email });
        await adminModel.findByIdAndDelete(userId);
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Admin deleted successfully"));
      }
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("User with this ID does not exist"));
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(success("Internal server error"));
    }
  }

  async viewOwnProfile(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
  
      let userModel;
      switch (decodedToken.role) {
        case 'learner':
          userModel = learnerModel;
          break;
        case 'instructor':
          userModel = instructorModel;
          break;
        case 'admin':
          userModel = adminModel;
          break;
        default:
          return res.status(400).json({ error: 'Invalid role' });
      }
  
      const user = await userModel.findOne({ email: decodedToken.email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      console.error('View own profile error', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
}
module.exports = new userController();
