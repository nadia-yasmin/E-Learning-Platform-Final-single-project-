const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const learnerModel = require("../model/learner");
const lessonModel = require("../model/lesson");
const instructorModel = require("../model/instructor");
const courseModel = require("../model/course");
const assignmentsubmissionModel = require("../model/assignmentsubmission");
const cartModel = require("../model/cart");
const quizModel = require("../model/quiz");
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
class learnerController {
  async removecart(req, res) {
    try {
      const { learnerId } = req.query;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }
      const cartId = learner.cartId;
      if (!cartId) {
        return res.status(404).send(failure("Cart not found for the learner"));
      }
      await cartModel.findByIdAndDelete(cartId);
      learner.cartId = undefined;
      await learner.save();
      return res.status(200).send(success("Cart removed successfully"));
    } catch (error) {
      console.log("Remove whole cart error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async removefromcart(req, res) {
    try {
      const { learnerId, courseId } = req.query;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }
      const cartId = learner.cartId;
      if (!cartId) {
        return res.status(404).send(failure("Cart not found for the learner"));
      }
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
        $pull: { courseId: courseId },
      });

      return res
        .status(200)
        .send(success("Course removed from cart successfully"));
    } catch (error) {
      console.log("Remove from cart error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
  async showprogress(req, res) {
    try {
      const { learnerId } = req.query;
      const learner = await learnerModel.findById(learnerId);

      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }

      if (!learner.quizsubmissionId) {
        return res
          .status(404)
          .send(failure("Quiz submission not found for the learner"));
      }
      // console.log("learner.quiz", learner.quiz);
      // const foundQuiz = await quizModel.findOne({
      //   _id: { $in: learner.quiz.map((item) => item.quizId) },
      // });

      // if (!foundQuiz) {
      //   return res
      //     .status(404)
      //     .send(failure("No matching quizzes found in quizModel"));
      // }
      // const populatedLesson = await lessonModel.populate(foundQuiz, {
      //   path: "lessonId",
      //   model: "lessons",
      // });

      // return res.status(200).json({
      //   message: "Progress fetched successfully",
      //   quiz: populatedLesson,
      // });
      const quizIds = learner.quiz.map((item) => item.quizId);

      const foundQuizzes = await quizModel.find({ _id: { $in: quizIds } });

      if (foundQuizzes.length === 0) {
        return res
          .status(404)
          .send(failure("No matching quizzes found in quizModel"));
      }

      const totalQuizzes = foundQuizzes.reduce(
        (acc, quiz) => acc + quiz.quiz.length,
        0
      );

      const totalScore = learner.quiz.reduce(
        (acc, item) => acc + item.score,
        0
      );

      const progressData = foundQuizzes.map(async (quiz) => {
        const populatedLesson = await lessonModel.populate(quiz, {
          path: "lessonId",
          model: "lessons",
        });

        // const score = learner.quiz.find(
        //   (item) => item.quizId === quiz._id
        // ).score;

        return {
          quiz: populatedLesson,
          achievedscore: totalScore,
          // score: score,
        };
      });

      const resolvedProgressData = await Promise.all(progressData);

      return res.status(200).json({
        message: "Progress fetched successfully",
        progress: resolvedProgressData,
        totalScore: totalScore,
        totalQuizzes: totalQuizzes,
      });
    } catch (error) {
      console.log("Show progress error", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async showassignmentscore(req, res) {
    try {
      const { learnerId } = req.query;
      const assignmentSubmissions = await assignmentsubmissionModel.find({
        learnerId: learnerId,
      });
      const totalScore = assignmentSubmissions.reduce((acc, submission) => {
        return acc + (submission.score || 0);
      }, 0);

      const totalMark = assignmentSubmissions.length * 10;

      return res.status(200).json({
        totalScore,
        totalMark,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new learnerController();
