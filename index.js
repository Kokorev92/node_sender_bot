const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const settings = require('./settings.json')
const Sequelize = require('sequelize')

const bot = new TelegramBot(settings.token, { polling: true })
var app = express()

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'bot.db'
})

const users_db = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    t_login: {
        type: Sequelize.TEXT
    },
    pass: {
        type: Sequelize.TEXT
    }
},
    {
        freezeTableName: true,
        timestamps: false
    }
)

sequelize.sync().then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
})

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id
    bot.sendMessage(id, 'Привет! Для регистрации в боте пришли: /reg <ваш_пароль>')

})

bot.onText(/\/reg (.+)/, (msg, match) => {
    users_db.create({ id: msg.chat.id, t_login: msg.chat.username, pass: match[1] }).then(res => {
        bot.sendMessage(msg.chat.id,
            `Поздравляем, ${msg.chat.username}! Вы успешно зарегестрированы и можете пересылать сообщения через http://kokorev-test:8020/`)
    })
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                bot.sendMessage(msg.chat.id, `Вы уже зарегестрированы, ${msg.chat.username}!`)
            }
        })
})

bot.onText(/\/stop/, (msg) => {
    users_db.findOne({ where: { id: msg.chat.id } }).then((user) => {
        users_db.destroy({
            where: {
                id: user.id
            }
        }).then(res => {
            bot.sendMessage(user.id, `До свидания, ${msg.chat.username}!`)
        })
    }).catch(err => {
        bot.sendMessage(msg.chat.id, `Вы не зарегистрированы!`)
    })
})

app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.listen(8000)

app.post('/', (req, res) => {
    console.log(req.body)
    if (req.body) {
        users_db.findOne({ where: { pass: req.body.password } }).then((user) => {
            bot.sendMessage(user.id, req.body.data)
            let response = { 'status': 'OK' }
            res.send(JSON.stringify(response))
        }).catch(err => {
            let response = { 'status': 'AUTH_ERROR' }
            res.send(JSON.stringify(response))
        })
    }

})