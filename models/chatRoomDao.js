const { appDataSource } = require("./datasource");

const createChatRoom = async(userId,hostId) =>{
  return appDataSource.query(`
  INSERT INTO chat(user_id,host_id) VALUES(${userId},${hostId})
  `)
}

const getChatRoom = async(id)=>{
  return appDataSource.query(`
  SELECT * FROM chat WHERE host_id = '${id}'
  `)
}

module.exports = {
  createChatRoom,getChatRoom
}