const port = Number(process.env.PORT || 3000);
const maxArticles = Number(process.env.MAX_ARTICLES || 50);
const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = { port, maxArticles, nodeEnv };
