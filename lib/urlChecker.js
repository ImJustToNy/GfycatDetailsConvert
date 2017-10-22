module.exports = function (post) {
  return post.domain === 'gfycat.com' && /(\/[a-z]{2})?\/gifs\/detail/g.test(post.url)
}
