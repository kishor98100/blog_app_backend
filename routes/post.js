const postRouter = require('express').Router();


const Post = require('../models/Post');
const User = require('../models/User');
const upload = require('../utils/multer');


//get post details by id
postRouter.get('/:id', async (req, res) => {
    const post = await Post.findById({ _id: req.params.id });
    if (post) {
        return res.status(200).json({ "message": "Success", "post": post });
    } else {
        return res.status(404).json({ "message": "No Post Found", "post": {} });
    }
});

//get all posts details
postRouter.get('/', async (req, res) => {
    const posts = await Post.find();
    if (posts) {
        return res.status(200).json({ "message": "Success", "posts": posts });
    } else {
        return res.status(404).json({ "message": "No Users Found", "posts": [] });
    }
});


//create new post
postRouter.post('/', upload.single('image'), async (req, res) => {

    const userId = req.decoded.userId;
    const username = req.decoded.username;
    console.log(req.file);

    const post =
    {
        title: req.body.title,
        body: req.body.body,
        username: username,
        image: req.file == null ? '' : req.file.path,
    }
    return Post.create(post).then(document => {
        return User.findByIdAndUpdate(userId, { $push: { posts: document._id } }, { new: true, useFindAndModify: false })
            .then(result => {
                res.status(201).json({ "message": "Post Created Successfully", "post": document });
            }).catch(err => {
                res.status(403).json({ "message": err });
            })
    })



});

//update existing post
postRouter.patch('/update/:id', async (req, res) => {

    const updated = await Post.updateOne(
        { _id: req.params.id },
        {
            "$set": {
                title: req.body.title,
                body: req.body.body,
                publishedAt: Date.now()
            }
        });
    if (updated) {
        const post = await Post.findById({ _id: req.params.id });
        return res.status(200).json({ "message": "Post Updated Successfully", "post": post });
    } else {
        return res.status(404).json({ "message": "Unable to update post" })
    }
});

//delete post
postRouter.delete('/delete/:id', async (req, res) => {
    const deleted = await Post.deleteOne(
        { _id: req.params.id },
    );
    if (deleted) {
        return res.status(200).json({ "message": "Post Deleted Successfully" });
    } else {
        return res.status(404).json({ "message": "Unable to delete post" })
    }
});

module.exports = postRouter;

