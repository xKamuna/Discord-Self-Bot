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

/**
 * @file Extra CopyPastaAddCommand - Adds a new copypasta for your server  
 * **Aliases**: `cpadd`, `pastaadd`
 * @module
 * @category extra
 * @name copypastaadd
 * @example copypastaadd lipsum Lorem ipsum dolor sit amet. 
 * @param {StringResolvable} PasteName Name for the new pasta
 * @param {StringResolvable} PastaContent Content for the new pasta
 * @returns {Message} Confirmation the copypasta was added
 */

const fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class CopyPastaAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'copypastaadd',
      memberName: 'copypastaadd',
      group: 'extra',
      aliases: ['cpadd', 'pastaadd'],
      description: 'Saves a copypasta to local file',
      format: 'CopypastaName CopypastaContent',
      examples: ['copypasta navy what the fuck did you just say to me ... (etc.)'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'Send which copypasta?',
          type: 'string',
          parse: p => p.toLowerCase()
        },
        {
          key: 'content',
          prompt: 'What should be stored in the copypasta?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {name, content}) {
    fs.writeFileSync(path.join(__dirname, `pastas/${name}.txt`), content, 'utf8');

    if (fs.existsSync(path.join(__dirname, `pastas/${name}.txt`))) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(`Copypasta stored in ${name}.txt. You can summon it with ${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}copypasta ${name}`);
    }

    return msg.reply('an error occurred and your pasta was not saved.');
  }
};