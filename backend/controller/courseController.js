const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
const learnerModel = require("../model/learner");
const transactionModel = require("../model/transaction");
const categoryModel = require("../model/category");
const typeModel = require("../model/types");
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
      const { title, instructor, category, description, paid } = req.body;
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
        paid: paid,
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
      const { courseId } = req.query;
      const { learnerId } = req.body;
      const cart = await cartModel.findOne({ learnerId });
      if (cart && cart.courseId.includes(courseId)) {
        return res.status(400).send(failure("Course is already in the cart"));
      }
      const buyer = await learnerModel.findOne({
        _id: learnerId,
        "course.courseId": courseId,
      });
      if (
        buyer &&
        buyer.course.some(
          (course) => course.courseId.equals(courseId) && course.enrollment
        )
      ) {
        return res
          .status(400)
          .send(failure("You have already checked out this course"));
      }

      const learner = await learnerModel.findOne({ _id: learnerId });
      if (!learner) {
        return res.status(400).send(failure("Learner not found"));
      }
      let cartId = learner.cartId;
      if (!cartId) {
        const cart = await cartModel.create({
          courseId: [courseId],
          learnerId: learnerId,
        });
        cartId = cart._id;
      } else {
        const cartUpdate = await cartModel.updateOne(
          { _id: cartId },
          { $push: { courseId: courseId }, $set: { checked: false } }
        );
      }
      console.log("cart", cart);
      const updatedLearner = await learnerModel.updateOne(
        { _id: learnerId },
        { cartId: cartId }
      );

      if (updatedLearner) {
        return res.status(200).send(success("Course added to cart"));
      } else {
        return res.status(400).send(failure("Could not add course to cart"));
      }
    } catch (error) {
      console.log("Add to cart error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async createTransaction(req, res) {
    try {
      const { cartId, learnerId } = req.body;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res
          .status(404)
          .send(failure(`Learner with ID ${learnerId} not found`));
      }
      const userCart = await cartModel.findById(cartId);
      if (!userCart) {
        return res
          .status(404)
          .send(failure(`Cart with ID ${cartId} not found`));
      } else {
        if (userCart.checked) {
          return res
            .status(400)
            .send(failure(`Please wait for admin approval`));
        }
      }
      for (const course of userCart.courseId) {
        const courseItem = await courseModel.findById(course);

        if (!courseItem) {
          return res
            .status(404)
            .send(failure(`Course with ID ${course} not found`));
        }
      }

      const newTransaction = new transactionModel({
        userId: learnerId,
        cartId: cartId,
      });

      for (const courseId of userCart.courseId) {
        learner.course.push({
          courseId: courseId,
          enrollment: false,
        });
      }

      userCart.courseId = [];
      userCart.checked = true;
      await userCart.save();
      await newTransaction
        .save()
        .then((data) => {
          learner.transactionId = newTransaction._id;
          learner.save();
          return res
            .status(200)
            .send(
              success("One transaction has been created", { Transaction: data })
            );
        })
        .catch((err) => {
          console.log("Transaction error", err);
          return res.status(500).send(failure("Failed to add the transaction"));
        });
    } catch (error) {
      console.error("Checkout error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getCourses(req, res) {
    try {
      let {
        page,
        limit,
        searchParam,
        order,
        sortField,
        category,
        rate,
        rateFlow,
        paid,
        courseId,
      } = req.query;

      if (courseId) {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
          return res.status(400).send({ error: "Invalid ObjectId" });
        }
      }

      const query = {};
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 12;
      }

      if (searchParam) {
        const regex = new RegExp(searchParam, "i"); // 'i' flag for case-insensitive search
        query.$or = [
          { category: regex },
          // { instructor: regex }, //instructor id theke populate kora lagbe
          { title: regex },
          { description: regex },
        ];
      }

      if (query.ratings) {
        if (rate && (rateFlow === "upper" || rateFlow === "lower")) {
          if (rateFlow === "upper") {
            query.ratings.rate = { $gte: parseFloat(rate) };
          } else {
            query.ratings.rate = { $lte: parseFloat(rate) };
          }
        } else if (rate) {
          query.ratings.rate = {
            $eq: parseFloat(rate),
          };
        }
      }

      if (courseId) {
        query._id = new mongoose.Types.ObjectId(courseId);
      }

      // pagination
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
      };
      if (sortField && !order) {
        options.sort = { [sortField]: 1 }; // Ascending order by default
      }

      // Sort based on any field in ascending or descending order
      if (order) {
        if (order === "asc") {
          options.sort = { [sortField]: 1 }; // Ascending order
        } else if (order === "desc") {
          options.sort = { [sortField]: -1 }; // Descending order
        } else {
          return res
            .status(200)
            .send(success("Ascending/descending parameter is invalid"));
        }
      }
      if (category) {
        query.category = new RegExp(category, "i");
      }
      // Filter based on the 'paid' property (if provided)
      if (paid !== undefined && paid !== null) {
        query.paid = paid === "true" ? true : paid === "false" ? false : null;
      }

      // Find documents that match the query
      const courses = await courseModel.find(query, null, options);

      if (courses.length > 0) {
        console.log(courses);
        return res.status(200).send(success("Successfully fetched", courses));
      }
      if (courses.length == 0) {
        return res.status(404).send(failure("No course found"));
      }
    } catch (error) {
      console.log("Get courses error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).send(failure("Name is required."));
      }
      const existingCategory = await categoryModel.findOne({ name });
      if (existingCategory) {
        return res.send(failure("This category already exists"));
      } else {
        const newCategory = new categoryModel({
          name,
        });
        await newCategory.save();
        return res.status(200).send(success("New category created."));
      }
    } catch (error) {
      console.log("Create category error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async createType(req, res) {
    try {
      const { category } = req.query;
      const { name } = req.body;
      if (!name || !category) {
        return res.status(400).send(failure("Name and category are required."));
      }

      const existingCategory = await categoryModel.findById(category);

      if (!existingCategory) {
        return res.status(404).send(failure("Category not found"));
      }
      const newType = new typeModel({
        name,
        category: existingCategory._id,
      });
      await newType.save();
      existingCategory.type.push(newType._id);
      await existingCategory.save();
      return res
        .status(200)
        .send(success("New type created and added to the category."));
    } catch (error) {
      console.log("Create type error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}
module.exports = new courseController();
