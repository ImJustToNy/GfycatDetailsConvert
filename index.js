const chalk = require('chalk')
const Snoowrap = require('snoowrap')
const async = require('async')

console.log(chalk.cyan.bold('GfycatDetailsConvert is booting up...'))

let lastChecked

require('dotenv').config()

if (typeof process.env.REDDIT_USERAGENT === 'undefined') {
  throw new Error('Please fill your .env file. For more information, go here: https://github.com/ImJustToNy/GfycatDetailsConvert')
}

const r = new Snoowrap({
  userAgent: process.env.REDDIT_USERAGENT,
  clientId: process.env.REDDIT_CLIENTID,
  clientSecret: process.env.REDDIT_CLIENTSECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

r.config({
  requestDelay: 2000,
  continueAfterRatelimitError: true,
  maxRetryAttempts: 5,
  debug: process.env.NODE_ENV != 'production'
})

setInterval(() => {
  r.getNew('all', {
    before: lastChecked,
    show: 'all',
    amount: 1000
  }).then(posts => {
    if (posts.length > 0) {
      lastChecked = posts[0].name

      async.every(posts, (post, callback) => {
        if (post.domain === 'gfycat.com' && /(\/[a-z][a-z])?\/gifs\/detail/g.test(post.url)) {
          post.fetch().comments.map(comment => comment.author.name).then(participants => {
            callback(null, true)
            if (!participants.includes(process.env.REDDIT_USERNAME)) {
              console.log(chalk.red(chalk.bold('Found new post: ') + post.title + ' [/r/' + post.subreddit.display_name + ']'))

              post.reply('[Proper Gfycat URL](' + post.url.replace(/(\/[a-z][a-z])?\/gifs\/detail/g, '') + ') \n\n' + '^^I\'m ^^just ^^a ^^bot, ^^bleep, ^^bloop. [^^[Why?]](https://gist.github.com/ImJustToNy/cb3457e36f22123eb93864f0af639da3) [^^[Source ^^code]](https://github.com/ImJustToNy/GfycatDetailsConvert)')
            }
          })
        }
      })
    }
  })
}, 5000)
