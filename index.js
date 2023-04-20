const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const settings = require('./settings.json')

const bot = new TelegramBot(settings.token, { polling: true })
var app = express()

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id
    bot.sendMessage(id, 'Привет')
    // TODO: add user to database
})


bot.onText(/\/stop/, (msg) => {
    const id = msg.chat.id
    bot.sendMessage(id, 'До свидания!')
    // TODO: delete user from database 
})

app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.listen(8000)

app.post('/', (req, res) => {
    console.log(req.body)
    if (req.body) {
        bot.sendMessage(settings.id, req.body.data)
    }
    res.send()
})