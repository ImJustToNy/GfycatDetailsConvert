const fs = require('fs')
const path = require('path')

module.exports = function (post) {
  const proper = post.url.replace(/(\/[a-z][a-z])?\/gifs\/detail/g, '')
  const whyUrl = 'https://gist.github.com/ImJustToNy/cb3457e36f22123eb93864f0af639da3'
  const sourceCode = 'https://github.com/ImJustToNy/GfycatDetailsConvert'

  const comment = fs.readFileSync(path.join(__dirname, '../comment.tpl'), 'utf8')
    .replace('[proper]', proper)
    .replace('[why_url]', whyUrl)
    .replace('[source_code]', sourceCode)

  return comment
}
