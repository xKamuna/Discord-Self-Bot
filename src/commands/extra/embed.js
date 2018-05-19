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
 * @file Extra EmbedCommand - Create custom MessageEmbeds on the fly  
 * **Aliases**: `cplist`, `copylist`, `pastalist`
 * @module
 * @category extra
 * @name copypastalist
 * @returns {MessageEmbed} List of all available copypastas
 */

const {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages, startTyping, stopTyping} = require('../../util.js');

module.exports = class EmbedCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'embed',
      memberName: 'embed',
      group: 'extra',
      aliases: ['emb', 'embeds'],
      description: 'Create custom MessageEmbeds on the fly',
      format: 'FieldName>Value1[;Value2<FieldName2>Value1;Value2] [ImageURL]',
      examples: ['embed What goes up but never comes down?>Your Age'],
      guildOnly: false,
      args: [
        {
          key: 'content',
          prompt: 'What should the content of the embed be?',
          type: 'string',
          validate: (input) => {
            if (input.match(/(?:[\S ]+)>(?:[\S ]+).*/gim)) { // eslint-disable-line max-len
              return true;
            }

            return 'The format for a custom rich embed should at least be `FieldName>Value`';
          },
          wait: 60
        },
        {
          key: 'image',
          prompt: 'Any image to send into the embed?',
          type: 'string',
          default: '',
          validate: (url) => {
            if (url.match(/(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg|svg))/im)) {
              return true;
            }

            return 'Image URl has to be an actual URL';
          }
        }
      ]
    });
  }

  run (msg, {content, image}) {
    startTyping(msg);
    const customEmbed = new MessageEmbed(),
      paramString = content,
      fields = paramString.split('<'); // eslint-disable-line sort-vars

    fields.forEach((field) => {
      const chunks = field.split('>'),
        header = chunks[0],
        values = chunks[1].split(';');

      customEmbed.addField(header, values.join('\n'), true);
    });

    customEmbed
      .setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
      .setImage(image ? image : null);

    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(customEmbed);
  }
};