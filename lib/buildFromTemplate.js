const fs = require('fs')
const path = require('path')

module.exports = async function (post) {
  const { url } = await post.fetch()

  const proper = url.replace(/(\/[a-z][a-z])?\/gifs\/detail/g, '')
  const why_url = 'https://gist.github.com/ImJustToNy/cb3457e36f22123eb93864f0af639da3'
  const source_code = 'https://github.com/ImJustToNy/GfycatDetailsConvert'

  return
    fs.readSync(path.join(__dirname, '../comment.tpl'))
      .replace('[proper]', proper)
      .replace('[why_url]', why_url)
      .replace('[source_code]', source_code)
}
