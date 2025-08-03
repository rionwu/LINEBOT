const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'lt1lfYUGbxXpOzFDmy5fediwVTjLRA7CUMVjmf8o0CeEa4t6IKlItCIlENl6tFEnT7lgqEzoM1S8UGIz4/x9SDQ+aI1EHAAcyRXdVmtCyPIHyDNsWaRtaNnB+hfpNF2KI36fZE9bq4z8CaCRpY/A2AdB04t89/1O/w1cDnyilFU=', // 替換成你的 Channel Access Token
  channelSecret: 'a3715ad3d6d352129720badd356f7e56' // 替換成你的 Channel Secret
};

const app = express();
const client = new line.Client(config);

app.post('/callback', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, { type: 'text', text: event.message.text });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});