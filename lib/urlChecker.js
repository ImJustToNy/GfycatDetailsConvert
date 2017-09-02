module.exports = function (post) {
  return post.domain === 'gfycat.com' && /(\/[a-z][a-z])?\/gifs\/detail/g.test(post.url)
}
