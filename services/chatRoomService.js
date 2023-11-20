const chatRoomDao = require('../models/chatRoomDao')

const createChatRoom = async(userId,hostId) =>{
  const chatRoom = await chatRoomDao.createChatRoom(userId,hostId)
  return chatRoom
}
const getChatRoom = async(userId) =>{
  const chatRoom = await chatRoomDao.getChatRoom(userId)
  return chatRoom
}

module.exports = {
  createChatRoom,
  getChatRoom
}