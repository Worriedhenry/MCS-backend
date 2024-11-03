const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS middleware
const socketHandler = require('./utils/socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enable CORS for all routes
app.use(cors());

// Initialize socket handling
socketHandler(io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(err => {
    console.log(err);
  });

// server.use(CookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// const app=express()


app.get("/connection", (req, res) => {
  res.status(200).send("Connected")
})


var imageup=require('./Controllers/ImageUpload')
app.use("/",imageup);

var authorisation=require('./Controllers/Authorisation')
app.use("/",authorisation);

var profile=require('./Controllers/profile')
app.use("/",profile);

var service=require('./Controllers/service')
app.use("/",service);

var user=require('./Controllers/user')
app.use("/",user);

// var search=require('./Controllers/Search')
// app.use("/",search);

var proposal=require('./Controllers/proposal')
app.use("/",proposal);

var review=require('./Controllers/reviews')
app.use("/",review);

var { chats }=require('./Controllers/chats')
app.use("/",chats); 

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

module.exports.io = io;
