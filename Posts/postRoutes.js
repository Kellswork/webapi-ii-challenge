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

router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await db.findById(req.params.postId);

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
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database'
    });
  }
});

router.post('/:postId/comments', async (req, res) => {
  try {
    const post = await db.findById(req.params.postId);
    if (!post.length) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    if (req.body.text.trim() === '') {
      return res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    }
    const comments = await db.insertComment(req.body);
    res.status(201).json(comments);
  } catch (error) {
      console.log(error.message)
    res
      .status(500)
      .json({
        error: 'There was an error while saving the comment to the database'
      });
  }
});

module.exports = router;
