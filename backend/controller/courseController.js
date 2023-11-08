const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
const learnerModel = require("../model/learner");
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
class courseController {
  async addCourse(req, res) {
    try {
      const { title, instructor, category, description,paid } = req.body;
      let image = req.files["image"][0]; 
      let intro = req.files["intro"][0];
      AWS.config.update({
        accessKeyId: "AKIARBUZNPTUDGAEUUQX",
        secretAccessKey: "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",
        region: "eu-west-3",
      });

      console.log("req.image", image);
      console.log("req.intro", intro);
      const s3 = new AWS.S3();
      const params = {
        Bucket: "nadia-bucket",
        Key: image.originalname,
        Body: image.buffer,
      };
      const paramstwo = {
        Bucket: "nadia-bucket",
        Key: intro.originalname,
        Body: intro.buffer,
      };
      console.log("Params", params);
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

      const uploadIntro = async () => {
        return new Promise((resolve, reject) => {
          s3.upload(paramstwo, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
            }
          });
        });
      };

      const intro1 = await uploadIntro();
      console.log("intro url", intro1);
      const existingCourse = await courseModel.findOne({ title: title });
      if (existingCourse) {
        return res.status(400).send(failure("This course already exists"));
      }
      const result = await courseModel.create({
        title: title,
        instructor: instructor,
        category: category,
        description: description,
        image: image1,
        intro: intro1,
        paid:paid
      });
      if (result) {
        return res.status(200).send(success("New course added", result));
      } else {
        return res.status(400).send(failure("Could not add a new course"));
      }
    } catch (error) {
      console.log("Course add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
  async enrollCourse(req, res) {
    try {
      const {courseId}=req.query;
      const { learnerId } = req.body;
      console.log("courseId, learnerId",courseId, learnerId)
      const cart = await cartModel.findOne({ learnerId });
    if (cart && cart.courseId.includes(courseId)) {
      return res.status(400).send(failure("Course is already in the cart"));
    }

  
    const learner = await learnerModel.findOne({ _id: learnerId, 'course.courseId': courseId });
    if (learner && learner.course.some(course => course.courseId.equals(courseId) && course.enrollment)) {
      return res.status(400).send(failure("You have already checked out this course"));
    }
      const result = await cartModel.create({
        courseId: courseId,
        learnerId: learnerId,
      });
      if (result) {
        return res.status(200).send(success("Course added to cart", result));
      } else {
        return res.status(400).send(failure("Could not add course to cart"));
      }
    } catch (error) {
      console.log("Add to cart error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}
module.exports = new courseController();
