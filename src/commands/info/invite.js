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
 * @file Info InviteCommand - Shill the selfbot everywhere you want :^)  
 * **Aliases**: `inv`, `links`, `shill`
 * @module
 * @category info
 * @name invite
 * @returns {MessageEmbed} Invite link along with other links
 */

const {MessageEmbed} = require('discord.js'), 
  {Command} = require('discord.js-commando'), 
  {stripIndents} = require('common-tags'), 
  {deleteCommandMessages} = require('../../util.js');

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      memberName: 'invite',
      group: 'info',
      aliases: ['inv', 'links', 'shill'],
      description: 'Shill the selfbot everywhere you want :^)',
      examples: ['invite'],
      guildOnly: false
    });
  }

  run (msg) {
    const shillEmbed = new MessageEmbed();

    shillEmbed
      .setTitle('Discord-Self-Bot by Favna')
      .setThumbnail('https://favna.xyz/images/appIcons/selfbot.png')
      .setURL('https://favna.xyz/selfbot')
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setDescription(stripIndents`Empower your Discord experience with a fully modular and expansive set of commands\n
      [Website](https://favna.xyz/selfbot)
      [Join the Support Server](https://favna.xyz/redirect/server)
      [GitHub](https://github.com/Favna/Discord-Self-Bot)
      [Wiki](https://github.com/Favna/Discord-Self-Bot/wiki)
      `);

    deleteCommandMessages(msg, this.client);

    return msg.embed(shillEmbed);
  }
};