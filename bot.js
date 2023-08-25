const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');

const token = '6527514678:AAF0UiQas94oyH8qTzXmSb7TypRnETvqzdA';
const bot = new TelegramBot(token, { polling: true });

const projects = {
  '1': 'https://project1link.com',
  '2': 'https://project2link.com',
  '3': 'https://project3link.com',
  '4': 'https://project2link.com',
  // Add more project IDs and links here
};

const userStates = {}; // To keep track of user's current state

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  bot.sendMessage(chatId, `Hello ${username}! Welcome to the project bot. Please enter a project ID:`);
  userStates[chatId] = 'waiting_for_project_id';
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  
  if (userStates[chatId] === 'waiting_for_project_id') {
    if (projects[message]) {
      // Project ID found
      const projectLink = projects[message];
      userStates[chatId] = 'waiting_for_completion';

      bot.sendMessage(chatId, `Found a project! Here's the link: ${projectLink}`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'search others project', callback_data: 'completed' }],
          ],
        },
      });
    } else {
      bot.sendMessage(chatId, 'Project ID not found. Please enter a valid project ID:');
    }
  } else if (userStates[chatId] === 'waiting_for_completion') {
    if (message === 'check other') {
      bot.sendMessage(chatId, 'Congratulations on completing the project! If you need more links, enter a project ID:');
      userStates[chatId] = 'waiting_for_project_id';
    }
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'completed' && userStates[chatId] === 'waiting_for_completion') {
    bot.sendMessage(chatId, 'Enter New Project ID Whose Code You Want');
    userStates[chatId] = 'waiting_for_project_id';
  }
});
