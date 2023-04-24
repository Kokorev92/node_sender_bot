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



async function get_db_data() {
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

    // const usr = await users_db.create({
    //     id: 111111,
    //     t_login: 'pidr',
    //     pass: 'govnoed'
    // })

    const users_list = await users_db.findAll()

    sequelize.close()

    users_list.forEach(elem => {
        console.log(elem.id + ' ' + elem.t_login + ' ' + elem.pass)
    })
}

get_db_data()
// bot.onText(/\/start/, (msg) => {
//     const id = msg.chat.id
//     bot.sendMessage(id, 'Привет ' + msg.chat.username)
//     // TODO: add user to database
// })


// bot.onText(/\/stop/, (msg) => {
//     const id = msg.chat.id
//     bot.sendMessage(id, 'До свидания!')
//     // TODO: delete user from database 
// })

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