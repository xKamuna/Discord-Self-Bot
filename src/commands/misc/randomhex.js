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

const Discord = require('discord.js'),
  {Command} = require('discord.js-commando'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class RandomHexCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'randomhex',
      memberName: 'randomhex',
      group: 'misc',
      aliases: ['randhex', 'rhex', 'randomcolor', 'randcol'],
      description: 'Generate a random hexadecimal color',
      examples: ['randomhex'],
      guildOnly: false
    });
  }

  run (msg) {
    const embed = new Discord.MessageEmbed(),
      hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    embed
      .setColor(hex)
      .setDescription(hex);

    deleteCommandMessages(msg, this.client);

    msg.embed(embed);
  }
};