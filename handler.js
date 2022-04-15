const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const memberRouter = require('./router/memberRouter');

app.use(express.json());
app.use('/member',memberRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
module.exports.app = app;
