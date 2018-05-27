/* eslint-disable no-mixed-requires, sort-vars, one-var */
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});
const DiscordSelfBot = require(path.join(__dirname, 'DiscordSelfBot.js')),
  start = function () {
    console.log(process.env.token);
    new DiscordSelfBot(process.env.token).init();
  };

start();