const { appDataSource } = require("./datasource");

const createChatRoom = async(userId,hostId) =>{
  return appDataSource.query(`
  INSERT INTO chat(user_id,host_id) VALUES(${userId},${hostId})
  `)
}

const getChatRoom = async(id)=>{
  return appDataSource.query(`
  SELECT chat.id,
  chat.host_id as host_id,
  hosts.name as host_name,
  chat.user_id as user_id,
  users.name as user_name
  FROM chat
  JOIN users ON chat.user_id = users.id
  JOIN hosts ON chat.host_id = hosts.id
  WHERE chat.host_id = ${id};
  `)
}

module.exports = {
  createChatRoom,getChatRoom
}