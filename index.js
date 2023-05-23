import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/post.js';
import userRoutes from './routes/user.routes.js';

// to use import instead of require : Change "type": "module" in package-lock.json

// Application Set up

const App = express();
dotenv.config();

// BodyParser 
App.use(bodyParser.json({ limit: "30mb", extended: true }));
App.use(bodyParser.urlencoded({ limit: "30mb", extended:true }));

// Cors 
App.use(cors());

// Set Routes
App.use('/users',userRoutes);
App.use('/posts',postRoutes);
App.get('/',(req,res)=>{
    res.send('App is running.');
});
// Db Connection
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{ useNewUrlParser: true })
.then(()=> App.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch((error)=>console.log(error.message));

// mongoose.set('useFindAndModify', false);
