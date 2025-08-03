const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const LINE_CHANNEL_ACCESS_TOKEN ='lt1lfYUGbxXpOzFDmy5fediwVTjLRA7CUMVjmf8o0CeEa4t6IKlItCIlENl6tFEnT7lgqEzoM1S8UGIz4/x9SDQ+aI1EHAAcyRXdVmtCyPIHyDNsWaRtaNnB+hfpNF2KI36fZE9bq4z8CaCRpY/A2AdB04t89/1O/w1cDnyilFU=';

// 處理Webhook事件，記錄用戶ID
app.post('/webhook', (req, res) => {
  const events = req.body.events;
  events.forEach(event => {
    console.log(`Received event: ${JSON.stringify(event)}`); // 確保完整記錄事件內容
    if (event.source && event.source.type === 'user') { // 處理來自用戶的事件
      const userId = event.source.userId;
      console.log(`Received message from user ID: ${userId}`); // 記錄用戶ID
    } else if (event.source && event.source.type === 'group') { // 處理來自群組的事件
      const groupId = event.source.groupId;
      const userId = event.source.userId;
      console.log(`Received message from user ID: ${userId} in group ID: ${groupId}`); // 記錄用戶和群組ID
    }
  });
  res.status(200).send('Webhook received!');
});

// 處理通知請求，發送Google行事曆的內容到群組或私訊
app.post('/notify', async (req, res) => {
  const recipientId = req.body.recipientId;
  const message = req.body.message;
  console.log(`Received notify request for recipientId: ${recipientId} with message: ${message}`);
  await notifyLine(message, recipientId); // 使用傳遞的ID
  res.status(200).send('Notification sent!');
});

async function notifyLine(message, recipientId) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: recipientId, // 使用傳遞的ID
      messages: [{
        type: 'text',
        text: message
      }]
    })
  };
  try {
    console.log('Sending message to LINE:', options.body); // 日誌請求的內容
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('LINE API response:', data); // 日誌LINE API的回應
    if (!response.ok) {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Error sending LINE message:', error); // 日誌錯誤訊息
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
