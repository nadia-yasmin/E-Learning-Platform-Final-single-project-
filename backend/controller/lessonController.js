const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const lessonModel = require("../model/lesson");
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
const courseModel = require("../model/course.js");
class lessonController {
  async addLesson(req, res) {
    try {
      const {courseId}= req.query;
      const { title, description } = req.body;
      let video1 = req.files["video"][0];
      let slides1 = req.files["slides"][0];
      AWS.config.update({
        accessKeyId: "AKIARBUZNPTUDGAEUUQX",
        secretAccessKey: "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",
        region: "eu-west-3",
      });
      const s3 = new AWS.S3();
      const params = {
        Bucket: "nadia-bucket",
        Key: video1.originalname,
        Body: video1.buffer,
      };
      console.log("Params", params);
      const uploadvideo = async () => {
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
      const videoUrl = await uploadvideo();
      const paramsTwo = {
        Bucket: "nadia-bucket",
        Key: slides1.originalname,
        Body: slides1.buffer,
      };
      console.log("Params", params);
      const uploadslides = async () => {
        return new Promise((resolve, reject) => {
          s3.upload(paramsTwo, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
            }
          });
        });
      };

      const slidesUrl = await uploadslides();
      console.log("slide url", slidesUrl);
      const existingLesson = await lessonModel.findOne({ title: title });
      const course = await courseModel.findById(courseId);
      const lessonNumber = course.lesson.length === 0 ? 1 : course.lesson.length;
      if (existingLesson) {
        return res.status(400).send(failure("A lesson with this title already exists"));
      }
      const result = await lessonModel.create({
        title: title,
        courseId: courseId,
        description: description,
        video: videoUrl,
        slides: slidesUrl,
        number: lessonNumber

      });
      if (result) {
        return res.status(200).send(success("New lesson added", result));
      } else {
        return res.status(400).send(failure("Could not add a new lesson"));
      }
    } catch (error) {
      console.log("Lesson add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}
module.exports = new lessonController();
