const jsonwebtoken = require("jsonwebtoken")
const { success, failure } = require("../constants/common");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const HTTP_STATUS = require("../constants/statusCodes");
const isAuthorised = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log("Unauthorised access, login korenai")
            return res.status(200).send(failure("Unauthorised access"))
        }
        const jwt = req.headers.authorization.split(" ")[1];
        const validate = jsonwebtoken.verify(jwt, process.env.SECRET_KEY);
        if (validate) {
            // console.log("validate", validate)
            next();
        }
        else {
            return res.status(200).send(failure("User is not authorised"))
        }
    }
    catch (error) {
        console.log("token error", error)
        if (error instanceof jsonwebtoken.JsonWebTokenError) {
            return res.status(200).send(failure("Token Invalid, Please login again!"))
        }
        if (error instanceof jsonwebtoken.TokenExpiredError) {
            return res.status(200).send(failure("Token expired, Please login again"))
        }
        const jwt = req.headers.authorization.split(" ")[1];

        return res.status(200).send(failure("Issue related to token, Please login again"))

    }
}
const isAdmin = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
    if (decodedToken && decodedToken.role === "admin") {
        next();
    } else {
        return res.status(403).send(failure('Access denied.You have to be an admin.'));
    }

};
const isLearner = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
    if (decodedToken && decodedToken.role === "learner" ){
        next();
    } else {
        return res.status(403).send(failure('Access denied. You have to be a learner.'));
    }

}
const isInstructor = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(token, process.env.SECRET_KEY);
    if (decodedToken && decodedToken.role === "instructor" ){
        next();
    } else {
        return res.status(403).send(failure('Access denied. You have to be an instructor.'));
    }

}

module.exports = { isAuthorised, isAdmin, isLearner, isInstructor};