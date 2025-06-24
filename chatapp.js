const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let chats = [];

app.post('/chats', async (req, res) => {
  const userMessage = {
    id: Math.floor(Math.random() * 1000),
    message: req.body.message,
    sender: req.body.sender || 'user',
  };

  chats.push(userMessage);

  try {
    // Updated model name - use "gemini-1.5-flash" or "gemini-1.5-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: userMessage.message }],
          
        },
      ],
    });

    const result = await chat.sendMessage(userMessage.message);
    const replyText = result.response.text();

    const botMessage = {
      id: Math.floor(Math.random() * 1000),
      message: replyText.trim(),
      sender: "gemini",
    };

    chats.push(botMessage);

    res.status(201).json({
      user: userMessage,
      reply: botMessage,
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      error: err.message || "Gemini API failed",
    });
  }
});

app.get('/chats', (req, res) => {
  res.status(200).json(chats);  });
  app.put('/chats/:id', (req, res) => {
    const chatId = parseInt(req.params.id, 10);
    const chat = chats.find(c => c.id === chatId);

    if (chat) {
      chat.message = req.body.message || chat.message;
      chat.sender = req.body.sender || chat.sender;
      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  });
  app.delete('/chats/:id', (req, res) => {
    const chatId = parseInt(req.params.id, 10); 
const chatIndex = chats.findIndex(c => c.id === chatId);

    if (chatIndex !== -1) {
      chats.splice(chatIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } );
  app.get('/chats/:id', (req, res) => {
    const chatId = parseInt(req.params.id, 10); 
    const chat = chats.find(c => c.id === chatId);
    const botMessage = chats.find(c => c.sender === 'gemini' && c.id === chatId);

    if (chat) {
      if (botMessage) {
        chat.reply = botMessage.message;
      } else {
        chat.reply = "No reply from bot";
      }
      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }});
const PORT = process.env.PORT || 7000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
