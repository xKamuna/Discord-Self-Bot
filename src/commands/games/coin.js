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
 * @file Games CoinCommand - Flips a coin  
 * **Aliases**: `flip`, `coinflip`
 * @module
 * @category games
 * @name coin
 * @returns {MessageEmbed} Side the coin landed on
 */

const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js'), 
  {deleteCommandMessages, roundNumber} = require('../../util.js');

module.exports = class CoinCommand extends Command {
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
    const coinEmbed = new MessageEmbed(),
      flip = roundNumber(Math.random());

    coinEmbed
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setImage(flip === 1 ? 'https://favna.xyz/images/ribbonhost/dndheads.png' : 'https://favna.xyz/images/ribbonhost/dndtails.png')
      .setTitle(`Flipped ${flip === 1 ? 'heads' : 'tails'}`);

    deleteCommandMessages(msg, this.client);

    return msg.embed(coinEmbed);
  }
};