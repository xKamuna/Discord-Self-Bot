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

const Matcher = require('didyoumean2'),
  {Command} = require('discord.js-commando'),
  fs = require('fs'),
  path = require('path'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

const emojis = fs.readdirSync(path.join(__dirname, 'images')); // eslint-disable-line one-var
let detailString = '';

for (const emoji in emojis) {
  detailString += `${emojis[emoji].slice(0, emojis[emoji].length - 4)}, `;
}

module.exports = class sendEmojiCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'sendemoji',
      memberName: 'sendemoji',
      group: 'emojis',
      aliases: ['emoji', 'emo', 'sendemo', 'emosend'],
      description: 'Send an emoji',
      details: `Available emojis: ${detailString}`,
      format: 'EmojiName [MessageToSendWithEmoji]',
      examples: ['sendemoji thonk'],
      guildOnly: false,
      args: [
        {
          key: 'emojiName',
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

  run (msg, args) {
    const match = new Matcher();

    match.values = emojis;

    const dym = match.get(`${args.emojiName}.png`), // eslint-disable-line one-var
      dymString = dym !== null
        ? oneLine`Did you mean \`${dym}\`?`
        : oneLine`Add it to the images folder!`;

    deleteCommandMessages(msg, this.client);

    return msg.say(args.message, {files: [path.join(__dirname, `images/${args.emojiName}.png`)]}).catch((err) => { // eslint-disable-line handle-callback-err, no-unused-vars
      msg.reply(`⚠️ that emoji does not exist! ${dymString}`);
    });
  }
};