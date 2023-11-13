const messageDao = require('../models/messageDao')

const createMessage = async(name,content,chatId) =>{
  message = await messageDao.createMessage(name,content,chatId)
  return message
}

const getAllMessages = async (id) => {
  const messages = await messageDao.getAllMessages(id);
  return messages;
};

module.exports = {
  createMessage,getAllMessages
}