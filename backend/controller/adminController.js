const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const courseModel = require("../model/course");
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
class adminController {
  async showpendingcourse(req, res) {
    try {
      const { learnerId } = req.query;
      const learner = await learnerModel.findById(learnerId).populate({
        path: "course.courseId",
        model: "courses",
      });
      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }
      console.log("learner", learner);
      const pendingCourses = learner.course.filter(
        (course) => !course.enrollment
      );
      if (pendingCourses.length === 0) {
        return res.status(200).send(success("No pending course to show"));
      }

      return res
        .status(200)
        .send(success("Pending courses retrieved", pendingCourses));
    } catch (error) {
      console.log("Show pending course error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async approverejectcourse(req, res) {
    try {
      const { learnerId, courseId } = req.query;
      const { approve } = req.body;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }
      const courseIndex = learner.course.findIndex(
        (course) => course.courseId.toString() === courseId
      );
      if (courseIndex === -1) {
        return res
          .status(404)
          .send(failure("Course not found for the learner"));
      }
      if (approve) {
        console.log("approval worked");
        learner.course[courseIndex].enrollment = true;
      } else {
        console.log("disapproval worked");
        learner.course.splice(courseIndex, 1);
      }
      await learner.save();
      return res
        .status(200)
        .send(success("Course approval/rejection updated successfully"));
    } catch (error) {
      console.log("Approve/reject course error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async approvecoursecreation(req, res) {
    try {
      const { courseId } = req.query;
      const { approve } = req.body;
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).send(failure("Course not found"));
      }
      if (approve) {
        course.approved = true;
        await course.save();
        return res.status(200).send(success("Course approved successfully"));
      } else {
        return res.status(400).send(failure("Course approval failed"));
      }
    } catch (error) {
      console.log("Approve/reject course creation error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}
module.exports = new adminController();
