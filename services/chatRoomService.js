const chatRoomDao = require('../models/chatRoomDao')

const createChatRoom = async(userId,hostId) =>{
  const chatRoom = await chatRoomDao.createChatRoom(userId,hostId)
  return chatRoom
}

module.exports = {
  createChatRoom
}