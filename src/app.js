/* eslint-disable no-mixed-requires, sort-vars, one-var, global-require */
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});
const DiscordSelfBot = require(path.join(__dirname, 'DiscordSelfBot.js')),
  start = function () {
    new DiscordSelfBot(process.env.token).init();
  },
  heroku = function () {
    const fs = require('fs'),
      http = require('http'),
      PORT = 5000;

    const server = http.createServer((req, res) => { // eslint-disable-line one-var
      res.writeHead(200, {'Content-Type': 'text/html'});

      fs.createReadStream(path.resolve(__dirname, 'heroku/heroku.html')).pipe(res);
    });

    server.listen(PORT, () => {
      console.log('Heroku Webserver Started');
    });
  };

if (process.env.heroku) {
  heroku();
  start();
} else {
  start();
}