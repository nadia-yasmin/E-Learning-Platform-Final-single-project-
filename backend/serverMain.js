const express = require("express");
const app = express();
const { success, failure } = require("./constants/common");
const courseRouter = require("./route/courseRouter");
const dotenv = require("dotenv");
const cors = require("cors");
const urlnotfound = require("./constants/urlnotfound");
const databaseConnection = require("./database");
const HTTP_STATUS = require("./constants/statusCodes");
dotenv.config();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/course", courseRouter);
app.use(urlnotfound.notFound);
const multer = require("multer");
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status == 400 && "body" in err) {
    return res
      .status(400)
      .send({ message: "You did not provide the right syntax" });
  }
  if (err instanceof multer.MulterError) {
    res.status(400).send({ message: `${err.message}` });
  }
});
databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
