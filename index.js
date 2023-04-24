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
        type: Sequelize.STRING
    },
    pass: {
        type: Sequelize.STRING
    }
},
    {
        freezeTableName: true,
        timestamps: false
    }
)

async function get_user(pass) {
    let user = await users_db.findOne({ where: { pass: `${pass}` } })

    return user
}

async function delete_user(id) {
    await users_db.destroy({
        where: {
            id: id
        }
    })
}

async function add_user(id, login, password) {
    await users_db.create({ id: id, t_login: login, pass: password })
        .catch(err => {
            if (err.name == 'SequelizeUniqueConstraintError') {
                console.log('User already exists')
            }
        })
}

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id
    bot.sendMessage(id, 'Привет! Для регистрации в боте пришли: /reg <ваш_пароль>')

})

bot.onText(/\/reg (.+)/, (msg, match) => {
    add_user(msg.chat.id, msg.chat.username, match[1]).then(res => {
        bot.sendMessage(msg.chat.id, `Поздравляем, ${msg.chat.username}! Вы успешно зарегестрированы и можете пересылать сообщения через http://kokorev-test:8020/`)
    })
})


bot.onText(/\/stop/, (msg) => {
    const id = msg.chat.id
    bot.sendMessage(id, 'До свидания!')
    delete_user(id)
})

app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.listen(8000)

app.post('/', (req, res) => {
    console.log(req.body)
    if (req.body) {
        get_user(req.body.password).then((user) => {
            bot.sendMessage(user.id, req.body.data)
        })
            .catch(err => { })
    }
    res.send()
})