require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const middleware = require('./middleware/auth_middleware');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((connected) => console.log("MongoDb Connected"))
    .catch(err => console.log(err));

// middleware and routes

app.use(express.json())
app.route("/").get((req, res) => {
    res.send("Hello From Blog App")
})
app.use("/api/users", userRouter);
app.use("/api/v1/posts", middleware.checkToken, postRouter);


app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));