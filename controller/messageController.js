const  messageService  = require('../services/messageService');

const createMessage = async (req, res) => {
  try {
    const {content,chatId } = req.body;
    let sender
    if(req.users){
      sender = req.users.name
    }else if(req.hosts){
      sender = req.hosts.name
      console.log(sender)
    }
    // io.sockets.emit("message",{
    //   content: message.content,
    //   name: message.name
    // });
    const message = await messageService.createMessage(sender,content,chatId)
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllMessages = async (req, res) => {
  const id = req.params.id
  const {name,email,phone_number} = req.users
  try {
    if(name){
      const messages = await messageService.getAllMessages(id);
      res.status(200).json(messages);

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createMessage,
  getAllMessages
};
