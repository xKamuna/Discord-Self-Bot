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
 * @file Info EmotesCommand - Lists all emotes from the server  
 * **Aliases**: `listemo`, `emolist`, `listemoji`, `emote`
 * @module
 * @category info
 * @name emotes
 * @returns {MessageEmbed} List of emotes
 */

const {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class EmotesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'emotes',
      memberName: 'emotes',
      group: 'info',
      aliases: ['listemo', 'emolist', 'listemoji', 'listemojis'],
      description: 'Gets all available custom emojis from a server',
      format: 'ServerID|ServerName(partial or full)',
      examples: ['emotes Bots By Favna'],
      guildOnly: false,
      args: [
        {
          key: 'server',
          prompt: 'What server would you like the emojis from?',
          type: 'guild',
          default: ''
        }
      ]
    });
  }

  run (msg, {server}) {
    const embed = new MessageEmbed();

    server = server ? server : msg.guild;

    let animEmotes = [],
      staticEmotes = [];

    server.emojis.forEach((e) => {
      e.animated ? animEmotes.push(`<a:${e.name}:${e.id}>`) : staticEmotes.push(`<:${e.name}:${e.id}>`);
    });

    embed
      .setColor(server.me.displayHexColor)
      .setAuthor(`${staticEmotes.length + animEmotes.length} ${server.name} Emotes`, server.iconURL({format: 'png'}))
      .setTimestamp();

    staticEmotes = staticEmotes.length !== 0 ? `__**${staticEmotes.length} Static Emotes**__\n${staticEmotes.join('')}` : '';
    animEmotes = animEmotes.length !== 0 ? `\n\n__**${animEmotes.length} Animated Emotes**__\n${animEmotes.join('')}` : '';

    embed.setDescription(staticEmotes + animEmotes);

    deleteCommandMessages(msg, this.client);

    return msg.embed(embed);
  }
};