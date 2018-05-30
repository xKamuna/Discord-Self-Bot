/* eslint-disable no-mixed-requires, sort-vars, one-var */
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});
const DiscordSelfBot = require(path.join(__dirname, 'DiscordSelfBot.js')),
  start = function () {
    new DiscordSelfBot(process.env.token).init();
  },
  heroku = function () {
    /* eslint-disable */
    const express = require('express');
    const app = express();
    const PORT = 8080;

    app
      .set('view engine', 'html')
      .use(express.static(path.join(__dirname, 'heroku')))
      .all('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'heroku/heroku.html'));
      })
      .listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
      });
      /* eslint-enable */
  };

if (process.env.heroku) {
  heroku();
  start();
} else {
  start();
}