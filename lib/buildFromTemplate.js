const fs = require('fs')
const path = require('path')

module.exports = function (post) {
  const proper = post.url.replace(/(\/[a-z]{2})?\/gifs\/detail/g, '')

  const comment = fs.readFileSync(path.join(__dirname, '../comment.tpl'), 'utf8')
    .replace('[proper]', proper)

  return comment
}
