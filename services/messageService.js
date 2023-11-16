const messageDao = require('../models/messageDao')

const createMessage = async(sender,content,chatId) =>{
  message = await messageDao.createMessage(sender,content,chatId)
  return message
}

const getAllMessages = async (id) => {
  const messages = await messageDao.getAllMessages(id);
  return messages;
};

module.exports = {
  createMessage,getAllMessages
}