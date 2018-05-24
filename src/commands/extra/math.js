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
 * @file Extra MathCommand - Take the effort out of calculations and let the bot do it for you  
 * **Aliases**: `maths`, `calc`
 * @module
 * @category extra
 * @name math
 * @example math (PI - 1) * 3
 * @param {StringResolvable} Equation The equation to solve
 * @returns {MessageEmbed} Your equation and its answer
 */

const scalc = require('scalc'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class MathCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'math',
      memberName: 'math',
      group: 'extra',
      aliases: ['calc', 'maths'],
      description: 'Take the effort out of calculations and let the bot do it for you',
      format: 'EquationToSolve',
      examples: ['math -10 - abs(-3) + 2^5'],
      guildOnly: false,
      args: [
        {
          key: 'equation',
          prompt: 'What is the equation to solve?',
          type: 'string',
          parse: p => p.toLowerCase()
        }
      ]
    });
  }

  run (msg, {equation}) {
    try {
      const mathEmbed = new MessageEmbed(),
        res = scalc(equation);

      mathEmbed
        .setTitle('Calculator')
        .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
        .setDescription(oneLine`The answer to \`${equation.toString()}\` is \`${res}\``);

      deleteCommandMessages(msg, this.client);

      return msg.embed(mathEmbed);
    } catch (err) {
      deleteCommandMessages(msg, this.client);

      return msg.reply(oneLine`\`${equation.toString()}\` is is not a valid equation for this command.
          Check out this readme to see how to use the supported polish notation: https://github.com/dominhhai/calculator/blob/master/README.md`);
    }
  }
};