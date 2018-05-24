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
 * @file Info ServerInfoCommand - Gets information about any server you're in  
 * **Aliases**: `serverinfo`, `sinfo`
 * @module
 * @category info
 * @name server
 * @returns {MessageEmbed} Info about the server
 */

const moment = require('moment'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {deleteCommandMessages} = require('../../util.js');

module.exports = class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      memberName: 'server',
      group: 'info',
      aliases: ['serverinfo', 'sinfo'],
      description: 'Gets information about any server you\'re in',
      format: 'ServerID|ServerName(partial or full)',
      examples: ['server Bots by Favna'],
      guildOnly: false,
      args: [
        {
          key: 'server',
          prompt: 'Get info from which server?',
          type: 'guild',
          default: 'current'
        }
      ]
    });
  }

  contentFilter (filter) {
    switch (filter) {
    case 0:
      return 'Content filter disabled';
    case 1:
      return 'Scan messages of members without a role';
    case 2:
      return 'Scan messages sent by all members';
    default:
      return 'Content Filter unknown';
    }
  }

  verificationFilter (filter) {
    switch (filter) {
    case 0:
      return 'None - unrestricted';
    case 1:
      return 'Low - must have verified email on account';
    case 2:
      return 'Medium - must be registered on Discord for longer than 5 minutes';
    case 3:
      return 'High - 	(╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes';
    case 4:
      return 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number';
    default:
      return 'Verification Filter unknown';
    }
  }

  run (msg, {server}) {
    if (msg.channel.type !== 'text' && server === 'current') {
      return msg.reply('An argument of server name (partial or full) or server ID is required when talking outside of a server');
    }

    const guild = server === 'current' ? msg.guild : server,
      channels = guild.channels.map(ty => ty.type), // eslint-disable-line sort-vars
      presences = guild.presences.map(st => st.status),
      serverEmbed = new MessageEmbed();

    let guildChannels = 0,
      onlineMembers = 0;

    for (const i in presences) {
      if (presences[i] !== 'offline') {
        onlineMembers += 1;
      }
    }
    for (const i in channels) {
      if (channels[i] === 'text') {
        guildChannels += 1;
      }
    }

    serverEmbed
      .setColor(guild.owner ? guild.owner.displayHexColor : '#FF0000')
      .setAuthor('Server Info', 'https://favna.s-ul.eu/O0qc0yt7.png')
      .setThumbnail(guild.iconURL({format: 'png'}))
      .setFooter(`Server ID: ${guild.id}`)
      .addField('Server Name', guild.name, true)
      .addField('Owner', guild.owner ? guild.owner.user.tag : 'Owner is MIA', true)
      .addField('Members', guild.memberCount, true)
      .addField('Currently Online', onlineMembers, true)
      .addField('Region', guild.region, true)
      .addField('Highest Role', guild.roles.sort((a, b) => a.position - b.position || a.id - b.id).last().name, true)
      .addField('Number of emojis', guild.emojis.size, true)
      .addField('Number of roles', guild.roles.size, true)
      .addField('Number of channels', guildChannels, true)
      .addField('Created At', moment(guild.createdTimestamp).format('MMMM Do YYYY [at] HH:mm'), false)
      .addField('Verification Level', this.verificationFilter(guild.verificationLevel), false)
      .addField('Explicit Content Filter', this.contentFilter(guild.explicitContentFilter), false);

    guild.splashURL() !== null ? serverEmbed.setImage(guild.splashURL()) : null;

    deleteCommandMessages(msg, this.client);

    return msg.embed(serverEmbed);
  }
};