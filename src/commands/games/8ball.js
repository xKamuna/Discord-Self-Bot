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
 * @file Games EightBallCommand - Rolls a magic 8 ball using your input  
 * **Aliases**: `eightball`
 * @module
 * @category games
 * @name 8ball
 * @example 8ball is Favna a genius coder?
 * @param {StringResolvable} question Question you want the 8 ball to answer
 * @returns {MessageEmbed} Your question and its answer
 */

const predict = require('eightball'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class eightBallCommand extends Command {
  constructor (client) {
    super(client, {
      name: '8ball',
      memberName: '8ball',
      group: 'games',
      aliases: ['eightball'],
      description: 'Roll a magic 8ball',
      format: 'YourQuestion',
      examples: ['8ball is Favna a genius coder?'],
      guildOnly: false,
      args: [
        {
          key: 'question',
          prompt: '8ball what?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {question}) {
    const eightBallEmbed = new MessageEmbed();

    eightBallEmbed
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .addField(':question: Question', question, false)
      .addField(':8ball: 8ball', predict(), false);

    deleteCommandMessages(msg, this.client);

    return msg.embed(eightBallEmbed);
  }
};