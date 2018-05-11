/**
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

const Database = require('better-sqlite3'),
  path = require('path'),
  {Client, FriendlyError, SyncSQLiteProvider} = require('discord.js-commando'),
  {WebhookClient, MessageEmbed} = require('discord.js'),
  {oneLine, stripIndents} = require('common-tags');

class DiscordSelfBot {
  constructor (token) {
    this.token = token;
    this.client = new Client({
      owner: process.env.owner,
      commandPrefix: process.env.prefix.toLowerCase().includes('favna') ? '$' : process.env.prefix,
      selfbot: true,
      unknownCommandResponse: false
    });
  }

  onCmdBlock () {
    return (msg, reason) => {
      console.log(oneLine`
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
		blocked; ${reason}`);
    };
  }

  onCmdErr () {
    return (cmd, err) => {
      if (err instanceof FriendlyError) {
        return;
      }
      console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    };
  }

  onCommandPrefixChange () {
    return (guild, prefix) => {
      console.log(oneLine` 
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    };
  }

  onCmdStatusChange () {
    return (guild, command, enabled) => {
      console.log(oneLine`
            Command ${command.groupID}:${command.memberName}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    };
  }

  onDisconnect () {
    return () => {
      console.warn('Disconnected!');
    };
  }

  onError () {
    return (e) => {
      console.error(e);
    };
  }

  onGroupStatusChange () {
    return (guild, group, enabled) => {
      console.log(oneLine`
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    };
  }


  onReady () {
    return () => {
      console.log(stripIndents`Client ready
			logged in as ${this.client.user.tag} (${this.client.user.id})
			Prefix set to ${this.client.commandPrefix}
			Use ${this.client.commandPrefix}help to view the commands list!`);
      this.client.user.setAFK(true); // Set bot to AFK to enable mobile notifications
    };
  }

  onMessage () {
    return (msg) => {

      if (this.client.provider.get('global', 'webhooktoggle', false) && msg.author.id !== process.env.owner && !msg.mentions.users.get(process.env.owner)) {
        const hookClient = new WebhookClient(process.env.webhookid, process.env.webhooktoken, {disableEveryone: true}),
          mentionEmbed = new MessageEmbed(),
          regexpExclusions = [],
          regexpKeywords = [],
          wnsExclusions = this.client.provider.get('global', 'webhookexclusions', ['none']),
          wnsKeywords = this.client.provider.get('global', 'webhookkeywords', ['username', 'nickname']);

        for (const keyword in wnsKeywords) {
          const regex = new RegExp(`.*${wnsKeywords[keyword]}.*`, 'im');

          regexpKeywords.push(regex);
        }

        for (const exclusion in wnsExclusions) {
          const regex = new RegExp(`.*${wnsExclusions[exclusion]}.*`, 'im');

          regexpExclusions.push(regex);
        }

        if (regexpKeywords.find(rx => rx.test(msg.cleanContent))) {

          if (!regexpExclusions.find(rx => rx.test(msg.cleanContent))) {
            mentionEmbed
              .setAuthor(msg.channel.type === 'text'
                ? `${msg.member ? msg.member.displayName : 'someone'} dropped your name in #${msg.channel.name} in ${msg.guild.name}`
                : `${msg.author.username} sent a message with your name`, msg.author.displayAvatarURL())
              .setFooter('Message date')
              .setTimestamp(msg.createdAt)
              .setColor(msg.member ? msg.member.displayHexColor : '#535B62')
              .setThumbnail(msg.author.displayAvatarURL())
              .addField('Message Content', msg.cleanContent.length > 1024 ? msg.cleanContent.slice(0, 1024) : msg.cleanContent)
              .addField('Message Attachments', msg.attachments.first() && msg.attachments.first().url ? msg.attachments.map(au => au.url) : 'None');

            hookClient.send(`Stalkify away <@${process.env.owner}>`, {embeds: [mentionEmbed]}).catch(console.error);
          }
        }
      }

      if (this.client.provider.get('global', 'channellinktoggle', false) && msg.guild) {
        const dataArr = this.client.provider.get('global', 'clconfig', []),
          forwardEmbed = new MessageEmbed();

        if (dataArr.length !== 0 && msg.guild.id === dataArr[0][0] && msg.channel.id === dataArr[0][1]) {
          forwardEmbed
            .setColor(msg.member ? msg.member.displayHexColor : '#FF0000')
            .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({format: 'png'}))
            .setTitle(`Message from ${this.client.guilds.get(dataArr[0][0]).channels.get(dataArr[0][1]).name} on ${this.client.guilds.get(dataArr[1][0]).name}`)
            .setDescription(msg.content)
            .setFooter('Message date')
            .setTimestamp(msg.createdAt);

          this.client.guilds.get(dataArr[1][0]).channels.get(dataArr[1][1]).send({embed: forwardEmbed});
        }
      }
    };
  }

  onReconnect () {
    return () => {
      console.warn('Reconnecting...');
    };
  }

  init () {
    this.client
      .on('commandBlocked', this.onCmdBlock())
      .on('commandError', this.onCmdErr())
      .on('commandPrefixChange', this.onCommandPrefixChange())
      .on('commandStatusChange', this.onCmdStatusChange())
      .on('debug', console.log)
      .on('disconnect', this.onDisconnect())
      .on('error', console.error)
      .on('groupStatusChange', this.onGroupStatusChange())
      .on('message', this.onMessage())
      .on('ready', this.onReady())
      .on('reconnecting', this.onReconnect())
      .on('warn', console.warn);

    const db = new Database(path.join(__dirname, 'data/databases/settings.sqlite3'));

    this.client.setProvider(
      new SyncSQLiteProvider(db)
    );

    this.client.registry
      .registerGroups([
        ['emojis', '"Global" emojis as images'],
        ['fun', 'Fun and Games to play with the bot'],
        ['info', 'Get Information on various things'],
        ['links', 'Quick Website Links'],
        ['memes', 'React with memes'],
        ['misc', 'Commands that cannot be categorized elsewhere'],
        ['nsfw', 'Find NSFW content ( ͡° ͜ʖ ͡°)'],
        ['pokedex', 'Get information from the PokéDex'],
        ['provider', 'Control your data stored in the client provider'],
        ['search', 'Search the web'],
        ['status', 'Set your status'],
        ['themeplaza', 'Browse ThemePlaza']
      ])
      .registerDefaultGroups()
      .registerDefaultTypes()
      .registerDefaultCommands({
        help: true,
        prefix: true,
        ping: true,
        eval_: true,
        commandState: true
      })
      .registerCommandsIn(path.join(__dirname, 'commands'));

    return this.client.login(this.token);
  }
}

module.exports = DiscordSelfBot;