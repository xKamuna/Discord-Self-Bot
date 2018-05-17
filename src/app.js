/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable no-mixed-requires, sort-vars, one-var */
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});
const DiscordSelfBot = require(path.join(__dirname, 'DiscordSelfBot.js')),
  start = function () {
    console.log(process.env.token);
    new DiscordSelfBot(process.env.token).init();
  };

start();