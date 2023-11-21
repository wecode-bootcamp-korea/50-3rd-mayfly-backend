const chatRoomDao = require('../models/chatRoomDao')

const createChatRoom = async(userId,hostId) =>{
  const chatRoom = await chatRoomDao.createChatRoom(userId,hostId)
  return chatRoom
}
const getChatRoom = async(id) =>{
  const chatRoom = await chatRoomDao.getChatRoom(id)
  return chatRoom
}

module.exports = {
  createChatRoom,
  getChatRoom
}