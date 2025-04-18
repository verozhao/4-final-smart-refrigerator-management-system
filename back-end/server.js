#!/usr/bin/env node
require('dotenv').config();
const server = require("./app") // load up the web server
const connectDB = require('./mongo');
const port = 5001 // the port to listen to for incoming requests

// call express's listen function to start listening to the port
let listener;

// First connect to MongoDB, then start server
connectDB().then(() => {
  listener = server.listen(port, function () {
    console.log(`Server running on port: ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1); // Exit process if DB connection fails
});

// a function to stop listening to the port
const close = () => {
  listener.close()
};


module.exports = {
  close: close,
}