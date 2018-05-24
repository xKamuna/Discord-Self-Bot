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
 * @file Games DiceCommand - Rolls some dice with some sides. Great for the DnD players!  
 * **Aliases**: `xdicey`, `roll`, `dicey`, `die`
 * @module
 * @category games
 * @name dice
 * @example dice 5 6
 * @param {StringResolvable} DiceSides The amount of sides the dice should have
 * @param {StringResolvable} AmountOfRolls The amount of dice to roll
 * @returns {MessageEmbed} The eyes rolled for each dice as well as the total of all rolls
 */

const xdicey = require('xdicey'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class diceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'dice',
      memberName: 'dice',
      group: 'games',
      aliases: ['xdicey', 'roll', 'dicey', 'die'],
      description: 'Rolls some dice with some sides. Great for the DnD players!',
      format: 'SidesOfTheDice AmountOfRolls',
      examples: ['dice 6 5'],
      guildOnly: false,
      args: [
        {
          key: 'sides',
          prompt: 'How many sides does your die have?',
          type: 'integer'
        }, {
          key: 'rolls',
          prompt: 'How many times should the die be rolled?',
          type: 'integer'
        }
      ]
    });
  }

  run (msg, {sides, rolls}) {
    const diceEmbed = new MessageEmbed(),
      res = [],
      throwDice = xdicey(rolls, sides);


    for (const i in throwDice.individual) {
      res.push(`${throwDice.individual[i]}`);
    }


    diceEmbed
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setTitle('🎲 Dice Rolls 🎲')
      .setDescription(`| ${res.join(' | ')} |`)
      .addField('Total', throwDice.total, false);

    deleteCommandMessages(msg, this.client);

    return msg.embed(diceEmbed);
  }
};