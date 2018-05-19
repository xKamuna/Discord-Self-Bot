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
 * @file Extra EmbedCommand - Get a list of all copypastas  
 * **Aliases**: `cplist`, `copylist`, `pastalist`
 * @module
 * @category extra
 * @name copypastalist
 * @returns {MessageEmbed} List of all available copypastas
 */

const fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {splitMessage} = require('discord.js'),
  {stripIndents} = require('common-tags'),
  {deleteCommandMessages, stopTyping, startTyping} = require('../../util.js');

module.exports = class CopyPastaListCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'copypastalist',
      memberName: 'copypastalist',
      group: 'extra',
      aliases: ['cplist', 'copylist', 'pastalist'],
      description: 'Get a list of all copypastas',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run (msg) {
    try {
      startTyping(msg);
      const list = fs.readdirSync(path.join(__dirname, '../../data/pastas/')).filter(e => e !== '.gitkeep');

      if (list && list.length) {
        for (const entry in list) {
          list[entry] = `- \`${list[entry].slice(0, -4)}\``;
        }
      }
    
      deleteCommandMessages(msg, this.client);

      if (list.join('\n').length >= 2000) {
        const messages = [],
          splitTotal = splitMessage(stripIndents`${list.join('\n')}`);

        for (const part in splitTotal) {
          messages.push(await msg.embed({
            title: 'Copypastas available for you',
            description: splitTotal[part],
            color: msg.guild.me.displayColor
          }));
        }
        stopTyping(msg);

        return messages;
      }

      stopTyping(msg);

      return msg.embed({
        title: 'Copypastas available for you',
        description: list.join('\n'),
        color: msg.guild.me.displayColor
      });

    } catch (err) {
      deleteCommandMessages(msg, this.client);
      stopTyping(msg);

      return msg.reply(`no copypastas found for you. Start saving your first with \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}copypastaadd\`!`);
    }
  }
};