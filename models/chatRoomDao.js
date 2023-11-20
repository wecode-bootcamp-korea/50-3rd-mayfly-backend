const { appDataSource } = require("./datasource");

const createChatRoom = async(userId,hostId) =>{
  return appDataSource.query(`
  INSERT INTO chat(user_id,host_id) VALUES(${userId},${hostId})
  `)
}

const getChatRoom = async(userId)=>{
  return appDataSource.query(`
  SELECT * FROM chat WHERE user_id = '${userId}'
  `)
}

module.exports = {
  createChatRoom,getChatRoom
}