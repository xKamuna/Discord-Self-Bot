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

const dym = require('didyoumean2'),
  fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require(path.join(__dirname, '../../util.js'));

module.exports = class sendEmojiCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'emojis',
      memberName: 'emojis',
      group: 'images',
      aliases: ['emoji', 'emo', 'sendemo', 'emosend', 'sendemoji'],
      description: 'Send an emoji',
      format: 'EmojiName [MessageToSendWithEmoji]',
      examples: ['sendemoji thonk'],
      guildOnly: false,
      args: [
        {
          key: 'emoji',
          prompt: 'What emoji do you want send?',
          type: 'string',
          parse: p => p.toLowerCase()
        }, {
          key: 'message',
          prompt: 'Content to send along with the emoji?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  run (msg, {emoji, message}) {
    try {
      deleteCommandMessages(msg, this.client);

      return msg.say(message, {files: [path.join(__dirname, `../../data/images/emojis/${emoji}.png`)]});
    } catch (err) {
      const matchList = fs.readdirSync(path.join).map(v => v.slice(0, 4)),
        maybe = dym(emoji, matchList, {deburr: true});

      return msg.reply(oneLine`that emoji does not exist! ${maybe 
        ? oneLine`Did you mean \`${maybe}\`?` 
        : 'You can add it to the folder then try again'}`);
    }
  }
};