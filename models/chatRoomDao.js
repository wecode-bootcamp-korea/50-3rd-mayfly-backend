const { appDataSource } = require("./datasource");

const createChatRoom = async(userId,hostId) =>{
  return appDataSource.query(`
  INSERT INTO chat(user_id,host_id) VALUES(${userId},${hostId})
  `)
}

module.exports = {
  createChatRoom
}