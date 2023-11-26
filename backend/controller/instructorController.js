const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const courseModel = require("../model/course");
const assignmentsubmissionModel= require("../model/assignmentsubmission")
const lessonModel=require("../model/lesson")
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
class instructorController {
    async showmystudents(req, res) {
        try {
            const { instructorId } = req.query;
            const instructor = await instructorModel.findById(instructorId);
        if (!instructor) {
                return res.status(404).send(failure("Instructor not found"));
            }
            await instructor.populate('learnerId')
            const students = instructor.learnerId;
            return res.status(200).send(success("List of students", students));
        } catch (error) {
            console.log("Show my students error", error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }
    async viewmystudentsassignments(req, res) {
        try {
            const { learnerId } = req.query;
            const { instructorId } = req.body;
            const instructor = await instructorModel.findById(instructorId);
    
            if (!instructor) {
                return res.status(404).send(failure("Instructor not found"));
            }
            await instructor.populate('learnerId');
            const learner = instructor.learnerId.find((student) =>
                student._id.equals(learnerId)
            );
    
            if (!learner) {
                return res.status(404).send(failure("Learner not found"));
            }
            const assignmentSubmissions = await assignmentsubmissionModel.find({
                learnerId: learnerId,
            }).populate('learnerId').populate('lessonId');
            const assignments = [];
            for (const submission of assignmentSubmissions) {
                const lesson = await lessonModel.findById(submission.lessonId);  
                if (!lesson) {
                    console.log(`Lesson not found for submission ${submission._id}`);
                    continue; 
                }
                const course = await courseModel.findOne({
                    _id: lesson.courseId,
                    instructor: instructor._id,
                });
    
                if (course) {
                    assignments.push({
                        assignment: submission,
                        lessonTitle: lesson.title,
                        courseTitle: course.title,
                    });
                }
            }
    
            return res.status(200).send(success("List of assignments", assignments));
        } catch (error) {
            console.log("View my students assignments error", error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }
    
  

 
}
module.exports = new instructorController();
