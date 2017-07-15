const snoowrap = require('snoowrap')
const Client = require('pg').Client

require('dotenv').config()

if (typeof process.env.REDDIT_USERAGENT == 'undefined') {
    throw new Error('Please fill your .env file. For more information, go here: https://github.com/ImJustToNy/GfycatDetailsConvert')
}

const r = new snoowrap({
  userAgent: process.env.REDDIT_USERAGENT,
  clientId: process.env.REDDIT_CLIENTID,
  clientSecret: process.env.REDDIT_CLIENTSECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
})

var client = new Client(process.env.DATABASE_URL + '?ssl=true')

client.connect()

function checkForNewPosts () {   
    client.query('SELECT * FROM posts', (err, res) => {
        if (err) {
            throw new Error('There was an error while trying to fetch posts')
        }

        var posts = res.rows.map(post => post.post_id)

        r.getNew('all').forEach(post => {
            if (post.domain == 'gfycat.com' && ~post.url.indexOf('gifs/detail/') && !posts.includes(post.id)) {
                var proper = post.url.replace('gifs/detail/', '')

                post.reply('Proper [Gfycat URL](' + proper + ') \n\n' + '^^^I\'m ^^^just ^^^a ^^^bot, ^^^bleep, ^^^bloop. ^^^If ^^^you ^^^want ^^^to ^^^report ^^^my ^^^bad ^^^behaviour, ^^^please ^^^reach ^^^my ^^^master: ^^^/u/ParrotCraft').then(reply => {

                    client.query('INSERT INTO posts (post_id, comment_id) VALUES ($1, $2)', [post.id, reply.id], function (err) {
                        if (err) {
                            console.log('There was an error while trying to push new post into database', err)
                        }
                    })
                })

                console.log('Before: ' + post.url + ', after: ' + proper)
            }
        })
    })
}

setInterval(checkForNewPosts, 5000)