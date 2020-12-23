const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const middleware = require('../middleware/auth_middleware');


const User = require('../models/User');

//get user details by id
userRouter.get('/details', middleware.checkToken, async (req, res) => {
    const userId = req.decoded.userId;
    const user = await User.findById({ _id: userId }).populate("posts");

    if (user) {
        return res.status(200).json({ "message": "Success", "user": user, "postsCount": user.posts.length });
    } else {
        return res.status(404).json({ "message": "No User Found", "user": [] });
    }
});

//get all user details
userRouter.get('/', async (req, res) => {
    const users = await User.find().populate("posts");
    console.log(users);
    if (users) {
        return res.status(200).json({ "message": "Success", "users": users });
    } else {
        return res.status(404).json({ "message": "No Users Found", "users": [] });
    }
});


//create new user
userRouter.post('/create', async (req, res) => {

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(422).json({ "message": `User with ${req.body.email} already exists` });
        } else {
            const hashed = await bcrypt.hash(req.body.password, Number.parseInt(process.env.BCRYPT_SALT));
            const user = new User(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashed
                }
            );
            const result = await user.save();
            if (result) {
                res.status(201).json({ "message": "User Created Successfully", "user": result });
            } else {
                res.status(400).json({ "message": "Unable to create user", "user": result });
            }
        }

    } catch (e) {
        console.log(e);
        res.status(403).json({ "message": e });
    }
});

userRouter.post('/signin', async (req, res) => {

    if (req.body.email != null && req.body.password != null) {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {

                const token = jwt.sign({ userId: user._id, username: user.name }, process.env.JWT_HASH, {
                    expiresIn: "24h",
                });
                const refreshToken = jwt.sign({ userId: user._id, username: user.name }, process.env.JWT_HASH);
                res.status(200).json({ "message": "Logged In Successfully", "token": token, "refreshToken": refreshToken, "expiry": moment().add(1, 'days').unix() });
            } else {
                res.status(401).json({ "message": "Invalid email or password" });
            }
        } else {
            res.status(401).json({ "message": "Invalid email or password" });
        }
    }
})

//update existing user
userRouter.patch('/update/:id', async (req, res) => {

    const user = await User.findById({ _id: req.params.id });

    if (user) {
        const updated = await user.updateOne({
            name: req.body.name,
            password: req.body.password
        });
        if (updated) {
            const user = await User.findById({ _id: req.params.id });
            return res.status(200).json({ "message": "User Updated Successfully", "user": user });
        } else {
            return res.status(404).json({ "message": "Unable to update user" })
        }
    } else {
        return res.status(404).json({ "message": "Unable to delete user" });
    }

});

//delete user
userRouter.delete('/delete/:id', async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
    if (user && user.delete()) {
        return res.status(200).json({ "message": "User Deleted Successfully" });
    } else {
        return res.status(404).json({ "message": "Unable to delete user" });
    }

});


module.exports = userRouter;

