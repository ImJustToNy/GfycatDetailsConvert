const Snoowrap = require('snoowrap')
const dotenv = require('dotenv')
const chalk = require('chalk')
const path = require('path')

const urlChecker = require(path.join(__dirname, '/lib/urlChecker.js'))
const makeComment = require(path.join(__dirname, '/lib/makeComment.js'))

console.log(chalk.cyan.bold('GfycatDetailsConvert is booting up...'))

dotenv.config()

if (!('REDDIT_USERAGENT' in process.env)) {
  console.log(chalk.red.bold('Please fill your .env file. For more information, go here: https://github.com/ImJustToNy/GfycatDetailsConvert'))
  process.exit(1)
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

    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

pollNewPosts()
