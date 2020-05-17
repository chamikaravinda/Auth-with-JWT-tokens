const express = require('express');
const dotenv = require('dotenv');
const mongoose =require('mongoose');
//Import Routes
const authRoute =  require('./routes/auth');
const postRoute = require('./routes/post');
const app = express();
dotenv.config();


//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser:true },
() => console.log('connected to the db...'));

//Middleware
app.use(express.json());

//Rout Middlewares
app.use('/api/user/',authRoute);
app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('Server is up and running...'));
