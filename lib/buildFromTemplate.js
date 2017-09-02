module.exports = async function (post) {
  const { url } = await post.fetch()

  const proper = url.replace(/(\/[a-z][a-z])?\/gifs\/detail/g, '')
  const reason = 'https://gist.github.com/ImJustToNy/cb3457e36f22123eb93864f0af639da3'
  const source = 'https://github.com/ImJustToNy/GfycatDetailsConvert'

  return `[Proper Gfycat URL](${proper}) \n\n^^I'm ^^just ^^a ^^bot, ^^bleep, ^^bloop. [^^[Why?]](${reason}) [^^[Source ^^code]](${source})`
}
