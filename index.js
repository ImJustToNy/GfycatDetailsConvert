const Snoowrap = require('snoowrap')
const dotenv = require('dotenv')
const chalk = require('chalk')
const fs = require('fs')

const showError = require('./lib/showError')
const urlChecker = require('./lib/urlChecker')
const makeComment = require('./lib/makeComment')

console.log(chalk.cyan.bold('GfycatDetailsConvert is booting up...'))

dotenv.config()

if (!('REDDIT_USERAGENT' in process.env)) {
  showError('We wasn\'t able to find enviroment variables with credentials.')
}

if (!fs.existsSync('comment.tpl')) {
  showError('We wasn\'t able to find comment.tpl file.')
}

const bot = new Snoowrap({
  userAgent: process.env.REDDIT_USERAGENT,
  clientId: process.env.REDDIT_CLIENTID,
  clientSecret: process.env.REDDIT_CLIENTSECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

bot.config({
  requestDelay: 2000,
  continueAfterRatelimitError: true,
  maxRetryAttempts: 5,
  debug: process.env.NODE_ENV !== 'production'
})

async function pollNewPosts () {
  let lastChecked

  while (true) {
    const posts = await bot.getNew('all', {
      before: lastChecked,
      show: 'all',
      amount: 1000
    })

    if (posts.length > 0) {
      lastChecked = posts[0].name
    }

    await Promise.all(posts
      .filter(urlChecker)
      .map(makeComment)
    )

    await new Promise(resolve => setTimeout(resolve, 60 * 1000))
  }
}

pollNewPosts()
