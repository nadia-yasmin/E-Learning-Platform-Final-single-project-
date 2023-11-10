const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const adminModel = require("../model/admin");
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
}
module.exports = new userController();
