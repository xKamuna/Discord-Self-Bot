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
 * @file Extra CopyPastaCommand - Sends one of your saved copypastas  
 * Save copypastas in the data/pastas folder in .txt format  
 * If the copypasta has an image URL and the total length is less than 1024 characters it will be embedded along with the image  
 * **Aliases**: `cp`, `pasta`
 * @module
 * @category extra
 * @name copypasta
 * @example copypasta navy
 * @param {StringResolvable} PastaName Name of the copypasta to send
 * @returns {MessageEmbed} Copypasta content. In a normal message if more than 1024 characters
 */

const dym = require('didyoumean2'),
  fs = require('fs'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages, stopTyping, startTyping} = require('../../util.js');

module.exports = class CopyPastaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'copypasta',
      memberName: 'copypasta',
      group: 'extra',
      aliases: ['cp', 'pasta'],
      description: 'Sends contents of a copypasta file to the chat',
      format: 'CopypastaName',
      examples: ['copypasta navy'],
      guildOnly: false,
      args: [
        {
          key: 'name',
          prompt: 'Send which copypasta?',
          type: 'string',
          parse: p => p.toLowerCase()
        }
      ]
    });
  }

  run (msg, {name}) {
    startTyping(msg);
    try {
      let pastaContent = fs.readFileSync(path.join(__dirname, `../../data/pastas/${name}.txt`), 'utf8');

      if (pastaContent.length <= 1024) {
        /* eslint-disable no-nested-ternary */
        const cpEmbed = new MessageEmbed(),
          ext = pastaContent.includes('.png') ? '.png'
            : pastaContent.includes('.jpg') ? '.jpg'
              : pastaContent.includes('.gif') ? '.gif'
                : pastaContent.includes('.webp') ? '.webp' : 'none',
          header = ext !== 'none' ? pastaContent.includes('https') ? 'https' : 'http' : 'none';
        /* eslint-enable no-nested-ternary */

        if (ext !== 'none' && header !== 'none') {
          cpEmbed.setImage(`${pastaContent.substring(pastaContent.indexOf(header), pastaContent.indexOf(ext))}${ext}`);
          pastaContent = pastaContent.substring(0, pastaContent.indexOf(header) - 1) + pastaContent.substring(pastaContent.indexOf(ext) + ext.length);
        }

        cpEmbed
          .setDescription(pastaContent)
          .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00');

        msg.delete();
        stopTyping(msg);

        return msg.embed(cpEmbed);
      }
      msg.delete();
      stopTyping(msg);

      return msg.say(pastaContent, {split: true});
    } catch (err) {
      console.error(err);
      deleteCommandMessages(msg, this.client);
      stopTyping(msg);

      const matchList = fs.readdirSync(path.join(__dirname, '../../data/pastas/')).map(v => v.slice(0, -4)),
        maybe = dym(name, matchList, {deburr: true});

      return msg.reply(oneLine`that copypasta does not exist! ${maybe 
        ? oneLine`Did you mean \`${maybe}\`?` 
        : `You can save it with \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}copypastaadd <filename> <content>\``}`);
    }
  }
};