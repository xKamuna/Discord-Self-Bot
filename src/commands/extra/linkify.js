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
 * @file Extra LinkifyCommand - Easily get a URL for any upload  
 * This is the for mobile users ;)
 * Send this command when uploading anything and the bot will reply with the URL
 * **Aliases**: `link`, `imglink`
 * @module
 * @category extra
 * @name linkify
 * @returns {Message} URL of whatever you uploaded
 */

const {Command} = require('discord.js-commando');

module.exports = class LinkifyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'linkify',
      memberName: 'linkify',
      group: 'extra',
      aliases: ['link', 'imglink'],
      description: 'Easily get a URL for any upload',
      details: 'This is for the mobile users ;)\nSend this command when uploading anything and the bot will reply with the URL',
      guildOnly: false
    });
  }

  run (msg) {
    if (msg.attachments.first() && msg.attachments.first().url) {
      return msg.say(msg.attachments.first().url);
    }
		
    return msg.delete();
  }
};