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

module.exports = class coinCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'coin',
      memberName: 'coin',
      group: 'games',
      aliases: ['flip', 'coinflip'],
      description: 'Flips a coin',
      examples: ['coin'],
      guildOnly: false
    });
  }

  run (msg) {
    const coinEmbed = new Discord.MessageEmbed(),
      res = Math.round(Math.randon()) ? 'head' : 'tail';

    coinEmbed
      .setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
      .setImage(res === 'head' ? 'https://favna.s-ul.eu/8ZKmpiKO.png' : 'https://favna.s-ul.eu/NTsDbSUo.png')
      .setTitle(`Flipped ${res}s`);

    deleteCommandMessages(msg, this.client);

    return msg.embed(coinEmbed);
  }
};