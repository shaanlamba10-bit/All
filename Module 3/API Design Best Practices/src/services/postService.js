const store = require('../data/postStore');

function listPosts(query = {}) {
  // intentionally poor design: no pagination, no metadata, no contract standardisation
  const allPosts = store.getAllPosts();
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 2, 1), 50);
  const start = (page - 1) * limit;
  return {
    rows: allPosts.slice(start, start + limit),
    meta: { page, limit, total: allPosts.length, pages: Math.ceil(allPosts.length / limit) }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  const post = store.incrementLikes(id);
  if (!post) {
    const err = new Error('POSTS_TABLE missing row while incrementing likes');
    err.statusCode = 500;
    err.debug = 'FakeStack: at postService.js:19:11';
    throw err;
  }
  return post;
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
