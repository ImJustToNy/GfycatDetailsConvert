const chalk = require('chalk')
const path = require('path')

const buildFromTemplate = require(path.join(__dirname, 'buildFromTemplate.js'))

module.exports = async function (post) {
  const { comments, subreddit, title } = await post.fetch()
  const participants = comments.map(comment => comment.author.name)

  if (participants.includes(process.env.REDDIT_USERNAME)) {
    return
  }

  console.log(chalk.red(`${chalk.bold('Found new post:')} ${title} [/r/${subreddit.display_name}]`))

  const comment = buildFromTemplate(post)

  return post.reply(comment)
}
