require('dotenv').config();
const token = process.env.TOKEN;
const {startGameOptions, gameNumbersOptions, gameAgainOptions} = require('./options.js')
const TelegramBot = require('node-telegram-bot-api');
const options = require('./options');

const bot = new TelegramBot(token, {polling: true});
let numbers = {};

bot.setMyCommands([
  {command: '/start', description: "Say Hello"},
  {command: '/game', description: "Play a game"},
])

const sendMessage = async (text, chat_id) => {
  if (text === "/start") {
    await bot.sendSticker(chat_id, 'https://tlgrm.eu/_/stickers/3d2/135/3d213551-8cac-45b4-bdf3-e24a81b50526/1.webp');
    await bot.sendMessage(chat_id, "Привет! Я Анджелла. \n \nЯ могу сыграть с тобой в игру и больше я ничего не могу. \n \nПоиграем?", startGameOptions);
  } else if (text === "/game") {
    playGame(chat_id);
  } else {
    return bot.sendMessage(chat_id, `Я тебя не поняла, попробуй еще раз!`);
  }
}

const playGame = async (chat_id) => {
  numbers.chat_id = Math.floor(Math.random() * 10);
  await bot.sendMessage(chat_id, `Я загадала число от 0 до 9. \n\n Угадай какое!`, gameNumbersOptions);
}


bot.on('message', async msg => {
  const text = msg.text;
  const chat_id = msg.chat.id;

  await sendMessage(text, chat_id);
})

bot.on('callback_query', cbq => {
  const data = cbq.data;
  const chat_id = cbq.message.chat.id;
  const number = numbers.chat_id;

  if (data === '/agreetoplay') {
    return playGame(chat_id);

  } else if (data === '/disagreetoplay') {
    return bot.sendMessage(chat_id, 'пидора ответ!');

  } else if (data === '/again') {
    return playGame(chat_id);

  } else if (parseInt(data) === number) {
    bot.sendMessage(chat_id, `Твое число ${number}. Да! Это я и загадала!`);
    return bot.sendSticker(chat_id, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/7.webp', gameAgainOptions);

  } else {
    return bot.sendMessage(chat_id, `Нет, не правильно. Твое число ${data}, а я загадала ${number}`, gameAgainOptions);
  }

})
