const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.find(req.params);
    if (posts.length > 0) {
      return res.status(200).json(posts);
    }
    res.status(404).json({ error: 'No post has been created yet' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);

    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);

    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    const comments = await db.findPostComments(post[0].id);
    if (!comments.length) {
      return res
        .status(404)
        .json({ message: 'There are no comments for this post' });
    }
    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The comments information could not be retrieved.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (
      title === '' ||
      title.length < 3 ||
      contents === '' ||
      contents.length < 3
    ) {
      return res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    }
    const post = await db.insert(req.body);
    console.log(post);
    const postData = await db.findById(post.id);
    res.status(201).json(postData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'There was an error while saving the post to the database'
    });
  }
});

router.post('/:id/comments', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    if (req.body.text.trim === '' || !req.body.text) {
      return res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    }
    const comments = await db.insertComment(req.body);
    const commentsData = await db.findCommentById(comments.id);

    res.status(201).json(commentsData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: 'There was an error while saving the comment to the database'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    const deletedPost = await db.remove(req.params.id);
    res.status(200).json(deletedPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'The post could not be removed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, contents } = req.body;
    const post = await db.findById(req.params.id);
    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    if (
      title === '' ||
      title.length < 3 ||
      contents === '' ||
      contents.length < 3
    ) {
      return res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    }
    const updatedPost = await db.update(req.params.id, req.body);
    console.log(updatedPost);
    const updatedPostData = await db.findById(req.params.id);
    res.status(200).json(updatedPostData);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: 'The post information could not be modified.' });
  }
});

module.exports = router;
