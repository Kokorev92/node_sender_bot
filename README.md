# Сервер для пересылки сообщений из веб-формы в бота Телеграм

Данный проект разработан для обхода блокировок телеграма в корпоративных сетях и т.п.

Проект является NodeJS версией такого же бота на Python: [bot_resender](https://github.com/Kokorev92/bot_resender)

Для запуска необходимо в корне проекта создать файл bot_settings.json и внести в него токен бота и id пользователя, которому пересылать сообщения:

```json
{
  "token" : "<insert token here>",
  "client_id" : "<insert user id here>"
}
```

# Установка и запуск
 
 - В каталоге с проектом выполнить `npm install .`
 - После установки зависимостей запустить командой `npm start .`

 Так же в проекте присутсвуте докер файл для сборки образа и контенеризации приложения.