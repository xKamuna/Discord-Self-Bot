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
 * @file Extra CopyPastaAddCommand - Save a new copypasta to the database  
 * **Aliases**: `cpadd`, `pastaadd`
 * @module
 * @category extra
 * @name copypastaadd
 * @example copypastaadd lipsum Lorem ipsum dolor sit amet. 
 * @param {StringResolvable} PasteName Name for the new pasta
 * @param {StringResolvable} PastaContent Content for the new pasta
 * @returns {Message} Confirmation the copypasta was added
 */

const Database = require('better-sqlite3'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
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
    const conn = new Database(path.join(__dirname, '../../data/databases/pastas.sqlite3')),
      pastaAddEmbed = new MessageEmbed();

    pastaAddEmbed
      .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({format: 'png'}))
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setDescription(content);

    try {
      const query = conn.prepare('SELECT name FROM pastas WHERE name = ?;').get(name);

      if (query) {
        conn.prepare('UPDATE pastas SET content=$content WHERE name=$name').run({
          name,
          content
        });

        pastaAddEmbed.setTitle(`Copypasta \`${name}\` Updated`);

        deleteCommandMessages(msg, this.client);

        return msg.embed(pastaAddEmbed);
      }
      conn.prepare('INSERT INTO pastas VALUES ($name, $content);').run({
        name,
        content
      });
      pastaAddEmbed.setTitle(`Copypasta \`${name}\` Added`);

      return msg.embed(pastaAddEmbed);
    } catch (err) {
      if (/(?:no such table)/i.test(err.toString())) {
        conn.prepare('CREATE TABLE IF NOT EXISTS pastas (name TEXT PRIMARY KEY, content TEXT);').run();

        conn.prepare('INSERT INTO pastas VALUES ($name, $content);').run({
          name,
          content
        });
        pastaAddEmbed.setTitle(`Copypasta \`${name}\` Added`);

        return msg.embed(pastaAddEmbed);
      }

      return msg.reply('an unknown error occurred there :(');
    }
  }
};