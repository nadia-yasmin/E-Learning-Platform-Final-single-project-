const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const lessonModel = require("../model/lesson");
const authModel=require("../model/auth.js")
const quizModel = require("../model/quiz");
const learnerModel = require("../model/learner");
const quizsubmissionModel = require("../model/quizsubmissions");
const assignmentsubmissionModel = require("../model/assignmentsubmission");
const instructorModel = require("../model/instructor");
const discussionModel = require("../model/discussion");
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
      const { courseId } = req.query;
      const { title, description, assignmenttext } = req.body;
      let video1 = req.files["video"][0];
      let slides1 = req.files["slides"][0];
      let assignment1 = req.files["assignment"][0];
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

      const paramsThree = {
        Bucket: "nadia-bucket",
        Key: assignment1.originalname,
        Body: assignment1.buffer,
      };
      console.log("Params", params);
      const uploadassignment = async () => {
        return new Promise((resolve, reject) => {
          s3.upload(paramsThree, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Location);
            }
          });
        });
      };

      const assignmentUrl = await uploadassignment();
      console.log("assignment Url", assignmentUrl);
      const assignment = {
        diagram: assignmentUrl,
        text: assignmenttext,
      };
      const existingLesson = await lessonModel.findOne({ title: title });
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(400).send(failure("This course does not exist"));
      }
      console.log("course", course);
      const lessonNumber =
        course.lesson.length === 0 ? 1 : course.lesson.length + 1;
      if (existingLesson) {
        return res
          .status(400)
          .send(failure("A lesson with this title already exists"));
      }
      const result = await lessonModel.create({
        title: title,
        courseId: courseId,
        description: description,
        video: videoUrl,
        slides: slidesUrl,
        number: lessonNumber,
        assignment: assignment,
      });
      if (result) {
        course.lesson.push(result._id);
        course.content.assignment++;
        course.content.videos++;
        course.content.slides++;
        await course.save();
        return res.status(200).send(success("New lesson added", result));
      } else {
        return res.status(400).send(failure("Could not add a new lesson"));
      }
    } catch (error) {
      console.log("Lesson add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async createQuiz(req, res) {
    try {
      const { lessonId } = req.query;
      const { question, options } = req.body;

      const quiz = [
        {
          question: question,
          options: options,
        },
      ];

      const newQuiz = await quizModel.create({ lessonId, quiz });

      if (newQuiz) {
        const lesson = await lessonModel.findById(lessonId);
        lesson.quiz = newQuiz._id;
        await lesson.save();
        return res.status(200).send(success("Quiz created", newQuiz));
      } else {
        return res.status(400).send(failure("Could not create the quiz"));
      }
    } catch (error) {
      console.log("Quiz create error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async addQuiz(req, res) {
    try {
      const { lessonId } = req.query;
      const { question, options } = req.body;
      const existingQuiz = await quizModel.findOne({ lessonId });
      if (!existingQuiz) {
        return res
          .status(400)
          .send(failure("Quiz for the specified lesson not found"));
      }
      existingQuiz.quiz.push({ question, options });
      const updatedQuiz = await existingQuiz.save();

      if (updatedQuiz) {
        return res.status(200).send(success("Quiz updated", updatedQuiz));
      } else {
        return res.status(400).send(failure("Could not update the quiz"));
      }
    } catch (error) {
      console.log("Quiz add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
  async attemptQuiz(req, res) {
    try {
      const { quizId } = req.query;
      const { learnerId, answer } = req.body;
      let submissionId;
      console.log("learnerId,answer", learnerId, answer);
      const quiz = await quizModel.findById(quizId);
      console.log("quiz", quiz);
      if (!quiz) {
        return res.status(404).send(failure("Quiz not found"));
      }

      const existingSubmission = await quizsubmissionModel.findOne({
        learnerId,
        quizId,
      });
      if (!existingSubmission) {
        const newSubmission = new quizsubmissionModel({
          learnerId,
          quizId,
          submission: [
            {
              questionId: answer.questionId,
              optionId: answer.selectedOptionId,
            },
          ],
        });
        const savedSubmission = await newSubmission.save();
        submissionId = savedSubmission._id;
      } else {
        const submission = existingSubmission.submission || [];
        const existingAnswerIndex = submission.findIndex(
          (item) => item.questionId === answer.questionId
        );

        if (existingAnswerIndex !== -1) {
          submission[existingAnswerIndex].optionId = answer.selectedOptionId;
        } else {
          submission.push({
            questionId: answer.questionId,
            optionId: answer.selectedOptionId,
          });
        }

        const savedSubmission = await existingSubmission.save();
        submissionId = savedSubmission._id;
      }
      const learner = await learnerModel.findById(learnerId);
      if (learner) {
        learner.quizsubmissionId = submissionId;
        await learner.save();
      }
      return res.status(200).json({ message: "One question attempted" });
    } catch (error) {
      console.error("Attempt quiz error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async submitQuiz(req, res) {
    try {
      const { learnerId } = req.body;
      const learner = await learnerModel.findById(learnerId);

      if (!learner) {
        return res.status(404).json({ error: "Learner not found" });
      }

      const quizsubmissionId = learner.quizsubmissionId;

      if (!quizsubmissionId || quizsubmissionId.length === 0) {
        return res
          .status(400)
          .json({ error: "No quiz submission found for the learner" });
      }
      const quizsubmission = await quizsubmissionModel.findById(
        quizsubmissionId
      );
      const submittedAnswers = quizsubmission.submission;
      const quiz = await quizModel.findById(quizsubmission.quizId);

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      let score = 0;
      for (const submittedAnswer of submittedAnswers) {
        const question = quiz.quiz.find((q) => {
          return q._id.toString() === submittedAnswer.questionId;
        });
        if (!question) {
          continue;
        }
        const selectedOption = question.options.find(
          (opt) => opt._id.toString() === submittedAnswer.optionId
        );
        if (!selectedOption) {
          continue;
        }
        if (selectedOption.correct) {
          score += 1;
        }
      }
      const existingQuizIndex = learner.quiz.findIndex(
        (item) => item.quizId.toString() === quizsubmission.quizId.toString()
      );

      if (existingQuizIndex !== -1) {
        learner.quiz[existingQuizIndex].score = score;
      } else {
        learner.quiz.push({ quizId: quizsubmission.quizId, score });
      }

      await learner.save();

      const totalQuestions = quiz.quiz.length;
      const feedback = {
        score,
        totalQuestions,
        percentage: (score / totalQuestions) * 100,
      };

      return res
        .status(200)
        .json({ message: "Quiz completed successfully", feedback });
    } catch (error) {
      console.error("Submit quiz error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async submitassignment(req, res) {
    try {
      const { lessonId } = req.query;
      const { learnerId } = req.body;
      const existingSubmission = await assignmentsubmissionModel.findOne({
        learnerId,
        lessonId,
      });
      if (existingSubmission && existingSubmission.submit) {
        return res.status(400).json({ error: "Assignment already submitted" });
      }

      const lesson = await lessonModel.findById(lessonId);

      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const courseId = lesson.courseId;
      const learner = await learnerModel.findOne({
        _id: learnerId,
        "course.courseId": courseId,
      });

      if (!learner) {
        return res.status(400).json({
          error: "Learner is not enrolled in the course of the lesson",
        });
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
      const uploadfile = async () => {
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
      const submissionUrl = await uploadfile();
      const newSubmission = new assignmentsubmissionModel({
        learnerId,
        lessonId,
        submission: submissionUrl,
        submit: true,
      });
      await newSubmission.save();
      learner.assignmentsubmissionId = newSubmission._id;
      await learner.save();
      return res
        .status(200)
        .json({ message: "Assignment submitted successfully" });
    } catch (error) {
      console.error("Submit assignment error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async evaluateassignment(req, res) {
    try {
      const { learnerId, score } = req.body;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).json({ error: "Learner not found" });
      }
      const assignmentsubmissionId = learner.assignmentsubmissionId;
      if (!assignmentsubmissionId) {
        return res
          .status(400)
          .json({ error: "No assignment submission found for the learner" });
      }
      const submission = await assignmentsubmissionModel.findById(
        assignmentsubmissionId
      );
      if (!submission) {
        return res
          .status(404)
          .json({ error: "Assignment submission not found" });
      }
      if (submission.checked) {
        return res.status(400).json({ error: "Assignment already checked" });
      }
      submission.score = score;
      submission.checked = true;
      await submission.save();
      return res
        .status(200)
        .json({ message: "Assignment evaluated successfully" });
    } catch (error) {
      console.error("Evaluate assignment error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  async postdiscussion(req, res) {
    try {
      const { lessonId, reference } = req.query;
      const { email, text } = req.body;
      const user = await authModel.findOne({ email });
      const lesson = await lessonModel.findOne({ _id: lessonId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      let discussionData = {};
      if(reference){
    
          const learner = await learnerModel.findById(reference) 
          if (learner){
            discussionData = {
              learnerId: user._id,
              text: `${learner.name} - ${text}`,
              lessonId
          } 
          }
          else{
            const instructor = await instructorModel.findById(reference)
            console.log("instructor, reference",instructor,reference)
            discussionData = {
              instructorId: user._id,
              text: `${instructor.name} - ${text}`,
              lessonId
            };
          }
         
      }
      else if( user.role==="learner"){ 
          discussionData = {
            learnerId: user._id,
            text: `${text}`,
            lessonId
      }
      }
      else if( user.role==="instructor"){ 
        discussionData = {
          instructorId: user._id,
          text: `${text}`,
          lessonId
    }
    }
      
        const existingDiscussion = await discussionModel.findOne({ _id: lesson.discussion });
      
      if (existingDiscussion) {
        existingDiscussion.discussion.push(discussionData);
        await existingDiscussion.save();
      } else {
        const discussion = await discussionModel.create({ discussion: [discussionData] });
        lesson.discussion = discussion._id;
        await lesson.save();
      }
  
      return res.status(200).json({ message: "Discussion posted successfully" });
    } catch (error) {
      console.error("Post discussion error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
  
}
module.exports = new lessonController();
