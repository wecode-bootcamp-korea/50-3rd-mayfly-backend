const { appDataSource } = require("./datasource");

const createMessage = async(sender,content,chatId) =>{
  const result = await appDataSource.query(`
  INSERT INTO message(chat_id,content,sender,created_at) 
  VALUES('${chatId}','${content}','${sender}',NOW())
  `)
  return result;
}

const getAllMessages = async (id) => {
  const messages = await appDataSource.query(`
  SELECT message.content, message.created_at, users.name AS user_name, hosts.name AS host_name
  FROM message
  JOIN chat ON message.chat_id = chat.id
  JOIN users ON chat.user_id = users.id
  JOIN hosts ON chat.host_id = hosts.id
  WHERE chat_id = ${id}
  ORDER BY message.created_at DESC;
  `);
  return messages;
};


module.exports = {
  createMessage,
  getAllMessages
}