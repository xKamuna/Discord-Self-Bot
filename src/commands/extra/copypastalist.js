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

const Database = require('better-sqlite3'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {splitMessage} = require('discord.js'),
  {stripIndents} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

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
    const conn = new Database(path.join(__dirname, '../../data/databases/pastas.sqlite3'));

    try {
      // eslint-disable-next-line newline-per-chained-call
      const list = conn.prepare('SELECT name FROM pastas;').all().map(p => p.name);

      if (list && list.length) {
        for (const entry in list) {
          list[entry] = `- \`${list[entry]}\``;
        }
      }

      deleteCommandMessages(msg, this.client);

      if (list.join('\n').length >= 2048) {
        const messages = [],
          splitTotal = splitMessage(stripIndents`${list.join('\n')}`);

        for (const part in splitTotal) {
          messages.push(await msg.embed({
            title: 'Available Copypastas',
            description: splitTotal[part],
            color: msg.guild.me.displayColor
          }));
        }

        return messages;
      }

      return msg.embed({
        title: 'Available Copypastas',
        description: list.join('\n'),
        color: msg.guild.me.displayColor
      });

    } catch (err) {
      deleteCommandMessages(msg, this.client);
      if (/(?:no such table)/i.test(err.toString())) {
        return msg.reply(`no pastas saved yet. Start saving your first with \`${msg.guild.commandPrefix}copypastaadd <name> <content>\``);
      }

      return msg.reply('an unknown error occurred there :(');
    }
  }
};