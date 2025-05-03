require('dotenv').config();  

const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connected to db"));

app.use(express.json());

const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

app.use('/notes', notesRouter);
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.listen(2000, () => console.log("server running"));
