const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../constants/common");
const adminModel = require("../model/admin");
const learnerModel = require("../model/learner");
const instructorModel = require("../model/instructor");
const courseModel = require("../model/course");
const cartModel = require("../model/cart");
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
}
module.exports = new learnerController();
