const jsonServer = require('json-server');
const express=require("express")
const mongoose = require('mongoose');
const server = jsonServer.create();
// const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors'); // Import the CORS middleware
require('dotenv').config()
// Enable CORS for all routes
server.use(cors());
mongoose.connect(process.env.MONGODB).then(()=>{
  console.log("connected to db")
}).catch(err=>{
  console.log(err)
})


// server.use(CookieParser())
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
// const app=express()

var imageup=require('./Controllers/ImageUpload')
server.use("/",imageup);

var authorisation=require('./Controllers/Authorisation')
server.use("/",authorisation);

var profile=require('./Controllers/profile')
server.use("/",profile);

var service=require('./Controllers/service')
server.use("/",service);

var user=require('./Controllers/user')
server.use("/",user);

var search=require('./Controllers/Search')
server.use("/",search);

var proposal=require('./Controllers/proposal')
server.use("/",proposal);

var review=require('./Controllers/reviews')
server.use("/",review);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
