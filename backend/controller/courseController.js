const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common.js");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
const learnerModel = require("../model/learner");
const transactionModel = require("../model/transaction");
const categoryModel = require("../model/category");
const typeModel = require("../model/types");
const rateModel = require("../model/rate");
const wishlistModel = require("../model/wishlist");
const reviewModel = require("../model/review");
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
      const { title, instructor, categoryId, typeId, description, paid } =
        req.body;
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
      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      const typeObjectId = new mongoose.Types.ObjectId(typeId);
      const category = await categoryModel.findById(categoryObjectId);
      const type = await typeModel.findById(typeObjectId);

      if (!category) {
        return res.status(400).send(failure("Category not found"));
      }
      if (!type) {
        return res.status(400).send(failure("Type not found"));
      }
      if (!category.type.includes(type._id)) {
        return res
          .status(400)
          .send(failure("Type does not belong to the selected category"));
      }
      const result = await courseModel.create({
        title: title,
        instructor: instructor,
        category: category.name,
        type: type.name,
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
        type,
        rate,
        rateFlow,
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
        limit = 3;
      }

      if (searchParam) {
        const regex = new RegExp(searchParam, "i"); // 'i' flag for case-insensitive search
        query.$or = [
          { category: regex },
          { type: regex },
          { title: regex },
          { description: regex },
        ];
      }

      if (rate) {
        query["ratings.rate"] = { $exists: true };
        if (rateFlow === "upper" || rateFlow === "lower") {
          if (rateFlow === "upper") {
            query["ratings.rate"] = { $gte: parseFloat(rate) };
          } else {
            query["ratings.rate"] = { $lte: parseFloat(rate) };
          }
        } else {
          query["ratings.rate"] = { $eq: parseFloat(rate) };
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
      if (type) {
        query.type = new RegExp(type, "i");
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
      const existingType = await typeModel.findOne({
        name,
        category: existingCategory._id,
      });

      if (existingType) {
        return res
          .status(400)
          .send(
            failure("Type with the same name already exists in the category.")
          );
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

  async addRate(req, res) {
    try {
      const { rate, courseId, learnerId } = req.body;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).send(failure("learner not found"));
      }
      const isEnrolled = learner.course.some(
        (course) =>
          course.courseId.equals(courseId) && course.enrollment === true
      );

      if (!isEnrolled) {
        return res
          .status(400)
          .send(failure("Learner is not enrolled in this course."));
      }
      const existingRate = await rateModel.findOne({
        courseId,
        learnerId: learner._id,
      });

      if (existingRate) {
        return res
          .status(400)
          .send(failure("You have already provided a rate for this course."));
      }
      const newRate = new rateModel({
        rate,
        courseId,
        learnerId: learner._id,
      });

      const savedRate = await newRate.save();
      await courseModel.updateOne(
        { _id: new mongoose.Types.ObjectId(courseId) },
        { $push: { "ratings.userRate": savedRate._id } }
      );
      const averageRate = await rateModel.aggregate([
        {
          $match: { courseId: new mongoose.Types.ObjectId(courseId) },
        },
        {
          $group: {
            _id: null,
            averageRate: { $avg: "$rate" },
          },
        },
      ]);
      if (averageRate.length > 0) {
        const average = averageRate[0].averageRate;
        await courseModel.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { $set: { "ratings.rate": average } }
        );
      }
      return res
        .status(200)
        .json({ message: "Rate added successfully", rate: savedRate });
    } catch (error) {
      console.error("Add rate error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async updateRate(req, res) {
    try {
      const { courseId } = req.query;
      const { rate, email } = req.body;
      // const token = req.headers.authorization.split(" ")[1];
      // const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
      const learner = await learnerModel.findOne({ email: email });
      if (!learner) {
        return res.status(404).json({ error: "Learner is not found" });
      }
      const existingRate = await rateModel.findOne({
        courseId,
        learnerId: learner._id,
      });

      if (!existingRate) {
        return res.status(404).json({ error: "No data found to update" });
      }
      existingRate.rate = rate;
      const savedRate = await existingRate.save();
      const averageRate = await rateModel.aggregate([
        {
          $match: { courseId: new mongoose.Types.ObjectId(courseId) },
        },
        {
          $group: {
            _id: null,
            averageRate: { $avg: "$rate" },
          },
        },
      ]);
      if (averageRate.length > 0) {
        const average = averageRate[0].averageRate;
        await courseModel.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { $set: { "ratings.rate": average } }
        );
      }
      return res
        .status(200)
        .json({ message: "Rate updated successfully", rate: savedRate });
    } catch (error) {
      console.error("Update rate error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteRate(req, res) {
    try {
      const { courseId } = req.query;
      const { email } = req.body;
      // const token = req.headers.authorization.split(" ")[1];
      // const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
      const learner = await learnerModel.findOne({ email: email });
      if (!learner) {
        return res.status(404).json({ error: "Learner is not found" });
      }
      const userIdAsString = learner._id.toString();
      const result = await rateModel.findOne({
        courseId,
        learnerId: userIdAsString,
      });
      const result2 = await rateModel.findOneAndDelete({
        courseId,
        learnerId: userIdAsString,
      });
      if (!result) {
        return res.status(404).json({ error: "No data found to delete" });
      } else {
        await courseModel.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          {
            $pull: {
              "ratings.userRate": result._id,
            },
          }
        );
        const averageRate = await rateModel.aggregate([
          {
            $match: { courseId: new mongoose.Types.ObjectId(courseId) },
          },
          {
            $group: {
              _id: null,
              averageRate: { $avg: "$rate" },
            },
          },
        ]);
        if (averageRate.length > 0) {
          const average = averageRate[0].averageRate;
          await courseModel.updateOne(
            { _id: new mongoose.Types.ObjectId(courseId) },
            { $set: { "ratings.rate": average } }
          );
        }
        return res.status(200).send(success(`rate is deleted successfully`));
      }
    } catch (error) {
      console.error("Update rate error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async addtoWishlist(req, res) {
    try {
      const { learnerId, courseId } = req.body;
      const learner = await learnerModel.findById(learnerId);
      if (!learner) {
        return res.status(404).json({ error: "Learner not found" });
      }
      const isEnrolled = learner.course.some(
        (course) => course.courseId.toString() === courseId && course.enrollment
      );

      if (isEnrolled) {
        return res
          .status(400)
          .json({ error: "You are already enrolled in this course" });
      }
      if (learner.wishlistId) {
        const existingWishlist = await wishlistModel.findById(
          learner.wishlistId
        );
        if (existingWishlist && existingWishlist.courseId.includes(courseId)) {
          return res
            .status(400)
            .json({ error: "Course is already in the wishlist" });
        }
        existingWishlist.courseId.push(courseId);
        await existingWishlist.save();
      } else {
        const newWishlist = new wishlistModel({
          learnerId,
          courseId: [courseId],
        });
        await newWishlist.save();
        learner.wishlistId = newWishlist._id;
        await learner.save();
      }

      return res
        .status(200)
        .json({ message: "Course added to wishlist successfully" });
    } catch (error) {
      console.error("Add to wishlist error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async showWishlist(req, res) {
    try {
      const { learnerId } = req.body;
      const learner = await learnerModel.findById(learnerId);

      if (!learner) {
        return res.status(404).json({ error: "Learner not found" });
      }

      if (!learner.wishlistId) {
        return res.status(200).json({ wishlist: [] });
      }
      const wishlist = await wishlistModel
        .findById(learner.wishlistId)
        .populate({
          path: "courseId",
          select: "-_id -learnerId", // Exclude _id and learnerId fields
        });

      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found" });
      }

      return res.status(200).json({ wishlist: wishlist.courseId });
    } catch (error) {
      console.error("Show wishlist error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async addreview(req, res) {
    try {
      const { email, text } = req.body;
      let { courseId } = req.query;

      const learner = await learnerModel.findOne({ email: email });
      if (!learner) {
        return res.status(404).json({ error: "learner is not found" });
      }
      const existingReview = await reviewModel.findOne({
        courseId,
        learnerId: learner._id,
      });
      if (existingReview) {
        return res.status(400).send(
          failure({
            error: "You have already provided a review for this book.",
          })
        );
      }
      const newReview = new reviewModel({
        text,
        courseId,
        learnerId: learner._id,
      });
      const savedReview = await newReview.save();
      await courseModel.updateOne(
        { _id: courseId },
        { $push: { reviews: savedReview._id } }
      );
      return res
        .status(200)
        .send(success("Review added successfully", { review: savedReview }));
    } catch (error) {
      console.error("Add review error", error);
      return res.status(500).send(success("Internal server error"));
    }
  }

  async updatereview(req, res) {
    try {
      const { courseId } = req.query;
      const { reviewText, email } = req.body;
      // const token = req.headers.authorization.split(" ")[1];
      // const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
      const learner = await learnerModel.findOne({ email: email });
      if (!learner) {
        return res.status(404).send(failure("Learner not found"));
      }
      const existingReview = await reviewModel.findOne({
        courseId,
        learnerId: learner._id,
      });

      if (!existingReview) {
        return res.status(400).send(success("No review found to update"));
      }
      existingReview.reviewText = reviewText;
      const updatedReview = await existingReview.save();
      return res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (error) {
      console.error("Update review error", error);
      return res.status(500).send(success("Internal server error"));
    }
  }
  async showcoursebyid(req, res) {
    try {
      const { courseId } = req.query;
      if (!courseId) {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.status(200).json({ course });
    } catch (error) {
      console.error("Show course by id error", error);
      return res.status(500).send(success("Internal server error"));
    }
  }

  async updateCourse(req, res) {
    try {
      const { courseId } = req.query;
      const { title, category, description, type } = req.body;
      if (!courseId) {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      if (title) {
        course.title = title;
      }
      if (category) {
        course.category = category;
      }
      if (description) {
        course.description = description;
      }
      if (type) {
        course.type = type;
      }
      AWS.config.update({
        accessKeyId: "AKIARBUZNPTUDGAEUUQX",
        secretAccessKey: "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",
        region: "eu-west-3",
      });
      const s3 = new AWS.S3();
      if (req.files && req.files["image"] && req.files["image"].length > 0) {
        if (req.files["image"][0]) {
          let image = req.files["image"][0];
          const params = {
            Bucket: "nadia-bucket",
            Key: image.originalname,
            Body: image.buffer,
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
          course.image = image1;
        }
      }
      if (req.files) {
        if (req.files && req.files["intro"] && req.files["intro"].length > 0) {
          let intro = req.files["intro"][0];
          const paramstwo = {
            Bucket: "nadia-bucket",
            Key: intro.originalname,
            Body: intro.buffer,
          };
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
          course.intro = intro1;
        }
      }

      const updatedCourse = await course.save();
      return res.status(200).json({ updatedCourse });
    } catch (error) {
      console.error("Update course error", error);
      return res.status(500).send(success("Internal server error"));
    }
  }

  async deleteCourse(req, res) {
    try {
      const { courseId } = req.query;
      if (!courseId) {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      await courseModel.findByIdAndDelete(courseId);
      return res.status(200).send(success("Course deleted successfully"));
    } catch (error) {
      console.error("Delete course error", error);
      return res.status(500).send(success("Internal server error"));
    }
  }
}
module.exports = new courseController();
