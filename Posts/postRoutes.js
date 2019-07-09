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

module.exports = router;
