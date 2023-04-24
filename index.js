const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const settings = require('./settings.json')
const Sequelize = require('sequelize')

// const bot = new TelegramBot(settings.token, { polling: true })
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

async function get_db_data() {
    const users_list = await users_db.findAll()

    users_list.forEach(elem => {
        console.log(elem.id + ' ' + elem.t_login + ' ' + elem.pass)
    })
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

// bot.onText(/\/start/, (msg) => {
//     const id = msg.chat.id
//     bot.sendMessage(id, 'Привет ' + msg.chat.username)
//     // TODO: add user to database
// })


// bot.onText(/\/stop/, (msg) => {
//     const id = msg.chat.id
//     bot.sendMessage(id, 'До свидания!')
//     delete_user(id)
// })

// add_user(12345, 'User', 'pas1234')
// delete_user(12345)

app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.listen(8000)

app.post('/', (req, res) => {
    console.log(req.body)
    if (req.body) {
        // bot.sendMessage(settings.id, req.body.data)
    }
    res.send()
})