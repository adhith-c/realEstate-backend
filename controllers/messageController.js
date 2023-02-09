const Message = require("../models/message");
const { validateMessage } = require("../utils/validator");

exports.addMessage = async (req, res) => {
  const { error, value } = validateMessage(req.body);
  if (!error) {
    const { chatId, senderId, text } = req.body;
    const message = new Message({ chatId, senderId, text });
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    console.log(error);
    res.json({ error });
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
