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

const {Command} = require('discord.js-commando'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class rpdetailsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rpdetails',
      memberName: 'rpdetails',
      group: 'provider',
      aliases: ['details', 'rpdetail'],
      description: 'Set your Rich Presence details',
      format: 'DetailsText',
      examples: ['rpappid Made by Favna'],
      guildOnly: false,
      args: [
        {
          key: 'details',
          prompt: 'What is the detail string for your richpresence?',
          type: 'string',
          label: 'details',
          validate: (details) => {
            if (Buffer.byteLength(details, 'utf8') <= 128) {
              return true;
            }

            return 'The detail string cannot be longer than 128 UTF-8 bytes';
          }
        }
      ]
    });
  }

  run (msg, args) {
    this.client.provider.set('global', 'rpdetails', args.details);

    deleteCommandMessages(msg, this.client);

    return msg.reply(oneLine`Your RichPresence Details have been set to \`${args.details}\``);
  }
};